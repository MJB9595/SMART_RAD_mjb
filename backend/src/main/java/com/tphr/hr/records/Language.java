package com.tphr.hr.records;

import com.tphr.hr.common.entity.DeletableEntity;
import com.tphr.hr.employee.Employee;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "employee_language")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Language extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "employee_language_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Column(name = "language_name", nullable = false, length = 100)
	private String languageName;

	@Column(name = "reading_level", length = 50)
	private String readingLevel;

	@Column(name = "writing_level", length = 50)
	private String writingLevel;

	@Column(name = "speaking_level", length = 50)
	private String speakingLevel;

	@Column(name = "test_name", length = 100)
	private String testName;

	@Column(name = "test_score", length = 100)
	private String testScore;

	@Column(name = "issued_date")
	private LocalDate issuedDate;

	@Column(length = 100)
	private String issuer;

	@Builder
	public Language(Employee employee, String languageName, String readingLevel, String writingLevel,
			String speakingLevel, String testName, String testScore, LocalDate issuedDate, String issuer) {
		this.employee = employee;
		this.languageName = languageName;
		this.readingLevel = readingLevel;
		this.writingLevel = writingLevel;
		this.speakingLevel = speakingLevel;
		this.testName = testName;
		this.testScore = testScore;
		this.issuedDate = issuedDate;
		this.issuer = issuer;
	}

	public void update(String languageName, String readingLevel, String writingLevel, String speakingLevel,
			String testName, String testScore, LocalDate issuedDate, String issuer) {
		this.languageName = languageName;
		this.readingLevel = readingLevel;
		this.writingLevel = writingLevel;
		this.speakingLevel = speakingLevel;
		this.testName = testName;
		this.testScore = testScore;
		this.issuedDate = issuedDate;
		this.issuer = issuer;
	}
}
