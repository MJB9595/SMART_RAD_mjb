package com.tphr.hr;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

class AppointmentApprovalTest extends IntegrationTestSupport {

	@Autowired
	MockMvc mockMvc;

	@Autowired
	ObjectMapper objectMapper;

	private String loginAsAdmin() throws Exception {
		MvcResult result = mockMvc.perform(post("/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"admin@tphr.com\",\"password\":\"admin1234\"}"))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
		return json.get("accessToken").asText();
	}

	@Test
	void 로그인_실패는_401을_반환한다() throws Exception {
		mockMvc.perform(post("/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"admin@tphr.com\",\"password\":\"wrong\"}"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void 사원목록은_페이징되어_반환된다() throws Exception {
		String token = loginAsAdmin();
		mockMvc.perform(get("/employees?size=3").header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.size", is(3)))
				.andExpect(jsonPath("$.content").isArray());
	}

	@Test
	void 발령은_승인되면_사원소속에_반영되고_재승인은_409() throws Exception {
		String token = loginAsAdmin();

		// 발령 등록 (박강사 id=4 승진)
		MvcResult created = mockMvc.perform(post("/appointments")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"employeeId":4,"appointmentType":"PROMOTION","fromDepartmentId":7,
								 "toDepartmentId":6,"fromPositionId":4,"toPositionId":3,
								 "appointmentDate":"2026-08-01","reason":"승진"}"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.approvalStatus", is("PENDING")))
				.andReturn();
		long appointmentId = objectMapper.readTree(created.getResponse().getContentAsString()).get("id").asLong();

		// 승인 → 사원 소속/직급 반영
		mockMvc.perform(patch("/appointments/" + appointmentId + "/approve")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.approvalStatus", is("APPROVED")));

		mockMvc.perform(get("/employees/4").header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.departmentName", is("컴퓨터공학과")))
				.andExpect(jsonPath("$.positionName", is("조교수")));

		// 이미 처리된 건 재승인 → 409
		mockMvc.perform(patch("/appointments/" + appointmentId + "/approve")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isConflict());
	}

	@Test
	void 학력을_등록하고_조회한다() throws Exception {
		String token = loginAsAdmin();

		mockMvc.perform(post("/employees/6/educations")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"schoolName":"한국대학교","major":"행정학","degree":"학사","status":"졸업"}"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.schoolName", is("한국대학교")));

		mockMvc.perform(get("/employees/6/educations").header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].employeeId", is(6)));
	}
}
