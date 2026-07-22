package com.tphr.hr.signup;

import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.department.DepartmentRepository;
import com.tphr.hr.employmenttype.EmploymentTypeRepository;
import com.tphr.hr.position.PositionRepository;
import com.tphr.hr.signup.dto.SlotCreateRequest;
import com.tphr.hr.signup.dto.SlotResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SlotService {

	private final ApprovalSlotRepository slotRepository;
	private final DepartmentRepository departmentRepository;
	private final PositionRepository positionRepository;
	private final EmploymentTypeRepository employmentTypeRepository;

	@Transactional
	public SlotResponse create(SlotCreateRequest req) {
		ApprovalSlot slot = ApprovalSlot.builder()
				.staffCategory(req.staffCategory())
				.department(departmentRepository.findByIdAndDeletedFalse(req.departmentId())
						.orElseThrow(() -> ApiException.notFound("소속을 찾을 수 없습니다.")))
				.position(positionRepository.findByIdAndDeletedFalse(req.positionId())
						.orElseThrow(() -> ApiException.notFound("직급을 찾을 수 없습니다.")))
				.employmentType(employmentTypeRepository.findByIdAndDeletedFalse(req.employmentTypeId())
						.orElseThrow(() -> ApiException.notFound("임용구분을 찾을 수 없습니다.")))
				.role(req.role())
				.hireDate(req.hireDate())
				.label(req.label())
				.build();
		return SlotResponse.from(slotRepository.save(slot));
	}

	public List<SlotResponse> listOpen() {
		return slotRepository.findByStatusAndDeletedFalseOrderByIdAsc(SlotStatus.OPEN)
				.stream().map(SlotResponse::from).toList();
	}

	@Transactional
	public void delete(Long id) {
		ApprovalSlot slot = slotRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("자리를 찾을 수 없습니다. id=" + id));
		if (slot.getStatus() == SlotStatus.FILLED) {
			throw ApiException.conflict("이미 채워진 자리는 삭제할 수 없습니다.");
		}
		slot.delete();
	}
}
