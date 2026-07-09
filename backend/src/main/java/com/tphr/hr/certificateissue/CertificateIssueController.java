package com.tphr.hr.certificateissue;

import com.tphr.hr.certificateissue.dto.CertificateApprovalRequest;
import com.tphr.hr.certificateissue.dto.CertificateIssueRequest;
import com.tphr.hr.certificateissue.dto.CertificateIssueResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/certificate-issues")
@RequiredArgsConstructor
public class CertificateIssueController {

	private final CertificateIssueService certificateIssueService;

	@GetMapping
	public List<CertificateIssueResponse> getCertificateIssues() {
		return certificateIssueService.getCertificateIssues();
	}

	@GetMapping("/employees/{employeeId}")
	public List<CertificateIssueResponse> getCertificateIssuesByEmployee(@PathVariable Long employeeId) {
		return certificateIssueService.getCertificateIssuesByEmployee(employeeId);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public CertificateIssueResponse createCertificateIssue(@Valid @RequestBody CertificateIssueRequest request) {
		return certificateIssueService.createCertificateIssue(request);
	}

	@PatchMapping("/{id}/decision")
	@PreAuthorize("hasRole('ADMIN')")
	public CertificateIssueResponse decide(@PathVariable Long id, @RequestBody CertificateApprovalRequest request) {
		return certificateIssueService.decide(id, request);
	}

	@PatchMapping("/{id}/issue")
	@PreAuthorize("hasRole('ADMIN')")
	public CertificateIssueResponse markIssued(@PathVariable Long id) {
		return certificateIssueService.markIssued(id);
	}
}
