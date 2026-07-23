package com.tphr.hr.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.tphr.hr.auth.client.KakaoOAuthClient;
import com.tphr.hr.auth.dto.KakaoLoginResult;
import com.tphr.hr.auth.dto.KakaoLoginResult.KakaoLoginStatus;
import com.tphr.hr.auth.dto.KakaoTokenResponse;
import com.tphr.hr.auth.dto.KakaoUserResponse;
import com.tphr.hr.auth.dto.LoginResponse;
import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import com.tphr.hr.oauth.EmployeeOAuth;
import com.tphr.hr.oauth.EmployeeOAuthRepository;
import com.tphr.hr.oauth.OAuthProvider;
import com.tphr.hr.signup.SignupService;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class KakaoAuthServiceTest {

	@Mock
	private KakaoOAuthClient kakaoOAuthClient;

	@Mock
	private EmployeeOAuthRepository employeeOAuthRepository;

	@Mock
	private EmployeeRepository employeeRepository;

	@Mock
	private AuthService authService;

	@Mock
	private SignupService signupService;

	@InjectMocks
	private KakaoAuthService kakaoAuthService;

	@Test
	void linkedKakaoAccountLogsInWithoutRelinkingEmployee() {
		Employee employee = org.mockito.Mockito.mock(Employee.class);
		EmployeeOAuth linkedAccount = org.mockito.Mockito.mock(EmployeeOAuth.class);
		LoginResponse expected = org.mockito.Mockito.mock(LoginResponse.class);

		when(kakaoOAuthClient.exchangeCode("authorization-code"))
				.thenReturn(new KakaoTokenResponse("kakao-access-token"));
		when(kakaoOAuthClient.getUser("kakao-access-token"))
				.thenReturn(kakaoUser(1234L, null, null, null, null));
		when(employeeOAuthRepository.findByProviderAndProviderUserId(OAuthProvider.KAKAO, "1234"))
				.thenReturn(Optional.of(linkedAccount));
		when(linkedAccount.getEmployee()).thenReturn(employee);
		when(authService.issueToken(employee)).thenReturn(expected);

		KakaoLoginResult result = kakaoAuthService.login("authorization-code");

		assertThat(result.status()).isEqualTo(KakaoLoginStatus.LOGGED_IN);
		assertThat(result.login()).isSameAs(expected);
		verify(authService).issueToken(employee);
	}

	@Test
	void verifiedKakaoEmailMatchingExistingEmployeeIsAutoLinked() {
		Employee employee = org.mockito.Mockito.mock(Employee.class);
		LoginResponse expected = org.mockito.Mockito.mock(LoginResponse.class);
		when(employee.getId()).thenReturn(10L);

		when(kakaoOAuthClient.exchangeCode("authorization-code"))
				.thenReturn(new KakaoTokenResponse("kakao-access-token"));
		when(kakaoOAuthClient.getUser("kakao-access-token"))
				.thenReturn(kakaoUser(5678L, "teacher@example.com", true, true, "홍길동"));
		when(employeeOAuthRepository.findByProviderAndProviderUserId(OAuthProvider.KAKAO, "5678"))
				.thenReturn(Optional.empty());
		when(employeeRepository.findByEmailAndDeletedFalse("teacher@example.com"))
				.thenReturn(Optional.of(employee));
		when(employeeOAuthRepository.existsByEmployee_IdAndProvider(10L, OAuthProvider.KAKAO))
				.thenReturn(false);
		when(authService.issueToken(employee)).thenReturn(expected);

		KakaoLoginResult result = kakaoAuthService.login("authorization-code");

		ArgumentCaptor<EmployeeOAuth> captor = ArgumentCaptor.forClass(EmployeeOAuth.class);
		verify(employeeOAuthRepository).save(captor.capture());
		assertThat(captor.getValue().getProviderUserId()).isEqualTo("5678");
		assertThat(captor.getValue().getEmployee()).isSameAs(employee);
		assertThat(result.status()).isEqualTo(KakaoLoginStatus.LOGGED_IN);
		assertThat(result.login()).isSameAs(expected);
		verify(signupService, never()).requestFromOAuth(any(), any(), any(), any());
	}

	@Test
	void unverifiedKakaoEmailMatchingExistingEmployeeIsRejected() {
		Employee employee = org.mockito.Mockito.mock(Employee.class);

		when(kakaoOAuthClient.exchangeCode("authorization-code"))
				.thenReturn(new KakaoTokenResponse("kakao-access-token"));
		when(kakaoOAuthClient.getUser("kakao-access-token"))
				.thenReturn(kakaoUser(9999L, "teacher@example.com", true, false, "홍길동"));
		when(employeeOAuthRepository.findByProviderAndProviderUserId(OAuthProvider.KAKAO, "9999"))
				.thenReturn(Optional.empty());
		when(employeeRepository.findByEmailAndDeletedFalse("teacher@example.com"))
				.thenReturn(Optional.of(employee));

		// 계정 탈취 방지: 기존 계정과 연동하려면 인증된 카카오 이메일이 필요.
		assertThatThrownBy(() -> kakaoAuthService.login("authorization-code"))
				.isInstanceOf(ApiException.class)
				.hasMessageContaining("이미 가입된 이메일");

		verify(employeeOAuthRepository, never()).save(any());
		verify(signupService, never()).requestFromOAuth(any(), any(), any(), any());
	}

	@Test
	void newEmailEntersSignupQueueUsingKakaoNickname() {
		when(kakaoOAuthClient.exchangeCode("authorization-code"))
				.thenReturn(new KakaoTokenResponse("kakao-access-token"));
		when(kakaoOAuthClient.getUser("kakao-access-token"))
				.thenReturn(kakaoUser(4242L, "newcomer@example.com", true, true, "새로운사람"));
		when(employeeOAuthRepository.findByProviderAndProviderUserId(OAuthProvider.KAKAO, "4242"))
				.thenReturn(Optional.empty());
		when(employeeRepository.findByEmailAndDeletedFalse("newcomer@example.com"))
				.thenReturn(Optional.empty());

		KakaoLoginResult result = kakaoAuthService.login("authorization-code");

		assertThat(result.status()).isEqualTo(KakaoLoginStatus.PENDING_APPROVAL);
		assertThat(result.login()).isNull();
		// 이름은 카카오 닉네임을 사용한다.
		verify(signupService).requestFromOAuth(
				eq("newcomer@example.com"), eq("새로운사람"), eq(OAuthProvider.KAKAO), eq("4242"));
		verify(employeeOAuthRepository, never()).save(any());
		verify(authService, never()).issueToken(any());
	}

	@Test
	void unverifiedNewEmailStillEntersSignupQueue() {
		// 인증되지 않은 이메일이라도, 일치하는 기존 계정이 없으면 대기큐로 유입되어야 한다.
		when(kakaoOAuthClient.exchangeCode("authorization-code"))
				.thenReturn(new KakaoTokenResponse("kakao-access-token"));
		when(kakaoOAuthClient.getUser("kakao-access-token"))
				.thenReturn(kakaoUser(1212L, "unverified@example.com", false, false, null));
		when(employeeOAuthRepository.findByProviderAndProviderUserId(OAuthProvider.KAKAO, "1212"))
				.thenReturn(Optional.empty());
		when(employeeRepository.findByEmailAndDeletedFalse("unverified@example.com"))
				.thenReturn(Optional.empty());

		KakaoLoginResult result = kakaoAuthService.login("authorization-code");

		assertThat(result.status()).isEqualTo(KakaoLoginStatus.PENDING_APPROVAL);
		// 닉네임이 없으면 이메일 앞부분을 이름으로 사용.
		verify(signupService).requestFromOAuth(
				eq("unverified@example.com"), eq("unverified"), eq(OAuthProvider.KAKAO), eq("1212"));
	}

	@Test
	void missingEmailStillEntersSignupQueueWithSyntheticIdentifier() {
		// 이메일 제공 동의가 없어도(이메일 null), 카카오 회원번호 기반 식별자로 대기큐에 유입.
		when(kakaoOAuthClient.exchangeCode("authorization-code"))
				.thenReturn(new KakaoTokenResponse("kakao-access-token"));
		when(kakaoOAuthClient.getUser("kakao-access-token"))
				.thenReturn(kakaoUser(7777L, null, null, null, "카카오닉"));
		when(employeeOAuthRepository.findByProviderAndProviderUserId(OAuthProvider.KAKAO, "7777"))
				.thenReturn(Optional.empty());

		KakaoLoginResult result = kakaoAuthService.login("authorization-code");

		assertThat(result.status()).isEqualTo(KakaoLoginStatus.PENDING_APPROVAL);
		verify(signupService).requestFromOAuth(
				eq("kakao_7777@kakao.local"), eq("카카오닉"), eq(OAuthProvider.KAKAO), eq("7777"));
		verify(employeeRepository, never()).findByEmailAndDeletedFalse(any());
	}

	private KakaoUserResponse kakaoUser(
			Long id,
			String email,
			Boolean emailValid,
			Boolean emailVerified,
			String nickname
	) {
		KakaoUserResponse.KakaoAccount.Profile profile =
				(nickname == null) ? null : new KakaoUserResponse.KakaoAccount.Profile(nickname);
		return new KakaoUserResponse(
				id,
				new KakaoUserResponse.KakaoAccount(email, emailValid, emailVerified, profile)
		);
	}
}
