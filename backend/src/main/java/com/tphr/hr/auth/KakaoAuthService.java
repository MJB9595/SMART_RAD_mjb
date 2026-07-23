package com.tphr.hr.auth;

import com.tphr.hr.auth.client.KakaoOAuthClient;
import com.tphr.hr.auth.dto.KakaoLoginResult;
import com.tphr.hr.auth.dto.KakaoTokenResponse;
import com.tphr.hr.auth.dto.KakaoUserResponse;
import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import com.tphr.hr.employee.EmploymentStatus;
import com.tphr.hr.oauth.EmployeeOAuth;
import com.tphr.hr.oauth.EmployeeOAuthRepository;
import com.tphr.hr.oauth.OAuthProvider;
import com.tphr.hr.signup.SignupService;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class KakaoAuthService {

	private final KakaoOAuthClient kakaoOAuthClient;
	private final EmployeeOAuthRepository employeeOAuthRepository;
	private final EmployeeRepository employeeRepository;
	private final AuthService authService;
	private final SignupService signupService;

	@Transactional
	public KakaoLoginResult login(String code) {
		KakaoTokenResponse token = kakaoOAuthClient.exchangeCode(code);
		KakaoUserResponse kakaoUser = kakaoOAuthClient.getUser(token.accessToken());

		if (kakaoUser.id() == null) {
			throw ApiException.unauthorized("카카오 회원번호를 확인할 수 없습니다.");
		}

		String providerUserId = kakaoUser.id().toString();
		Optional<EmployeeOAuth> linked =
				employeeOAuthRepository.findByProviderAndProviderUserId(OAuthProvider.KAKAO, providerUserId);
		if (linked.isPresent()) {
			// 이미 연동된 카카오 계정 → 바로 로그인.
			Employee employee = linked.get().getEmployee();
			ensureLoginAllowed(employee);
			return KakaoLoginResult.loggedIn(authService.issueToken(employee));
		}
		return firstContact(kakaoUser, providerUserId);
	}

	/**
	 * 처음 접속한 카카오 계정 처리.
	 * - 카카오 이메일이 기존 교직원과 일치 → 기존 계정에 자동 연동(보안상 인증된 이메일에 한함).
	 * - 일치하는 계정이 없음 → 카카오 정보(닉네임·있으면 이메일)로 회원가입 승인 대기큐에 유입.
	 *   (이메일 미제공/미인증이어도 큐로 보낸다. 실제 계정은 관리자가 자리와 매칭 승인할 때 생성됨)
	 */
	private KakaoLoginResult firstContact(KakaoUserResponse kakaoUser, String providerUserId) {
		KakaoUserResponse.KakaoAccount account = kakaoUser.account();
		String email = (account != null) ? account.email() : null;

		if (email != null) {
			Optional<Employee> existing = employeeRepository.findByEmailAndDeletedFalse(email);
			if (existing.isPresent()) {
				// 기존 가입 정보와 동일한 이메일 → 기존 계정에 자동 연동 후 로그인.
				// 계정 탈취 방지를 위해 이 경로에서만 인증된 카카오 이메일을 요구한다.
				if (!isEmailVerified(account)) {
					throw ApiException.unauthorized(
							"이미 가입된 이메일입니다. 기존 계정과 카카오를 연동하려면 카카오에서 이메일 제공·인증에 동의해 주세요.");
				}
				Employee employee = existing.get();
				ensureLoginAllowed(employee);
				if (employeeOAuthRepository.existsByEmployee_IdAndProvider(employee.getId(), OAuthProvider.KAKAO)) {
					throw ApiException.conflict("이 교직원 계정에는 다른 카카오 계정이 이미 연결되어 있습니다.");
				}
				employeeOAuthRepository.save(EmployeeOAuth.link(employee, OAuthProvider.KAKAO, providerUserId, email));
				return KakaoLoginResult.loggedIn(authService.issueToken(employee));
			}
		}

		// 매칭되는 기존 계정 없음 → 카카오 정보로 회원가입 승인 대기큐에 유입.
		// 이메일이 없으면 카카오 회원번호 기반 식별자로 대체(로그인은 소셜 연동으로 하므로 문제없음).
		String queueEmail = (email != null) ? email : "kakao_" + providerUserId + "@kakao.local";
		String name = resolveKakaoName(account, email, providerUserId);
		signupService.requestFromOAuth(queueEmail, name, OAuthProvider.KAKAO, providerUserId);
		return KakaoLoginResult.pendingApproval(
				"회원가입 승인 요청이 접수되었습니다. 관리자 승인 후 카카오 로그인으로 이용할 수 있습니다.");
	}

	private boolean isEmailVerified(KakaoUserResponse.KakaoAccount account) {
		return account != null
				&& Boolean.TRUE.equals(account.emailValid())
				&& Boolean.TRUE.equals(account.emailVerified());
	}

	/** 대기큐 표시용 이름: 카카오 닉네임 > 이메일 앞부분 > 카카오회원번호 순으로 사용. */
	private String resolveKakaoName(KakaoUserResponse.KakaoAccount account, String email, String providerUserId) {
		if (account != null && account.profile() != null && StringUtils.hasText(account.profile().nickname())) {
			return account.profile().nickname();
		}
		if (email != null && email.contains("@")) {
			return email.substring(0, email.indexOf('@'));
		}
		return "카카오사용자" + providerUserId;
	}

	private void ensureLoginAllowed(Employee employee) {
		if (employee.isDeleted() || employee.getEmploymentStatus() == EmploymentStatus.RESIGNED) {
			throw ApiException.unauthorized("사용할 수 없는 교직원 계정입니다.");
		}
	}
}
