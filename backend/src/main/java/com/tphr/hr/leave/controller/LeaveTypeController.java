package com.tphr.hr.leave.controller;

import com.tphr.hr.leave.dto.LeaveTypeDto;
import com.tphr.hr.leave.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leave-types")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class LeaveTypeController {

    private final LeaveService leaveService;

    @PostMapping
    public ResponseEntity<LeaveTypeDto.Response> create(@RequestBody LeaveTypeDto.Request req) {
        return ResponseEntity.ok(leaveService.createLeaveType(req));
    }

    @GetMapping
    public ResponseEntity<List<LeaveTypeDto.Response>> getAll() {
        return ResponseEntity.ok(leaveService.getAllLeaveTypes());
    }
}
