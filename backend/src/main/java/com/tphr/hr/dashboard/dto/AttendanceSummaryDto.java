package com.tphr.hr.dashboard.dto;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AttendanceSummaryDto {
    private String status;
    private Long count;
}
