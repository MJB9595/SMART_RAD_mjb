package com.tphr.hr.system;

import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.system.dto.CommonCodeRequest;
import com.tphr.hr.system.dto.CommonCodeResponse;
import com.tphr.hr.system.dto.RoleResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SystemService {

	private final CommonCodeRepository commonCodeRepository;
	private final RoleRepository roleRepository;

	// ===== 공통 코드 =====
	public List<CommonCodeResponse> getCommonCodes() {
		return commonCodeRepository.findByDeletedFalseOrderByGroupCodeAscSortOrderAsc().stream()
				.map(CommonCodeResponse::from)
				.toList();
	}

	@Transactional
	public CommonCodeResponse createCommonCode(CommonCodeRequest request) {
		if (commonCodeRepository.existsByGroupCodeAndCodeAndDeletedFalse(request.groupCode(), request.code())) {
			throw ApiException.conflict("이미 존재하는 코드입니다: " + request.groupCode() + "/" + request.code());
		}
		CommonCode code = new CommonCode(request.groupCode(), request.code(), request.name(), request.sortOrder(),
				request.parentCode());
		return CommonCodeResponse.from(commonCodeRepository.save(code));
	}

	@Transactional
	public CommonCodeResponse updateCommonCode(Long id, CommonCodeRequest request) {
		CommonCode code = commonCodeRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("공통코드를 찾을 수 없습니다. id=" + id));
		code.update(request.name(), request.sortOrder(), request.parentCode());
		return CommonCodeResponse.from(code);
	}

	@Transactional
	public void deleteCommonCode(Long id) {
		commonCodeRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("공통코드를 찾을 수 없습니다. id=" + id))
				.delete();
	}

	// ===== 권한 (RBAC 조회) =====
	public List<RoleResponse> getRoles() {
		return roleRepository.findByDeletedFalseOrderByCodeAsc().stream()
				.map(RoleResponse::from)
				.toList();
	}
}
