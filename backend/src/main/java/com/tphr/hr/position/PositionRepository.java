package com.tphr.hr.position;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PositionRepository extends JpaRepository<Position, Long> {

	Optional<Position> findByIdAndDeletedFalse(Long id);

	List<Position> findByDeletedFalseOrderBySortOrderAsc();
}
