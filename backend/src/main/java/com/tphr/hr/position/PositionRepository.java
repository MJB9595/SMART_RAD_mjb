package com.tphr.hr.position;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PositionRepository extends JpaRepository<Position, Long> {

	List<Position> findByDeletedFalseOrderBySortOrderAsc();
}
