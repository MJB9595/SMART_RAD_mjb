package com.tphr.hr.system;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommonCodeRepository extends JpaRepository<CommonCode, Long> {

	Optional<CommonCode> findByIdAndDeletedFalse(Long id);

	List<CommonCode> findByDeletedFalseOrderByGroupCodeAscSortOrderAsc();

	boolean existsByGroupCodeAndCodeAndDeletedFalse(String groupCode, String code);
}
