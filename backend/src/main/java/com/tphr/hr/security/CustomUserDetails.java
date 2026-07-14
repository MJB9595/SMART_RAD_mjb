package com.tphr.hr.security;

import com.tphr.hr.employee.Employee;
import java.util.Collection;
import java.util.List;
import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Getter
public class CustomUserDetails implements UserDetails {

	private final Employee employee;

	public CustomUserDetails(Employee employee) {
		this.employee = employee;
	}

	public Long getEmployeeId() {
		return employee.getId();
	}

	@Override
	public Collection<? extends org.springframework.security.core.GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("ROLE_" + employee.getRole().name()));
	}

	@Override
	public String getPassword() {
		return employee.getPassword();
	}

	@Override
	public String getUsername() {
		return employee.getEmail();
	}

	@Override
	public boolean isEnabled() {
		return !employee.isDeleted();
	}
}
