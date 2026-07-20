package com.tphr.hr.records;

import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import com.tphr.hr.records.dto.CareerRequest;
import com.tphr.hr.records.dto.EmployeeRecordSummary;
import com.tphr.hr.records.dto.CareerResponse;
import com.tphr.hr.records.dto.CertificationRequest;
import com.tphr.hr.records.dto.CertificationResponse;
import com.tphr.hr.records.dto.EducationRequest;
import com.tphr.hr.records.dto.EducationResponse;
import com.tphr.hr.records.dto.FamilyRequest;
import com.tphr.hr.records.dto.FamilyResponse;
import com.tphr.hr.records.dto.LanguageRequest;
import com.tphr.hr.records.dto.LanguageResponse;
import com.tphr.hr.records.dto.MilitaryRequest;
import com.tphr.hr.records.dto.MilitaryResponse;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecordService {

	private final EmployeeRepository employeeRepository;
	private final EducationRepository educationRepository;
	private final CareerRepository careerRepository;
	private final CertificationRepository certificationRepository;
	private final FamilyRepository familyRepository;
	private final MilitaryRepository militaryRepository;
	private final LanguageRepository languageRepository;

	// ===== 학력 =====
	public List<EducationResponse> getEducations(Long employeeId) {
		return educationRepository.findByEmployee_IdAndDeletedFalseOrderByGraduationDateDesc(employeeId).stream()
				.map(EducationResponse::from).toList();
	}

	@Transactional
	public EducationResponse addEducation(Long employeeId, EducationRequest req) {
		Employee employee = findEmployee(employeeId);
		Education education = Education.builder()
				.employee(employee).schoolName(req.schoolName()).major(req.major()).degree(req.degree())
				.admissionDate(req.admissionDate()).graduationDate(req.graduationDate()).status(req.status())
				.build();
		return EducationResponse.from(educationRepository.save(education));
	}

	@Transactional
	public EducationResponse updateEducation(Long id, EducationRequest req) {
		Education education = educationRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("학력 정보를 찾을 수 없습니다. id=" + id));
		education.update(req.schoolName(), req.major(), req.degree(), req.admissionDate(), req.graduationDate(),
				req.status());
		return EducationResponse.from(education);
	}

	@Transactional
	public void deleteEducation(Long id) {
		educationRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("학력 정보를 찾을 수 없습니다. id=" + id))
				.delete();
	}

	// ===== 경력 =====
	public List<CareerResponse> getCareers(Long employeeId) {
		return careerRepository.findByEmployee_IdAndDeletedFalseOrderByStartDateDesc(employeeId).stream()
				.map(CareerResponse::from).toList();
	}

	@Transactional
	public CareerResponse addCareer(Long employeeId, CareerRequest req) {
		Employee employee = findEmployee(employeeId);
		Career career = Career.builder()
				.employee(employee).companyName(req.companyName()).department(req.department())
				.position(req.position()).jobDescription(req.jobDescription())
				.startDate(req.startDate()).endDate(req.endDate())
				.build();
		return CareerResponse.from(careerRepository.save(career));
	}

	@Transactional
	public CareerResponse updateCareer(Long id, CareerRequest req) {
		Career career = careerRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("경력 정보를 찾을 수 없습니다. id=" + id));
		career.update(req.companyName(), req.department(), req.position(), req.jobDescription(), req.startDate(),
				req.endDate());
		return CareerResponse.from(career);
	}

	@Transactional
	public void deleteCareer(Long id) {
		careerRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("경력 정보를 찾을 수 없습니다. id=" + id))
				.delete();
	}

	// ===== 자격증 =====
	public List<CertificationResponse> getCertifications(Long employeeId) {
		return certificationRepository.findByEmployee_IdAndDeletedFalseOrderByAcquiredDateDesc(employeeId).stream()
				.map(CertificationResponse::from).toList();
	}

	@Transactional
	public CertificationResponse addCertification(Long employeeId, CertificationRequest req) {
		Employee employee = findEmployee(employeeId);
		Certification certification = Certification.builder()
				.employee(employee).name(req.name()).issuer(req.issuer()).certNumber(req.certNumber())
				.acquiredDate(req.acquiredDate()).expiryDate(req.expiryDate())
				.build();
		return CertificationResponse.from(certificationRepository.save(certification));
	}

	@Transactional
	public CertificationResponse updateCertification(Long id, CertificationRequest req) {
		Certification certification = certificationRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("자격증 정보를 찾을 수 없습니다. id=" + id));
		certification.update(req.name(), req.issuer(), req.certNumber(), req.acquiredDate(), req.expiryDate());
		return CertificationResponse.from(certification);
	}

	@Transactional
	public void deleteCertification(Long id) {
		certificationRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("자격증 정보를 찾을 수 없습니다. id=" + id))
				.delete();
	}

	// ===== 가족사항 =====
	public List<FamilyResponse> getFamilies(Long employeeId) {
		return familyRepository.findByEmployee_IdAndDeletedFalseOrderByBirthDateAsc(employeeId).stream()
				.map(FamilyResponse::from).toList();
	}

	@Transactional
	public FamilyResponse addFamily(Long employeeId, FamilyRequest req) {
		Employee employee = findEmployee(employeeId);
		Family family = Family.builder()
				.employee(employee).familyName(req.familyName()).familyRelation(req.familyRelation())
				.birthDate(req.birthDate()).job(req.job()).livingTogether(req.livingTogether())
				.dependent(req.dependent()).disabled(req.disabled())
				.build();
		return FamilyResponse.from(familyRepository.save(family));
	}

	@Transactional
	public FamilyResponse updateFamily(Long id, FamilyRequest req) {
		Family family = familyRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("가족 정보를 찾을 수 없습니다. id=" + id));
		family.update(req.familyName(), req.familyRelation(), req.birthDate(), req.job(), req.livingTogether(),
				req.dependent(), req.disabled());
		return FamilyResponse.from(family);
	}

	@Transactional
	public void deleteFamily(Long id) {
		familyRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("가족 정보를 찾을 수 없습니다. id=" + id))
				.delete();
	}

	// ===== 병역정보 =====
	public List<MilitaryResponse> getMilitaries(Long employeeId) {
		return militaryRepository.findByEmployee_IdAndDeletedFalseOrderByEnlistmentDateDesc(employeeId).stream()
				.map(MilitaryResponse::from).toList();
	}

	@Transactional
	public MilitaryResponse addMilitary(Long employeeId, MilitaryRequest req) {
		Employee employee = findEmployee(employeeId);
		Military military = Military.builder()
				.employee(employee).militaryType(req.militaryType()).militaryRank(req.militaryRank())
				.dischargeType(req.dischargeType()).enlistmentDate(req.enlistmentDate())
				.dischargeDate(req.dischargeDate()).exemptionReason(req.exemptionReason())
				.build();
		return MilitaryResponse.from(militaryRepository.save(military));
	}

	@Transactional
	public MilitaryResponse updateMilitary(Long id, MilitaryRequest req) {
		Military military = militaryRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("병역 정보를 찾을 수 없습니다. id=" + id));
		military.update(req.militaryType(), req.militaryRank(), req.dischargeType(), req.enlistmentDate(),
				req.dischargeDate(), req.exemptionReason());
		return MilitaryResponse.from(military);
	}

	@Transactional
	public void deleteMilitary(Long id) {
		militaryRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("병역 정보를 찾을 수 없습니다. id=" + id))
				.delete();
	}

	// ===== 어학정보 =====
	public List<LanguageResponse> getLanguages(Long employeeId) {
		return languageRepository.findByEmployee_IdAndDeletedFalseOrderByLanguageNameAsc(employeeId).stream()
				.map(LanguageResponse::from).toList();
	}

	@Transactional
	public LanguageResponse addLanguage(Long employeeId, LanguageRequest req) {
		Employee employee = findEmployee(employeeId);
		Language language = Language.builder()
				.employee(employee).languageName(req.languageName()).readingLevel(req.readingLevel())
				.writingLevel(req.writingLevel()).speakingLevel(req.speakingLevel()).testName(req.testName())
				.testScore(req.testScore()).issuedDate(req.issuedDate()).issuer(req.issuer())
				.build();
		return LanguageResponse.from(languageRepository.save(language));
	}

	@Transactional
	public LanguageResponse updateLanguage(Long id, LanguageRequest req) {
		Language language = languageRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("어학 정보를 찾을 수 없습니다. id=" + id));
		language.update(req.languageName(), req.readingLevel(), req.writingLevel(), req.speakingLevel(),
				req.testName(), req.testScore(), req.issuedDate(), req.issuer());
		return LanguageResponse.from(language);
	}

	@Transactional
	public void deleteLanguage(Long id) {
		languageRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("어학 정보를 찾을 수 없습니다. id=" + id))
				.delete();
	}

	// ===== 인사기록 요약 / 통계 =====

	/** 만료 임박(향후 {@code days}일 이내) 자격증 총 건수 — 목록 stat 카드용. */
	public long countExpiringCertifications(int days) {
		LocalDate today = LocalDate.now();
		return certificationRepository.countByDeletedFalseAndExpiryDateBetween(today, today.plusDays(days));
	}

	/** 한 교직원의 인사기록 요약 — 미리보기 패널용. */
	public EmployeeRecordSummary getSummary(Long employeeId) {
		Employee employee = findEmployee(employeeId);
		LocalDate today = LocalDate.now();

		List<Education> educations =
				educationRepository.findByEmployee_IdAndDeletedFalseOrderByGraduationDateDesc(employeeId);
		List<Career> careers = careerRepository.findByEmployee_IdAndDeletedFalseOrderByStartDateDesc(employeeId);
		List<Certification> certifications =
				certificationRepository.findByEmployee_IdAndDeletedFalseOrderByAcquiredDateDesc(employeeId);

		String latestEducation = educations.isEmpty() ? null : formatEducation(educations.get(0));
		String topCertification = certifications.isEmpty() ? null : certifications.get(0).getName();
		Integer yearsOfService = employee.getHireDate() == null
				? null
				: Period.between(employee.getHireDate(), today).getYears();
		long expiring = certificationRepository
				.countByEmployee_IdAndDeletedFalseAndExpiryDateBetween(employeeId, today, today.plusDays(90));

		return new EmployeeRecordSummary(employeeId, latestEducation, topCertification, educations.size(),
				careers.size(), certifications.size(), yearsOfService, expiring);
	}

	private String formatEducation(Education e) {
		if (e.getDegree() != null && !e.getDegree().isBlank()) {
			return e.getSchoolName() + " " + e.getDegree();
		}
		return e.getSchoolName();
	}

	private Employee findEmployee(Long id) {
		return employeeRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("교직원을 찾을 수 없습니다. id=" + id));
	}
}
