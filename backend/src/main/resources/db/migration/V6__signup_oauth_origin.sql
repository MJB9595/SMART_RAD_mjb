-- 카카오(OAuth) 로그인으로 최초 접속한 '새 이메일'은 회원가입 승인 대기큐로 유입된다.
-- 대기건이 어떤 OAuth 계정에서 왔는지 저장해, 승인 시 EmployeeOAuth 링크를 자동 생성하기 위한 컬럼.
-- 이메일/비밀번호 일반 가입건은 두 컬럼 모두 NULL.
ALTER TABLE `signup_request`
  ADD COLUMN `oauth_provider`         VARCHAR(20)  NULL COMMENT 'OAuth 제공자(KAKAO 등). 일반 가입은 NULL',
  ADD COLUMN `oauth_provider_user_id` VARCHAR(100) NULL COMMENT 'OAuth 제공자측 사용자 식별자';
