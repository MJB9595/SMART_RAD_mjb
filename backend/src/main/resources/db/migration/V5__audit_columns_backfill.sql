-- 감사 컬럼 백필: allowance / employee_allowance / leave_policy 테이블에
-- created_by / updated_by 컬럼이 V1 스키마에서 누락되어 있었음.
-- 세 엔티티 모두 AuditedEntity(created_by, updated_by)를 상속하므로 컬럼이 필요.
-- 그동안 ddl-auto=update 가 런타임에 자동 생성해 가려졌고, ddl-auto=validate 전환으로 표면화됨.
-- (AuditedEntity: created_by/updated_by 는 nullable Long → BIGINT NULL)

ALTER TABLE `allowance`
  ADD COLUMN `created_by` BIGINT NULL COMMENT '생성자 교직원 PK',
  ADD COLUMN `updated_by` BIGINT NULL COMMENT '수정자 교직원 PK';

ALTER TABLE `employee_allowance`
  ADD COLUMN `created_by` BIGINT NULL COMMENT '생성자 교직원 PK',
  ADD COLUMN `updated_by` BIGINT NULL COMMENT '수정자 교직원 PK';

ALTER TABLE `leave_policy`
  ADD COLUMN `created_by` BIGINT NULL COMMENT '생성자 교직원 PK',
  ADD COLUMN `updated_by` BIGINT NULL COMMENT '수정자 교직원 PK';
