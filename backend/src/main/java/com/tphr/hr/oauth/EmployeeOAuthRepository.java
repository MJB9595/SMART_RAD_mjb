package com.tphr.hr.oauth;

import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeOAuthRepository extends JpaRepository<EmployeeOAuth, Long> {

	@EntityGraph(attributePaths = "employee")
	Optional<EmployeeOAuth> findByProviderAndProviderUserId(OAuthProvider provider, String providerUserId);

	boolean existsByEmployee_IdAndProvider(Long employeeId, OAuthProvider provider);
}
