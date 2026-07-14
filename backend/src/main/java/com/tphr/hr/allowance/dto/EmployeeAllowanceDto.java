package com.tphr.hr.allowance.dto;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class EmployeeAllowanceDto {
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Request {
        private Long employeeId;
        private Long allowanceId;
        private BigDecimal amount;
        private LocalDate startDate;
        private LocalDate endDate;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private Long employeeId;
        private Long allowanceId;
        private BigDecimal amount;
        private LocalDate startDate;
        private LocalDate endDate;
        private boolean active;
    }
}
