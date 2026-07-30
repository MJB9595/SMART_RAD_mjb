package com.tphr.hr.allowance.repository;
import com.tphr.hr.allowance.entity.EmployeeAllowance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeAllowanceRepository extends JpaRepository<EmployeeAllowance, Long> {

    /** 이 수당을 지급받는 교직원이 있는지 — 삭제 가능 여부 판정용. */
    boolean existsByAllowance_IdAndDeletedFalse(Long allowanceId);

}
