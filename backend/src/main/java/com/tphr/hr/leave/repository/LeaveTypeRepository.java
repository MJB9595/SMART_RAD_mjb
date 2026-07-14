package com.tphr.hr.leave.repository;
import com.tphr.hr.leave.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveTypeRepository extends JpaRepository<LeaveType, Long> {
}
