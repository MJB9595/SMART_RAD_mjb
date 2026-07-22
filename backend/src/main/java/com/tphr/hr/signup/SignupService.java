package com.tphr.hr.signup;

import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import com.tphr.hr.signup.dto.SignupCreateRequest;
import com.tphr.hr.signup.dto.SignupResponse;
import java.time.LocalDate;
import java.util.List;
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
