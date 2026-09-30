CREATE TABLE "StudentLessonAccess" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "lessonId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StudentLessonAccess_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "StudentLessonAccess_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "StudentLessonAccess_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "StudentLessonAccess_studentId_lessonId_key" ON "StudentLessonAccess"("studentId", "lessonId");
CREATE INDEX "StudentLessonAccess_studentId_idx" ON "StudentLessonAccess"("studentId");
CREATE INDEX "StudentLessonAccess_lessonId_idx" ON "StudentLessonAccess"("lessonId");
