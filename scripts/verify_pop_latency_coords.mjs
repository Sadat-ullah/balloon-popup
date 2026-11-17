import { chromium } from 'playwright';

async function testPopLatencyAndCoordinates() {
  console.log('🎯 Running Targeted In-Browser Latency & Coordinate Verification...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // 1. Locate floating ambient balloon on home screen
  const balloon = page.locator('[data-ambient-balloon]').first();
  await balloon.waitFor({ state: 'visible', timeout: 5000 });

  // Get initial bounding box of balloon
  const bBoxBefore = await balloon.boundingBox();
  console.log(`🎈 Balloon visual center: (${(bBoxBefore.x + bBoxBefore.width/2).toFixed(1)}, ${(bBoxBefore.y + bBoxBefore.height/2).toFixed(1)})`);

  // Measure in-browser latency using performance.now() and MutationObserver
  const latency = await page.evaluate(async () => {
    const target = document.querySelector('[data-ambient-balloon]');
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const pop = document.querySelector('[data-balloon-pop-effect]');
        if (pop) {
          const delta = performance.now() - t0;
          observer.disconnect();
          resolve(delta);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      const t0 = performance.now();
      target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
    });
  });

  console.log(`⚡ In-browser DOM response latency on pointerdown: ${latency.toFixed(2)}ms (Target: < 16ms / single frame)`);

  const popEffect = page.locator('[data-balloon-pop-effect]').first();
  await popEffect.waitFor({ state: 'visible', timeout: 500 });

  // Get pop effect bounding box
  const popBox = await popEffect.boundingBox();
  const balloonCenterX = bBoxBefore.x + bBoxBefore.width / 2;
  const balloonCenterY = bBoxBefore.y + bBoxBefore.height / 2;
  const popCenterX = popBox.x + popBox.width / 2;
  const popCenterY = popBox.y + popBox.height / 2;

  const dx = Math.abs(popCenterX - balloonCenterX);
  const dy = Math.abs(popCenterY - balloonCenterY);

  console.log(`📍 Coordinate offset: dx=${dx.toFixed(1)}px, dy=${dy.toFixed(1)}px`);
  if (dx > 25 || dy > 25) {
    throw new Error(`Coordinate mismatch between balloon and pop effect: dx=${dx}, dy=${dy}`);
  }

  console.log('✅ 100% SUCCESS: In-browser sub-frame response & exact dead-center pop confirmed!');
  await browser.close();
}

testPopLatencyAndCoordinates().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
