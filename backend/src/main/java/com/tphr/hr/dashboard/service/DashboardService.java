package com.tphr.hr.dashboard.service;

import com.tphr.hr.dashboard.dto.AttendanceSummaryDto;
import com.tphr.hr.dashboard.dto.HeadcountDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    @PersistenceContext
    private EntityManager em;

    public List<HeadcountDto> getHeadcount() {
        List<Object[]> results = em.createQuery(
                "SELECT d.name, COUNT(e.id) FROM Employee e JOIN e.department d WHERE e.deleted = false GROUP BY d.name", Object[].class)
                .getResultList();
        
        return results.stream()
                .map(row -> new HeadcountDto(row[0].toString(), (Long) row[1]))
                .collect(Collectors.toList());
    }

    public List<AttendanceSummaryDto> getTodayAttendance() {
        List<Object[]> results = em.createQuery(
                "SELECT a.status, COUNT(a.id) FROM Attendance a WHERE a.workDate = CURRENT_DATE AND a.deleted = false GROUP BY a.status", Object[].class)
                .getResultList();
        
        return results.stream()
                .map(row -> new AttendanceSummaryDto(row[0].toString(), (Long) row[1]))
                .collect(Collectors.toList());
    }
}
