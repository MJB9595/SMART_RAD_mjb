package com.tphr.hr.dashboard.controller;

import com.tphr.hr.dashboard.dto.AttendanceSummaryDto;
import com.tphr.hr.dashboard.dto.HeadcountDto;
import com.tphr.hr.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/headcount")
    public ResponseEntity<List<HeadcountDto>> getHeadcount() {
        return ResponseEntity.ok(dashboardService.getHeadcount());
    }

    @GetMapping("/attendance/today")
    public ResponseEntity<List<AttendanceSummaryDto>> getTodayAttendance() {
        return ResponseEntity.ok(dashboardService.getTodayAttendance());
    }
}
