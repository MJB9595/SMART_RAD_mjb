package com.tphr.hr.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.tphr.hr.auth.client.KakaoOAuthClient;
import com.tphr.hr.auth.dto.KakaoTokenResponse;
import com.tphr.hr.auth.dto.KakaoUserResponse;
import com.tphr.hr.auth.dto.LoginResponse;
import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import com.tphr.hr.oauth.EmployeeOAuth;
import com.tphr.hr.oauth.EmployeeOAuthRepository;
import com.tphr.hr.oauth.OAuthProvider;
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
				.thenReturn(kakaoUser(1234L, null, null, null));
		when(employeeOAuthRepository.findByProviderAndProviderUserId(OAuthProvider.KAKAO, "1234"))
				.thenReturn(Optional.of(linkedAccount));
		when(linkedAccount.getEmployee()).thenReturn(employee);
		when(authService.issueToken(employee)).thenReturn(expected);

		LoginResponse actual = kakaoAuthService.login("authorization-code");

		assertThat(actual).isSameAs(expected);
		verify(authService).issueToken(employee);
	}

	@Test
	void firstLoginLinksVerifiedKakaoEmailToExistingEmployee() {
		Employee employee = org.mockito.Mockito.mock(Employee.class);
		LoginResponse expected = org.mockito.Mockito.mock(LoginResponse.class);
		when(employee.getId()).thenReturn(10L);

		when(kakaoOAuthClient.exchangeCode("authorization-code"))
				.thenReturn(new KakaoTokenResponse("kakao-access-token"));
		when(kakaoOAuthClient.getUser("kakao-access-token"))
				.thenReturn(kakaoUser(5678L, "teacher@example.com", true, true));
		when(employeeOAuthRepository.findByProviderAndProviderUserId(OAuthProvider.KAKAO, "5678"))
				.thenReturn(Optional.empty());
		when(employeeRepository.findByEmailAndDeletedFalse("teacher@example.com"))
				.thenReturn(Optional.of(employee));
		when(employeeOAuthRepository.existsByEmployee_IdAndProvider(10L, OAuthProvider.KAKAO))
				.thenReturn(false);
		when(authService.issueToken(employee)).thenReturn(expected);

		LoginResponse actual = kakaoAuthService.login("authorization-code");

		ArgumentCaptor<EmployeeOAuth> captor = ArgumentCaptor.forClass(EmployeeOAuth.class);
		verify(employeeOAuthRepository).save(captor.capture());
		assertThat(captor.getValue().getProvider()).isEqualTo(OAuthProvider.KAKAO);
		assertThat(captor.getValue().getProviderUserId()).isEqualTo("5678");
		assertThat(captor.getValue().getProviderEmail()).isEqualTo("teacher@example.com");
		assertThat(captor.getValue().getEmployee()).isSameAs(employee);
		assertThat(actual).isSameAs(expected);
	}

	@Test
	void firstLoginRejectsMissingOrUnverifiedEmail() {
		when(kakaoOAuthClient.exchangeCode("authorization-code"))
				.thenReturn(new KakaoTokenResponse("kakao-access-token"));
		when(kakaoOAuthClient.getUser("kakao-access-token"))
				.thenReturn(kakaoUser(9999L, "teacher@example.com", true, false));
		when(employeeOAuthRepository.findByProviderAndProviderUserId(OAuthProvider.KAKAO, "9999"))
				.thenReturn(Optional.empty());

		assertThatThrownBy(() -> kakaoAuthService.login("authorization-code"))
				.isInstanceOf(ApiException.class)
				.hasMessageContaining("인증된 카카오 이메일");

		verify(employeeOAuthRepository, org.mockito.Mockito.never()).save(any());
	}

	private KakaoUserResponse kakaoUser(
			Long id,
			String email,
			Boolean emailValid,
			Boolean emailVerified
	) {
		return new KakaoUserResponse(
				id,
				new KakaoUserResponse.KakaoAccount(email, emailValid, emailVerified)
		);
	}
}
