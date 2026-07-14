package com.tphr.hr.leave.dto;
import lombok.*;
import java.math.BigDecimal;

public class LeaveTypeDto {
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Request {
        private String name;
        private boolean paid;
        private BigDecimal defaultDays;
        private String note;
    }
    
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private String name;
        private boolean paid;
        private BigDecimal defaultDays;
        private String note;
    }
}
