package com.tphr.hr.welfare.dto;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class EmployeeEventSupportDto {
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Request {
        private Long employeeId;
        private String documentNumber;
        private String eventType;
        private String familyRelation;
        private String targetName;
        private LocalDate applicationDate;
        private LocalDate eventDate;
        private BigDecimal requestedAmount;
        private String eventLocation;
        private String bankName;
        private String accountNumber;
        private String accountHolder;
    }
    
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private Long employeeId;
        private String documentNumber;
        private String eventType;
        private String targetName;
        private LocalDate applicationDate;
        private LocalDate eventDate;
        private BigDecimal requestedAmount;
        private String approvalStatus;
    }
}
