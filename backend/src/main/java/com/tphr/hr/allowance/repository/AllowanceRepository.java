package com.tphr.hr.allowance.repository;
import com.tphr.hr.allowance.entity.Allowance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AllowanceRepository extends JpaRepository<Allowance, Long> {

    java.util.List<Allowance> findByDeletedFalseOrderByIdAsc();

    java.util.Optional<Allowance> findByIdAndDeletedFalse(Long id);

}
