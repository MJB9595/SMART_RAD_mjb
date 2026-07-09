package com.tphr.hr.certificateissue;

import com.tphr.hr.certificateissue.dto.CertificateApprovalRequest;
import com.tphr.hr.certificateissue.dto.CertificateIssueRequest;
import com.tphr.hr.certificateissue.dto.CertificateIssueResponse;
import com.tphr.hr.common.ApprovalStatus;
import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.common.util.DocumentNumberGenerator;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import com.tphr.hr.security.SecurityUtils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CertificateIssueService {

	private static final String DOCUMENT_PREFIX = "CERT";

	private final EmployeeCertificateIssueRepository certificateIssueRepository;
	private final EmployeeRepository employeeRepository;
	private final DocumentNumberGenerator documentNumberGenerator;

	public List<CertificateIssueResponse> getCertificateIssuesByEmployee(Long employeeId) {
		return certificateIssueRepository.findByEmployee_IdAndDeletedFalseOrderByCreatedAtDesc(employeeId).stream()
				.map(CertificateIssueResponse::from)
				.toList();
	}

	public List<CertificateIssueResponse> getCertificateIssues() {
		return certificateIssueRepository.findByDeletedFalseOrderByCreatedAtDesc().stream()
				.map(CertificateIssueResponse::from)
				.toList();
	}

	@Transactional
	public CertificateIssueResponse createCertificateIssue(CertificateIssueRequest request) {
		Employee employee = employeeRepository.findById(request.employeeId())
				.orElseThrow(() -> ApiException.notFound("사원을 찾을 수 없습니다. id=" + request.employeeId()));

		String documentNumber = documentNumberGenerator.generate(DOCUMENT_PREFIX);

		EmployeeCertificateIssue certificateIssue = new EmployeeCertificateIssue(documentNumber, employee,
				request.certificateType(), request.purpose());

		return CertificateIssueResponse.from(certificateIssueRepository.save(certificateIssue));
	}

	@Transactional
	public CertificateIssueResponse decide(Long id, CertificateApprovalRequest request) {
		EmployeeCertificateIssue certificateIssue = findCertificateIssue(id);
		Employee approver = employeeRepository.findById(SecurityUtils.getCurrentEmployeeId())
				.orElseThrow(() -> ApiException.unauthorized("승인자 정보를 확인할 수 없습니다."));

		if (request.approve()) {
			certificateIssue.approve(approver);
		} else {
			certificateIssue.reject(approver);
		}
		return CertificateIssueResponse.from(certificateIssue);
	}

	@Transactional
	public CertificateIssueResponse markIssued(Long id) {
		EmployeeCertificateIssue certificateIssue = findCertificateIssue(id);
		if (certificateIssue.getApprovalStatus() != ApprovalStatus.APPROVED) {
			throw ApiException.badRequest("승인되지 않은 신청은 발급 처리할 수 없습니다.");
		}
		certificateIssue.markIssued();
		return CertificateIssueResponse.from(certificateIssue);
	}

	private EmployeeCertificateIssue findCertificateIssue(Long id) {
		return certificateIssueRepository.findById(id)
				.orElseThrow(() -> ApiException.notFound("증명서 발급 신청을 찾을 수 없습니다. id=" + id));
	}
}
