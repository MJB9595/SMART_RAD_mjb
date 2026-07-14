package com.tphr.hr.common;

import com.tphr.hr.common.exception.ApiException;

public enum ApprovalStatus {
	PENDING,
	APPROVED,
	REJECTED;

	/** 결재는 대기 상태에서만 가능. 이미 처리된 건의 재결재는 409 충돌. */
	public void ensurePending() {
		if (this != PENDING) {
			throw ApiException.conflict("이미 처리된 신청입니다. 현재 상태: " + this);
		}
	}
}
