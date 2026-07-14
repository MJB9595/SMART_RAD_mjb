package com.tphr.hr.allowance.repository;
import com.tphr.hr.allowance.entity.EmployeeAllowance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeAllowanceRepository extends JpaRepository<EmployeeAllowance, Long> {
}
