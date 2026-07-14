package com.tphr.hr.allowance.dto;
import lombok.*;

public class AllowanceDto {
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Request {
        private String name;
        private boolean taxable;
        private boolean fixed;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private String name;
        private boolean taxable;
        private boolean fixed;
        private boolean active;
    }
}
