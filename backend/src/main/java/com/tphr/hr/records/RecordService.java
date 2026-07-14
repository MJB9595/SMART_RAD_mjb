package com.tphr.hr.records;

import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import com.tphr.hr.records.dto.CareerRequest;
import com.tphr.hr.records.dto.CareerResponse;
import com.tphr.hr.records.dto.CertificationRequest;
import com.tphr.hr.records.dto.CertificationResponse;
import com.tphr.hr.records.dto.EducationRequest;
import com.tphr.hr.records.dto.EducationResponse;
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

	private Employee findEmployee(Long id) {
		return employeeRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("교직원을 찾을 수 없습니다. id=" + id));
	}
}
