package com.tphr.hr.leave.dto;
import lombok.*;
import java.math.BigDecimal;

public class LeavePolicyDto {
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Request {
        private Long positionId;
        private BigDecimal annualLeaveDays;
        private BigDecimal maxCarryOverDays;
        private Boolean halfDayAllowed;
        private String note;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private Long positionId;
        private BigDecimal annualLeaveDays;
        private BigDecimal maxCarryOverDays;
        private Boolean halfDayAllowed;
        private String note;
    }
}
