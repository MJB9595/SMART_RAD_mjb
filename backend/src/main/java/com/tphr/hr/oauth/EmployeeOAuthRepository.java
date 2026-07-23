package com.tphr.hr.oauth;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeOAuthRepository extends JpaRepository<EmployeeOAuth, Long> {

	@EntityGraph(attributePaths = "employee")
	Optional<EmployeeOAuth> findByProviderAndProviderUserId(OAuthProvider provider, String providerUserId);

	boolean existsByEmployee_IdAndProvider(Long employeeId, OAuthProvider provider);

	/** 매치 해제 시 해당 교직원의 소셜 연동을 제거하기 위해 조회. */
	List<EmployeeOAuth> findByEmployee_Id(Long employeeId);
}
