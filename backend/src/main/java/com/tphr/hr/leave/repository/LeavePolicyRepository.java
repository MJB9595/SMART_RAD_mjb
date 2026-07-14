package com.tphr.hr.leave.repository;
import com.tphr.hr.leave.entity.LeavePolicy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeavePolicyRepository extends JpaRepository<LeavePolicy, Long> {
}
