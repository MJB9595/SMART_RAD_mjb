package com.tphr.hr.common.util;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.Year;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DocumentNumberGenerator {

	@PersistenceContext
	private EntityManager entityManager;

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public String generate(String prefix) {
		int year = Year.now().getValue();

		entityManager.createNativeQuery(
						"INSERT INTO document_sequence (prefix, seq_year, last_no) VALUES (:prefix, :year, 1) "
								+ "ON DUPLICATE KEY UPDATE last_no = last_no + 1")
				.setParameter("prefix", prefix)
				.setParameter("year", year)
				.executeUpdate();

		Number lastNo = (Number) entityManager.createNativeQuery(
						"SELECT last_no FROM document_sequence WHERE prefix = :prefix AND seq_year = :year")
				.setParameter("prefix", prefix)
				.setParameter("year", year)
				.getSingleResult();

		return "%s-%d-%03d".formatted(prefix, year, lastNo.intValue());
	}
}
