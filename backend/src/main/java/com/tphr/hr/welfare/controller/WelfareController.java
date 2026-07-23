package com.tphr.hr.welfare.controller;

import com.tphr.hr.security.SecurityUtils;
import com.tphr.hr.welfare.dto.EmployeeCertificateIssueDto;
import com.tphr.hr.welfare.dto.EmployeeEventSupportDto;
import com.tphr.hr.welfare.service.WelfareService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/welfare")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class WelfareController {

    private final WelfareService welfareService;

    @PostMapping("/event-support")
    public ResponseEntity<EmployeeEventSupportDto.Response> createEventSupport(@Valid @RequestBody EmployeeEventSupportDto.Request req) {
        return ResponseEntity.ok(welfareService.createEventSupport(req));
    }

    @GetMapping("/event-support")
    public ResponseEntity<List<EmployeeEventSupportDto.Response>> getEventSupports() {
        return ResponseEntity.ok(welfareService.getAllEventSupports());
    }

    @PostMapping("/event-support/{id}/approve")
    public ResponseEntity<Void> approveEventSupport(@PathVariable Long id) {
        welfareService.approveEventSupport(id, SecurityUtils.getCurrentEmployeeId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/certificate")
    public ResponseEntity<EmployeeCertificateIssueDto.Response> createCertificate(@Valid @RequestBody EmployeeCertificateIssueDto.Request req) {
        return ResponseEntity.ok(welfareService.createCertificateIssue(req));
    }

    @GetMapping("/certificate")
    public ResponseEntity<List<EmployeeCertificateIssueDto.Response>> getCertificates() {
        return ResponseEntity.ok(welfareService.getAllCertificateIssues());
    }

    @PostMapping("/certificate/{id}/approve")
    public ResponseEntity<Void> approveCertificate(@PathVariable Long id) {
        welfareService.approveCertificateIssue(id, SecurityUtils.getCurrentEmployeeId());
        return ResponseEntity.ok().build();
    }
}
