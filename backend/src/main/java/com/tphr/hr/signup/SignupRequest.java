package com.tphr.hr.signup;

import com.tphr.hr.common.entity.DeletableEntity;
import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.oauth.OAuthProvider;
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

	/** OAuth(카카오 등)에서 유입된 신청이면 제공자, 일반 가입은 NULL. */
	@Enumerated(EnumType.STRING)
	@Column(name = "oauth_provider", length = 20)
	private OAuthProvider oauthProvider;

	@Column(name = "oauth_provider_user_id", length = 100)
	private String oauthProviderUserId;

	@Builder
	public SignupRequest(String name, String email, String password, String school) {
		this.name = name;
		this.email = email;
		this.password = password;
		this.school = school;
		this.status = SignupStatus.PENDING;
		this.requestedAt = LocalDateTime.now();
	}

	/**
	 * OAuth(카카오) 최초 로그인으로 유입된 가입 신청.
	 * 비밀번호 로그인은 사용하지 않으므로 랜덤 해시를 넣고, 승인 시 소셜 링크로 로그인한다.
	 */
	public static SignupRequest forOAuth(String name, String email, String passwordHash, String school,
			OAuthProvider provider, String providerUserId) {
		SignupRequest signup = new SignupRequest(name, email, passwordHash, school);
		signup.oauthProvider = provider;
		signup.oauthProviderUserId = providerUserId;
		return signup;
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

	/** 매치 해제: 승인됐던 신청을 다시 승인 대기 상태로 되돌린다. */
	public void resetToPending() {
		if (this.status != SignupStatus.APPROVED) {
			throw ApiException.conflict("승인된 신청만 매치 해제로 대기큐에 되돌릴 수 있습니다.");
		}
		this.status = SignupStatus.PENDING;
		this.processedAt = null;
		this.processedBy = null;
	}
}
