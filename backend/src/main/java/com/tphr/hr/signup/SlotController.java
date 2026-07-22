package com.tphr.hr.signup;

import com.tphr.hr.signup.dto.SlotCreateRequest;
import com.tphr.hr.signup.dto.SlotResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/approval-slots")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SlotController {

	private final SlotService slotService;

	/** 승인 자리 생성 (교직원 등록 폼 → 사번/이메일/비밀번호 없이 직위·권한만). */
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public SlotResponse create(@Valid @RequestBody SlotCreateRequest request) {
		return slotService.create(request);
	}

	/** 채울 수 있는(OPEN) 자리 목록 — 승인 매칭용. */
	@GetMapping("/open")
	public List<SlotResponse> open() {
		return slotService.listOpen();
	}

	/** 비어있는 자리 삭제. */
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		slotService.delete(id);
	}
}
