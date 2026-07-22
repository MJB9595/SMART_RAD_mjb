package com.tphr.hr.signup;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SignupRequestRepository extends JpaRepository<SignupRequest, Long> {

	Optional<SignupRequest> findByIdAndDeletedFalse(Long id);

	List<SignupRequest> findByStatusAndDeletedFalseOrderByRequestedAtAsc(SignupStatus status);

	boolean existsByEmailAndStatusAndDeletedFalse(String email, SignupStatus status);
}
