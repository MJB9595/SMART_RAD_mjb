package com.tphr.hr.auth;

import com.tphr.hr.auth.client.KakaoOAuthClient;
import com.tphr.hr.auth.dto.KakaoTokenResponse;
import com.tphr.hr.auth.dto.KakaoUserResponse;
import com.tphr.hr.auth.dto.LoginResponse;
import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import com.tphr.hr.employee.EmploymentStatus;
import com.tphr.hr.oauth.EmployeeOAuth;
import com.tphr.hr.oauth.EmployeeOAuthRepository;
import com.tphr.hr.oauth.OAuthProvider;
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

	@Transactional
	public LoginResponse login(String code) {
		KakaoTokenResponse token = kakaoOAuthClient.exchangeCode(code);
		KakaoUserResponse kakaoUser = kakaoOAuthClient.getUser(token.accessToken());

		if (kakaoUser.id() == null) {
			throw ApiException.unauthorized("카카오 회원번호를 확인할 수 없습니다.");
		}

		String providerUserId = kakaoUser.id().toString();
		Employee employee = employeeOAuthRepository
				.findByProviderAndProviderUserId(OAuthProvider.KAKAO, providerUserId)
				.map(EmployeeOAuth::getEmployee)
				.orElseGet(() -> linkFirstLogin(kakaoUser, providerUserId));

		ensureLoginAllowed(employee);
		return authService.issueToken(employee);
	}

	private Employee linkFirstLogin(KakaoUserResponse kakaoUser, String providerUserId) {
		KakaoUserResponse.KakaoAccount account = kakaoUser.account();
		if (account == null
				|| account.email() == null
				|| !Boolean.TRUE.equals(account.emailValid())
				|| !Boolean.TRUE.equals(account.emailVerified())) {
			throw ApiException.unauthorized("최초 연결에는 인증된 카카오 이메일 제공 동의가 필요합니다.");
		}

		Employee employee = employeeRepository.findByEmailAndDeletedFalse(account.email())
				.orElseThrow(() -> ApiException.unauthorized("카카오 이메일과 일치하는 교직원 계정이 없습니다."));

		ensureLoginAllowed(employee);
		if (employeeOAuthRepository.existsByEmployee_IdAndProvider(employee.getId(), OAuthProvider.KAKAO)) {
			throw ApiException.conflict("이 교직원 계정에는 다른 카카오 계정이 이미 연결되어 있습니다.");
		}

		employeeOAuthRepository.save(EmployeeOAuth.link(
				employee,
				OAuthProvider.KAKAO,
				providerUserId,
				account.email()
		));
		return employee;
	}

	private void ensureLoginAllowed(Employee employee) {
		if (employee.isDeleted() || employee.getEmploymentStatus() == EmploymentStatus.RESIGNED) {
			throw ApiException.unauthorized("사용할 수 없는 교직원 계정입니다.");
		}
	}
}
