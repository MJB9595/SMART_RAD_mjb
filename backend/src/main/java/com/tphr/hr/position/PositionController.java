package com.tphr.hr.position;

import com.tphr.hr.position.dto.PositionRequest;
import com.tphr.hr.position.dto.PositionResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/positions")
@RequiredArgsConstructor
public class PositionController {

	private final PositionService positionService;

	@GetMapping
	public List<PositionResponse> getPositions() {
		return positionService.getPositions();
	}

	@GetMapping("/{id}")
	public PositionResponse getPosition(@PathVariable Long id) {
		return positionService.getPosition(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN')")
	public PositionResponse createPosition(@Valid @RequestBody PositionRequest request) {
		return positionService.createPosition(request);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public PositionResponse updatePosition(@PathVariable Long id, @Valid @RequestBody PositionRequest request) {
		return positionService.updatePosition(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN')")
	public void deletePosition(@PathVariable Long id) {
		positionService.deletePosition(id);
	}
}
