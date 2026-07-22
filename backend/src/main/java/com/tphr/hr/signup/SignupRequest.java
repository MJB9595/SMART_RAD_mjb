package com.tphr.hr.signup;

import com.tphr.hr.common.entity.DeletableEntity;
import com.tphr.hr.common.exception.ApiException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** 회원가입 신청 — 관리자 승인 시 정식 교직원 계정으로 전환된다. */
@Getter
@Entity
@Table(name = "signup_request")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SignupRequest extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "signup_request_id")
	private Long id;

	@Column(nullable = false, length = 50)
	private String name;

	@Column(nullable = false, length = 100)
	private String email;

	/** BCrypt 해시로 저장 (승인 시 그대로 Employee로 이관). */
	@Column(nullable = false)
	private String password;

	@Column(nullable = false, length = 100)
	private String school;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private SignupStatus status;

	@Column(name = "requested_at", nullable = false)
	private LocalDateTime requestedAt;

	@Column(name = "processed_at")
	private LocalDateTime processedAt;

	@Column(name = "processed_by")
	private Long processedBy;

	@Builder
	public SignupRequest(String name, String email, String password, String school) {
		this.name = name;
		this.email = email;
		this.password = password;
		this.school = school;
		this.status = SignupStatus.PENDING;
		this.requestedAt = LocalDateTime.now();
	}

	private void ensurePending() {
		if (this.status != SignupStatus.PENDING) {
			throw ApiException.conflict("이미 처리된 회원가입 신청입니다.");
		}
	}

	public void approve(Long processorId) {
		ensurePending();
		this.status = SignupStatus.APPROVED;
		this.processedAt = LocalDateTime.now();
		this.processedBy = processorId;
	}

	public void reject(Long processorId) {
		ensurePending();
		this.status = SignupStatus.REJECTED;
		this.processedAt = LocalDateTime.now();
		this.processedBy = processorId;
	}
}
