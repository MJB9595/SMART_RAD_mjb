package com.tphr.hr.security;

import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

	private final EmployeeRepository employeeRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		Employee employee = employeeRepository.findByEmailAndDeletedFalse(email)
				.orElseThrow(() -> new UsernameNotFoundException("사원을 찾을 수 없습니다: " + email));
		return new CustomUserDetails(employee);
	}
}
