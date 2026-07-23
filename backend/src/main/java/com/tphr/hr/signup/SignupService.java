package com.tphr.hr.signup;

import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import com.tphr.hr.oauth.EmployeeOAuth;
import com.tphr.hr.oauth.EmployeeOAuthRepository;
import com.tphr.hr.oauth.OAuthProvider;
import com.tphr.hr.signup.dto.SignupCreateRequest;
import com.tphr.hr.signup.dto.SignupResponse;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SignupService {

	private final SignupRequestRepository signupRequestRepository;
	private final ApprovalSlotRepository slotRepository;
	private final EmployeeRepository employeeRepository;
	private final EmployeeOAuthRepository employeeOAuthRepository;
	private final PasswordEncoder passwordEncoder;

	/** 회원가입 신청 (공개). 이미 가입된 이메일이거나 대기 중인 신청이 있으면 거절. */
	@Transactional
	public void request(SignupCreateRequest req) {
		if (employeeRepository.existsByEmail(req.email())) {
			throw ApiException.conflict("이미 가입된 이메일입니다.");
		}
		if (signupRequestRepository.existsByEmailAndStatusAndDeletedFalse(req.email(), SignupStatus.PENDING)) {
			throw ApiException.conflict("이미 승인 대기 중인 신청입니다.");
		}
		SignupRequest signup = SignupRequest.builder()
				.name(req.name())
				.email(req.email())
				.password(passwordEncoder.encode(req.password()))
				.school(req.school())
				.build();
		signupRequestRepository.save(signup);
	}

	/** 승인 대기 목록 (관리자). */
	public List<SignupResponse> getPending() {
		return signupRequestRepository
				.findByStatusAndDeletedFalseOrderByRequestedAtAsc(SignupStatus.PENDING)
				.stream().map(SignupResponse::from).toList();
	}

	/**
	 * 승인 = 신청건(신원) ↔ 자리(직위·권한) 매칭 (관리자).
	 * 신청건의 이름/이메일/비밀번호 + 선택한 자리의 소속/직급/임용구분/구분/권한으로 로그인 가능한 교직원 계정을 생성한다.
	 */
	@Transactional
	public void approve(Long signupId, Long slotId, Long processorId) {
		SignupRequest signup = findPending(signupId);
		ApprovalSlot slot = slotRepository.findByIdAndDeletedFalse(slotId)
				.orElseThrow(() -> ApiException.notFound("승인 자리를 찾을 수 없습니다. id=" + slotId));
		if (slot.getStatus() != SlotStatus.OPEN) {
			throw ApiException.conflict("이미 채워진 자리입니다.");
		}
		if (employeeRepository.existsByEmail(signup.getEmail())) {
			throw ApiException.conflict("이미 가입된 이메일입니다.");
		}

		Employee employee = Employee.builder()
				.employeeNumber(generateEmployeeNumber(signup.getId()))
				.name(signup.getName())
				.email(signup.getEmail())
				.password(signup.getPassword()) // 이미 BCrypt 해시
				.staffCategory(slot.getStaffCategory())
				.department(slot.getDepartment())
				.position(slot.getPosition())
				.employmentType(slot.getEmploymentType())
				.role(slot.getRole())
				.hireDate(slot.getHireDate() != null ? slot.getHireDate() : LocalDate.now())
				.build();
		employeeRepository.save(employee);

		slot.fill(employee.getId());
		signup.approve(processorId);

		// 카카오 등 OAuth에서 유입된 신청이면, 승인과 동시에 소셜 계정을 연동해 이후 소셜 로그인으로 접속 가능.
		if (signup.getOauthProvider() != null) {
			employeeOAuthRepository.save(EmployeeOAuth.link(
					employee, signup.getOauthProvider(), signup.getOauthProviderUserId(), signup.getEmail()));
		}
	}

	/**
	 * OAuth(카카오) 최초 로그인 시 매칭되는 교직원이 없으면 승인 대기큐에 신청을 등록한다.
	 * 이미 같은 이메일로 대기 중인 신청이 있으면 중복 생성하지 않는다.
	 */
	@Transactional
	public void requestFromOAuth(String email, String name, OAuthProvider provider, String providerUserId) {
		if (signupRequestRepository.existsByEmailAndStatusAndDeletedFalse(email, SignupStatus.PENDING)) {
			return;
		}
		// 소셜 계정은 비밀번호 로그인을 쓰지 않으므로 추측 불가한 랜덤 해시를 저장.
		String randomHash = passwordEncoder.encode(UUID.randomUUID().toString());
		signupRequestRepository.save(
				SignupRequest.forOAuth(name, email, randomHash, "(카카오 로그인 가입)", provider, providerUserId));
	}

	/**
	 * 매치 해제 = 잘못된 승인 되돌리기 (관리자).
	 * 자리를 다시 OPEN, 신청건을 승인 대기큐로 복귀, 소셜 연동 제거, 잘못 생성된 계정을 삭제한다.
	 * (계정을 완전 삭제해 이메일·사번을 해제하므로 올바른 자리로 재매칭할 수 있다.)
	 */
	@Transactional
	public void unmatch(Long employeeId) {
		Employee employee = employeeRepository.findByIdAndDeletedFalse(employeeId)
				.orElseThrow(() -> ApiException.notFound("교직원을 찾을 수 없습니다. id=" + employeeId));
		ApprovalSlot slot = slotRepository.findByFilledEmployeeIdAndDeletedFalse(employeeId)
				.orElseThrow(() -> ApiException.badRequest(
						"승인 매칭으로 생성된 계정이 아니어서 매치 해제할 수 없습니다."));

		// 승인됐던 신청건을 다시 대기큐로 (이메일 기준).
		signupRequestRepository.findByEmailAndStatusAndDeletedFalse(employee.getEmail(), SignupStatus.APPROVED)
				.ifPresent(SignupRequest::resetToPending);

		// 소셜 연동 제거 (FK 때문에 계정 삭제 전에 먼저 반영).
		employeeOAuthRepository.deleteAll(employeeOAuthRepository.findByEmployee_Id(employeeId));
		employeeOAuthRepository.flush();

		// 자리 원복.
		slot.reopen();

		// 잘못 생성된 계정 삭제 → 이메일/사번 해제로 재매칭 가능.
		employeeRepository.delete(employee);
	}

	/** 거절 (관리자). */
	@Transactional
	public void reject(Long signupId, Long processorId) {
		findPending(signupId).reject(processorId);
	}

	private SignupRequest findPending(Long id) {
		return signupRequestRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("회원가입 신청을 찾을 수 없습니다. id=" + id));
	}

	private String generateEmployeeNumber(Long signupId) {
		return "SU" + String.format("%06d", signupId);
	}
}
