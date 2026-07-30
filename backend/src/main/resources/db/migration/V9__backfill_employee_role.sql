-- employee_role 은 시드된 7명에만 있고, 승인으로 생성된 계정에는 매핑이 없었다.
-- RBAC 를 실제 인가에 사용하기 시작하므로, 매핑이 없는 계정을 employee.role 열거값 기준으로 채운다.
-- (매핑이 하나도 없는 계정만 대상 — 이미 배정된 계정의 역할은 건드리지 않는다.)
INSERT INTO `employee_role` (`employee_id`, `role_id`)
SELECT e.`employee_id`, r.`role_id`
FROM `employee` e
JOIN `role` r
  ON r.`code` = CONCAT('ROLE_', e.`role`)
 AND r.`deleted` = FALSE
WHERE NOT EXISTS (
    SELECT 1 FROM `employee_role` er WHERE er.`employee_id` = e.`employee_id`
);
