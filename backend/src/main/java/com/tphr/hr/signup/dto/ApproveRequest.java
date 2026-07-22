package com.tphr.hr.signup.dto;

import jakarta.validation.constraints.NotNull;

/** 승인 시 매칭할 자리(슬롯) 선택. */
public record ApproveRequest(

		@NotNull(message = "매칭할 자리를 선택하세요.")
		Long slotId
) {
}
