package com.tphr.hr.position;

import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.position.dto.PositionRequest;
import com.tphr.hr.position.dto.PositionResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PositionService {

	private final PositionRepository positionRepository;

	public List<PositionResponse> getPositions() {
		return positionRepository.findByDeletedFalseOrderBySortOrderAsc().stream()
				.map(PositionResponse::from)
				.toList();
	}

	public PositionResponse getPosition(Long id) {
		return PositionResponse.from(findActive(id));
	}

	@Transactional
	public PositionResponse createPosition(PositionRequest request) {
		Position position = new Position(request.name(), request.category(), request.sortOrder());
		return PositionResponse.from(positionRepository.save(position));
	}

	@Transactional
	public PositionResponse updatePosition(Long id, PositionRequest request) {
		Position position = findActive(id);
		position.update(request.name(), request.category(), request.sortOrder());
		return PositionResponse.from(position);
	}

	@Transactional
	public void deletePosition(Long id) {
		findActive(id).delete();
	}

	private Position findActive(Long id) {
		return positionRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("직급을 찾을 수 없습니다. id=" + id));
	}
}
