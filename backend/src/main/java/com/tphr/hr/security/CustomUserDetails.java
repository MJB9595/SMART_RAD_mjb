package com.tphr.hr.security;

import com.tphr.hr.employee.Employee;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Getter
public class CustomUserDetails implements UserDetails {

	private final Employee employee;
	private final AccessProfile accessProfile;

	public CustomUserDetails(Employee employee, AccessProfile accessProfile) {
		this.employee = employee;
		this.accessProfile = accessProfile;
	}

	public Long getEmployeeId() {
		return employee.getId();
	}

	/** 활성 역할로부터 나온 권한 코드. 프론트가 버튼 노출을 판단하는 근거이기도 하다. */
	public Set<String> getPermissions() {
		return accessProfile.permissions();
	}

	public boolean isBlocked() {
		return accessProfile.blocked();
	}

	/**
	 * 역할 코드는 hasRole() 용, 권한 코드는 hasAuthority() 용으로 함께 내보낸다.
	 * 역할 코드에는 이미 ROLE_ 접두어가 있으므로 그대로 쓴다.
	 */
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		List<GrantedAuthority> authorities = new ArrayList<>();
		accessProfile.roleCodes().forEach(code -> authorities.add(new SimpleGrantedAuthority(code)));
		accessProfile.permissions().forEach(code -> authorities.add(new SimpleGrantedAuthority(code)));
		return authorities;
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
		return !employee.isDeleted() && !accessProfile.blocked();
	}
}
