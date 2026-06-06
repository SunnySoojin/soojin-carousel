const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    deviceScaleFactor: 2,   // 2x → 실제 출력 1080×1350px
    viewport: { width: 540, height: 675 },
  });
  const page = await context.newPage();

  const filePath = 'file://' + path.resolve(__dirname, 'jeju-innovation-center.html');
  await page.goto(filePath, { waitUntil: 'networkidle' });

  // 폰트·이미지 로딩 대기
  await page.waitForTimeout(2500);

  // 캡처용 — 모서리 색 튀는 현상 제거
  await page.addStyleTag({ content: '.slide { border-radius: 0 !important; }' });

  const slides = await page.$$('.slide');
  console.log(`Found ${slides.length} slides`);

  const labels = [
    '01-cover',
    '02-why-jeju',
    '03-problem',
    '04-what-is-it',
    '05-spaces',
    '06-support',
    '07-how-to',
    '08-insight',
    '09-checklist',
    '10-cta',
  ];

  for (let i = 0; i < slides.length; i++) {
    const label = labels[i] || `slide-${String(i + 1).padStart(2, '0')}`;
    const outPath = path.join(__dirname, 'slides', `${label}.png`);
    await slides[i].screenshot({
      path: outPath,
      type: 'png',
    });
    console.log(`✓ ${label}.png`);
  }

  await browser.close();
  console.log('\nDone — slides/ 폴더에 저장되었습니다.');
})();
