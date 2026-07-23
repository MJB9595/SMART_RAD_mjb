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

	/** 처음 접속한 카카오 계정 처리: 같은 이메일 계정이 있으면 자동 연동, 없으면 회원가입 대기큐로. */
	private KakaoLoginResult firstContact(KakaoUserResponse kakaoUser, String providerUserId) {
		KakaoUserResponse.KakaoAccount account = kakaoUser.account();
		if (account == null
				|| account.email() == null
				|| !Boolean.TRUE.equals(account.emailValid())
				|| !Boolean.TRUE.equals(account.emailVerified())) {
			throw ApiException.unauthorized("최초 연결에는 인증된 카카오 이메일 제공 동의가 필요합니다.");
		}
		String email = account.email();

		Optional<Employee> existing = employeeRepository.findByEmailAndDeletedFalse(email);
		if (existing.isPresent()) {
			// 기존 가입 정보와 동일한 이메일 → 기존 계정에 자동 연동 후 로그인.
			Employee employee = existing.get();
			ensureLoginAllowed(employee);
			if (employeeOAuthRepository.existsByEmployee_IdAndProvider(employee.getId(), OAuthProvider.KAKAO)) {
				throw ApiException.conflict("이 교직원 계정에는 다른 카카오 계정이 이미 연결되어 있습니다.");
			}
			employeeOAuthRepository.save(EmployeeOAuth.link(employee, OAuthProvider.KAKAO, providerUserId, email));
			return KakaoLoginResult.loggedIn(authService.issueToken(employee));
		}

		// 완전히 새로운 이메일 → 회원가입 승인 대기큐로 유입 (관리자 매칭 승인 필요).
		String name = email.contains("@") ? email.substring(0, email.indexOf('@')) : email;
		signupService.requestFromOAuth(email, name, OAuthProvider.KAKAO, providerUserId);
		return KakaoLoginResult.pendingApproval(
				"회원가입 승인 요청이 접수되었습니다. 관리자 승인 후 카카오 로그인으로 이용할 수 있습니다.");
	}

	private void ensureLoginAllowed(Employee employee) {
		if (employee.isDeleted() || employee.getEmploymentStatus() == EmploymentStatus.RESIGNED) {
			throw ApiException.unauthorized("사용할 수 없는 교직원 계정입니다.");
		}
	}
}
