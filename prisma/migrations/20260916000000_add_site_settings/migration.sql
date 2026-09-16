CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL DEFAULT 'site',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedById" TEXT,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SiteSetting_updatedById_idx" ON "SiteSetting"("updatedById");

ALTER TABLE "SiteSetting"
ADD CONSTRAINT "SiteSetting_updatedById_fkey"
FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "SiteSetting" ("id", "data", "updatedAt")
VALUES (
  'site',
  '{"brandName":"Eng Moaaz Ismail","siteName":"المنصة التعليمية","announcement":"","heroBadge":"منصة تعليمية متكاملة","heroTitle":"تعلم صح، تابع تقدمك، وحقق هدفك","heroDescription":"منصة تعليمية تجمع الشرح والفيديوهات والاختبارات والواجبات والمتابعة في مكان واحد.","heroPrimaryLabel":"ابدأ الآن","heroPrimaryUrl":"/register","heroSecondaryLabel":"استكشف الكورسات","heroSecondaryUrl":"#stages","footerText":"© Eng Moaaz Ismail 2026","supportPhone":"","whatsapp":"","seoTitle":"Eng Moaaz Ismail | المنصة التعليمية","seoDescription":"منصة Eng Moaaz Ismail التعليمية لطلاب المرحلة الثانوية."}'::jsonb,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;
