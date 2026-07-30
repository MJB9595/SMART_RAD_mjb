package com.tphr.hr.security;

import com.tphr.hr.common.exception.ApiException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

	private SecurityUtils() {
	}

	public static Long getCurrentEmployeeId() {
		return currentUser().getEmployeeId();
	}

	/** 로그인한 사용자가 가진 권한 코드(또는 역할 코드)를 갖고 있는지. */
	public static boolean hasAuthority(String authority) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return authentication != null && authentication.getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals(authority));
	}

	/** 관리자이거나 해당 권한을 가진 사람 — 남의 것까지 다룰 수 있는지 판정할 때 쓴다. */
	public static boolean canActForOthers(String authority) {
		return hasAuthority("ROLE_ADMIN") || hasAuthority(authority);
	}

	/**
	 * 관리자 또는 인사팀.
	 *
	 * <p>복지(경조비·증명서)에는 전용 권한 코드가 없고 승인 판정도 ADMIN/HR 기준이라 여기에 맞춘다.
	 * 일반 업무 권한(EMPLOYEE_WRITE 등)으로 대신하면, 그 권한을 받은 일반 직원이 남의 경조사까지
	 * 보고 대리 신청할 수 있게 되므로 쓰지 않는다.
	 */
	public static boolean isAdminOrHr() {
		return hasAuthority("ROLE_ADMIN") || hasAuthority("ROLE_HR");
	}

	/**
	 * 신청서에 적힌 대상자가 본인인지 확인한다.
	 *
	 * <p>신청 API 들이 요청 본문의 employeeId 를 그대로 믿고 있어서, 아무나 남의 이름으로
	 * 휴가·경조비·증명서를 신청할 수 있었다. 대리 신청은 해당 승인 권한이 있는 사람만 허용한다.
	 *
	 * @param targetEmployeeId 신청서에 적힌 대상 교직원
	 * @param authority        대리 신청을 허용할 권한 코드
	 */
	public static void checkCanSubmitFor(Long targetEmployeeId, String authority) {
		checkCanSubmitFor(targetEmployeeId, canActForOthers(authority));
	}

	/** 대리 신청 허용 여부를 직접 계산해 넘기는 형태. */
	public static void checkCanSubmitFor(Long targetEmployeeId, boolean mayActForOthers) {
		if (targetEmployeeId == null) {
			throw ApiException.badRequest("대상 교직원이 지정되지 않았습니다.");
		}
		if (targetEmployeeId.equals(getCurrentEmployeeId()) || mayActForOthers) {
			return;
		}
		throw ApiException.forbidden("본인 명의로만 신청할 수 있습니다.");
	}

	private static CustomUserDetails currentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
			throw ApiException.unauthorized("인증 정보가 없습니다.");
		}
		return userDetails;
	}
}
