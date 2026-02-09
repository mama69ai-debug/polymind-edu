-- 啟用 RLS
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- instructors: 公開可讀
CREATE POLICY "instructors_public_read" ON instructors
  FOR SELECT USING (true);

-- courses: 公開可讀已發布課程
CREATE POLICY "courses_public_read" ON courses
  FOR SELECT USING (status = 'published');

-- course_chapters: 僅已加入課程者可讀（避免未購買者看到章節內容）
CREATE POLICY "chapters_enrolled_read" ON course_chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM enrollments
      WHERE enrollments.course_id = course_chapters.course_id
        AND enrollments.user_id = auth.uid()
    )
  );

-- enrollments: 僅本人可讀
CREATE POLICY "enrollments_user_read" ON enrollments
  FOR SELECT USING (auth.uid() = user_id);

-- orders: 僅本人可讀
CREATE POLICY "orders_user_read" ON orders
  FOR SELECT USING (auth.uid() = user_id);
