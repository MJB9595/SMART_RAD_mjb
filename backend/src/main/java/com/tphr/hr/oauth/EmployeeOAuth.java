package com.tphr.hr.oauth;

import com.tphr.hr.employee.Employee;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "employee_oauth")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmployeeOAuth {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "employee_oauth_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id", nullable = false)
	private Employee employee;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private OAuthProvider provider;

	@Column(name = "provider_user_id", nullable = false, length = 100)
	private String providerUserId;

	@Column(name = "provider_email", length = 255)
	private String providerEmail;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;

	private EmployeeOAuth(Employee employee, OAuthProvider provider, String providerUserId, String providerEmail) {
		this.employee = employee;
		this.provider = provider;
		this.providerUserId = providerUserId;
		this.providerEmail = providerEmail;
	}

	public static EmployeeOAuth link(
			Employee employee,
			OAuthProvider provider,
			String providerUserId,
			String providerEmail
	) {
		return new EmployeeOAuth(employee, provider, providerUserId, providerEmail);
	}

	@PrePersist
	private void onCreate() {
		LocalDateTime now = LocalDateTime.now();
		this.createdAt = now;
		this.updatedAt = now;
	}

	@PreUpdate
	private void onUpdate() {
		this.updatedAt = LocalDateTime.now();
	}
}
