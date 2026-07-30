package com.tphr.hr.allowance.controller;

import com.tphr.hr.allowance.dto.AllowanceDto;
import com.tphr.hr.allowance.dto.EmployeeAllowanceDto;
import com.tphr.hr.allowance.service.AllowanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'HR')")
public class AllowanceController {

    private final AllowanceService allowanceService;

    @PostMapping("/allowances")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('HR') and @permissionService.isHighRank(authentication))")
    public ResponseEntity<AllowanceDto.Response> createAllowance(@Valid @RequestBody AllowanceDto.Request req) {
        return ResponseEntity.ok(allowanceService.createAllowance(req));
    }

    @GetMapping("/allowances")
    public ResponseEntity<List<AllowanceDto.Response>> getAllowances() {
        return ResponseEntity.ok(allowanceService.getAllAllowances());
    }

    @PutMapping("/allowances/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('HR') and @permissionService.isHighRank(authentication))")
    public ResponseEntity<AllowanceDto.Response> updateAllowance(@PathVariable Long id,
            @Valid @RequestBody AllowanceDto.Request req) {
        return ResponseEntity.ok(allowanceService.updateAllowance(id, req));
    }

    /** 활성/비활성 전환 — 비활성 수당은 신규 지급 설정에서 제외된다. */
    @PatchMapping("/allowances/{id}/active")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('HR') and @permissionService.isHighRank(authentication))")
    public ResponseEntity<AllowanceDto.Response> setAllowanceActive(@PathVariable Long id,
            @RequestParam boolean active) {
        return ResponseEntity.ok(allowanceService.setAllowanceActive(id, active));
    }

    @DeleteMapping("/allowances/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('HR') and @permissionService.isHighRank(authentication))")
    public ResponseEntity<Void> deleteAllowance(@PathVariable Long id) {
        allowanceService.deleteAllowance(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/employee-allowances")
    public ResponseEntity<EmployeeAllowanceDto.Response> createEmployeeAllowance(@Valid @RequestBody EmployeeAllowanceDto.Request req) {
        return ResponseEntity.ok(allowanceService.createEmployeeAllowance(req));
    }

    @GetMapping("/employee-allowances")
    public ResponseEntity<List<EmployeeAllowanceDto.Response>> getEmployeeAllowances() {
        return ResponseEntity.ok(allowanceService.getAllEmployeeAllowances());
    }
}
