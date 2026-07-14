package com.tphr.hr.employee;

import com.tphr.hr.common.StaffCategory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class EmployeeSpecifications {

	private EmployeeSpecifications() {
	}

	public static Specification<Employee> search(String keyword, Long departmentId, Long positionId,
			StaffCategory staffCategory, EmploymentStatus employmentStatus) {
		return (root, query, cb) -> {
			var predicates = cb.conjunction();

			predicates = cb.and(predicates, cb.isFalse(root.get("deleted")));

			if (StringUtils.hasText(keyword)) {
				String like = "%" + keyword.trim() + "%";
				predicates = cb.and(predicates, cb.or(
						cb.like(root.get("employeeNumber"), like),
						cb.like(root.get("name"), like)
				));
			}
			if (departmentId != null) {
				predicates = cb.and(predicates, cb.equal(root.get("department").get("id"), departmentId));
			}
			if (positionId != null) {
				predicates = cb.and(predicates, cb.equal(root.get("position").get("id"), positionId));
			}
			if (staffCategory != null) {
				predicates = cb.and(predicates, cb.equal(root.get("staffCategory"), staffCategory));
			}
			if (employmentStatus != null) {
				predicates = cb.and(predicates, cb.equal(root.get("employmentStatus"), employmentStatus));
			}
			return predicates;
		};
	}
}
