package com.tphr.hr.leave.controller;

import com.tphr.hr.leave.dto.LeavePolicyDto;
import com.tphr.hr.leave.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leave-policies")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class LeavePolicyController {

    private final LeaveService leaveService;

    @PostMapping
    public ResponseEntity<LeavePolicyDto.Response> create(@RequestBody LeavePolicyDto.Request req) {
        return ResponseEntity.ok(leaveService.createLeavePolicy(req));
    }

    @GetMapping
    public ResponseEntity<List<LeavePolicyDto.Response>> getAll() {
        return ResponseEntity.ok(leaveService.getAllLeavePolicies());
    }
}
