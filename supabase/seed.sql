-- 插入講師
INSERT INTO instructors (id, name, avatar_url, bio) VALUES
  ('00000000-0000-0000-0000-000000000001', '王小明', '/images/instructors/inst_1.png', '專注於 AI 產品落地與工程實作，帶你從 0 到 1 建立可用的專案。');

-- 插入課程
INSERT INTO courses (id, slug, title, description, cover_url, price, instructor_id, status) VALUES
  ('00000000-0000-0000-0000-000000000101', 'ai-engineering-mvp', 'AI 工程實作入門：從需求到上線', '用最短路徑打造可交付的 AI 專案：需求拆解、資料流程、部署與監控。', '/images/courses/course_1.png', 1490, '00000000-0000-0000-0000-000000000001', 'published');

-- 插入章節
INSERT INTO course_chapters (course_id, title, content, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000101', '課程導覽與學習方式', '本章介紹課程結構與建議學習節奏（內容占位）。', 1),
  ('00000000-0000-0000-0000-000000000101', '建立你的第一個 MVP', '本章帶你完成最小可用產品（內容占位）。', 2);
