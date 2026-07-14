package com.tphr.hr.dashboard.dto;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class HeadcountDto {
    private String departmentName;
    private Long headcount;
}
