-- V7 시드가 하드코딩한 문서번호(ES-2026-001·002, CERT-2026-001·002)와
-- 문서번호 채번기(document_sequence) 충돌 방지:
-- 채번 시퀀스를 시드 이후(2)로 진행시켜, 다음 채번이 003부터 나오도록 한다.
INSERT INTO `document_sequence` (`prefix`, `seq_year`, `last_no`) VALUES
  ('ES',   2026, 2),
  ('CERT', 2026, 2)
ON DUPLICATE KEY UPDATE `last_no` = GREATEST(`last_no`, VALUES(`last_no`));
