package com.tphr.hr.attendance;

import com.tphr.hr.common.entity.DeletableEntity;
import com.tphr.hr.employee.Employee;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "attendance", uniqueConstraints = {
		@UniqueConstraint(name = "uq_attendance_employee_date", columnNames = {"employee_id", "work_date"})
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Attendance extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Column(name = "work_date", nullable = false)
	private LocalDate workDate;

	@Column(name = "check_in_time")
	private LocalTime checkInTime;

	@Column(name = "check_out_time")
	private LocalTime checkOutTime;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private AttendanceStatus status;

	public Attendance(Employee employee, LocalDate workDate, LocalTime checkInTime, LocalTime checkOutTime,
			AttendanceStatus status) {
		this.employee = employee;
		this.workDate = workDate;
		this.checkInTime = checkInTime;
		this.checkOutTime = checkOutTime;
		this.status = status;
	}

	public void update(LocalTime checkInTime, LocalTime checkOutTime, AttendanceStatus status) {
		this.checkInTime = checkInTime;
		this.checkOutTime = checkOutTime;
		this.status = status;
	}
}
