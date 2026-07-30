package com.tphr.hr.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final String BEARER_PREFIX = "Bearer ";

	private final JwtTokenProvider jwtTokenProvider;
	private final CustomUserDetailsService userDetailsService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String token = resolveToken(request);

		if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
			String email = jwtTokenProvider.getEmail(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(email);

			// 이미 발급된 토큰이라도, 역할이 비활성화되면 그 즉시 막아야 한다.
			// (로그인 때만 검사하면 로그인 상태인 사용자는 계속 쓸 수 있다)
			if (userDetails instanceof CustomUserDetails details && details.isBlocked()) {
				writeBlocked(response);
				return;
			}

			UsernamePasswordAuthenticationToken authentication =
					new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
			authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}

		filterChain.doFilter(request, response);
	}

	/** 공통 예외 포맷(status/message)에 맞춰 403 을 직접 쓴다 — 필터 단계라 @RestControllerAdvice 가 걸리지 않는다. */
	private void writeBlocked(HttpServletResponse response) throws IOException {
		response.setStatus(HttpServletResponse.SC_FORBIDDEN);
		response.setContentType("application/json;charset=UTF-8");
		response.getWriter().write("{\"timestamp\":\"" + LocalDateTime.now() + "\",\"status\":403,\"message\":\""
				+ AccessProfile.BLOCKED_MESSAGE + "\",\"errors\":[]}");
	}

	private String resolveToken(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
			return bearerToken.substring(BEARER_PREFIX.length());
		}
		return null;
	}
}
