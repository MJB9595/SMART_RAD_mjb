package com.tphr.hr.welfare.service;

import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import com.tphr.hr.welfare.dto.EmployeeCertificateIssueDto;
import com.tphr.hr.welfare.dto.EmployeeEventSupportDto;
import com.tphr.hr.welfare.entity.EmployeeCertificateIssue;
import com.tphr.hr.welfare.entity.EmployeeEventSupport;
import com.tphr.hr.welfare.repository.EmployeeCertificateIssueRepository;
import com.tphr.hr.welfare.repository.EmployeeEventSupportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WelfareService {

    private final EmployeeEventSupportRepository eventSupportRepository;
    private final EmployeeCertificateIssueRepository certificateIssueRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public EmployeeEventSupportDto.Response createEventSupport(EmployeeEventSupportDto.Request req) {
        Employee emp = employeeRepository.findById(req.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        EmployeeEventSupport entity = EmployeeEventSupport.builder()
                .employee(emp)
                .documentNumber(req.getDocumentNumber())
                .eventType(req.getEventType())
                .familyRelation(req.getFamilyRelation())
                .targetName(req.getTargetName())
                .applicationDate(req.getApplicationDate())
                .eventDate(req.getEventDate())
                .requestedAmount(req.getRequestedAmount())
                .eventLocation(req.getEventLocation())
                .bankName(req.getBankName())
                .accountNumber(req.getAccountNumber())
                .accountHolder(req.getAccountHolder())
                .build();
        EmployeeEventSupport saved = eventSupportRepository.save(entity);
        return toEventSupportDto(saved);
    }

    public List<EmployeeEventSupportDto.Response> getAllEventSupports() {
        return eventSupportRepository.findAll().stream()
                .map(this::toEventSupportDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void approveEventSupport(Long id, Long approverId) {
        EmployeeEventSupport entity = eventSupportRepository.findById(id).orElseThrow();
        Employee approver = employeeRepository.findById(approverId).orElseThrow();
        entity.approve(approver);
    }

    @Transactional
    public EmployeeCertificateIssueDto.Response createCertificateIssue(EmployeeCertificateIssueDto.Request req) {
        Employee emp = employeeRepository.findById(req.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        EmployeeCertificateIssue entity = EmployeeCertificateIssue.builder()
                .employee(emp)
                .documentNumber(req.getDocumentNumber())
                .certificateType(req.getCertificateType())
                .applicationDate(req.getApplicationDate())
                .purpose(req.getPurpose())
                .build();
        EmployeeCertificateIssue saved = certificateIssueRepository.save(entity);
        return toCertificateIssueDto(saved);
    }

    public List<EmployeeCertificateIssueDto.Response> getAllCertificateIssues() {
        return certificateIssueRepository.findAll().stream()
                .map(this::toCertificateIssueDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void approveCertificateIssue(Long id, Long approverId) {
        EmployeeCertificateIssue entity = certificateIssueRepository.findById(id).orElseThrow();
        Employee approver = employeeRepository.findById(approverId).orElseThrow();
        entity.approve(approver);
    }

    private EmployeeEventSupportDto.Response toEventSupportDto(EmployeeEventSupport e) {
        return EmployeeEventSupportDto.Response.builder()
                .id(e.getId())
                .employeeId(e.getEmployee().getId())
                .documentNumber(e.getDocumentNumber())
                .eventType(e.getEventType())
                .targetName(e.getTargetName())
                .applicationDate(e.getApplicationDate())
                .eventDate(e.getEventDate())
                .requestedAmount(e.getRequestedAmount())
                .approvalStatus(e.getApprovalStatus())
                .build();
    }

    private EmployeeCertificateIssueDto.Response toCertificateIssueDto(EmployeeCertificateIssue e) {
        return EmployeeCertificateIssueDto.Response.builder()
                .id(e.getId())
                .employeeId(e.getEmployee().getId())
                .documentNumber(e.getDocumentNumber())
                .certificateType(e.getCertificateType())
                .applicationDate(e.getApplicationDate())
                .purpose(e.getPurpose())
                .issueStatus(e.getIssueStatus())
                .approvalStatus(e.getApprovalStatus())
                .build();
    }
}
