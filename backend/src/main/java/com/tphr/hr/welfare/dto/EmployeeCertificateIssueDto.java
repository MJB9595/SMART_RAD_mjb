package com.tphr.hr.welfare.dto;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class EmployeeCertificateIssueDto {
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Request {
        private Long employeeId;
        private String documentNumber;
        private String certificateType;
        private LocalDate applicationDate;
        private String purpose;
    }
    
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private Long employeeId;
        private String documentNumber;
        private String certificateType;
        private LocalDate applicationDate;
        private String purpose;
        private String issueStatus;
        private String approvalStatus;
        // 증명서 서식 출력용 대상자 정보
        private String employeeName;
        private String employeeNumber;
        private String departmentName;
        private String positionName;
        private LocalDate hireDate;
        private LocalDateTime issuedAt;
    }
}
