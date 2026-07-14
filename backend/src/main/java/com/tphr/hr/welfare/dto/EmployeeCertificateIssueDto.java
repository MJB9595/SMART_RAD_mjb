package com.tphr.hr.welfare.dto;
import lombok.*;
import java.time.LocalDate;

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
        private String issueStatus;
        private String approvalStatus;
    }
}
