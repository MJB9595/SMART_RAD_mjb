package com.tphr.hr.allowance.controller;

import com.tphr.hr.allowance.dto.AllowanceDto;
import com.tphr.hr.allowance.dto.EmployeeAllowanceDto;
import com.tphr.hr.allowance.service.AllowanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AllowanceController {

    private final AllowanceService allowanceService;

    @PostMapping("/allowances")
    public ResponseEntity<AllowanceDto.Response> createAllowance(@RequestBody AllowanceDto.Request req) {
        return ResponseEntity.ok(allowanceService.createAllowance(req));
    }

    @GetMapping("/allowances")
    public ResponseEntity<List<AllowanceDto.Response>> getAllowances() {
        return ResponseEntity.ok(allowanceService.getAllAllowances());
    }

    @PostMapping("/employee-allowances")
    public ResponseEntity<EmployeeAllowanceDto.Response> createEmployeeAllowance(@RequestBody EmployeeAllowanceDto.Request req) {
        return ResponseEntity.ok(allowanceService.createEmployeeAllowance(req));
    }

    @GetMapping("/employee-allowances")
    public ResponseEntity<List<EmployeeAllowanceDto.Response>> getEmployeeAllowances() {
        return ResponseEntity.ok(allowanceService.getAllEmployeeAllowances());
    }
}
