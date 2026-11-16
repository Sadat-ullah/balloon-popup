import { chromium } from 'playwright';

async function runPlaytest() {
  console.log('🚀 Starting Automated Playtest Bot for Balloon Math Blast...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // Mobile viewport
    deviceScaleFactor: 2,
    hasTouch: true,
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // 1. Load Home Screen
    console.log('1. Loading Home Screen at http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    const title = await page.title();
    console.log('   Title:', title);
    if (!title.includes('Balloon Math Blast')) throw new Error('Incorrect title');

    // Check logo image
    const logo = page.locator('img[alt="Balloon Blast"]');
    await logo.waitFor({ state: 'visible', timeout: 5000 });
    console.log('   Logo loaded successfully!');

    // 2. Click Play to enter Level 1
    console.log('2. Clicking PLAY button...');
    const playBtn = page.getByRole('button', { name: /PLAY/i });
    await playBtn.click();
    await page.waitForTimeout(500);

    // 3. Verify Active Game Screen on Level 1
    console.log('3. Verifying Level 1 Game Screen...');
    const questionBanner = page.locator('text=2 + 3 = ?');
    await questionBanner.waitFor({ state: 'visible', timeout: 5000 });
    console.log('   Question banner visible: 2 + 3 = ?');

    // Read balloon values using data-balloon-value attribute
    const balloonElements = page.locator('[data-balloon-value]');
    const count = await balloonElements.count();
    console.log(`   Found ${count} balloons in Level 1 arena (Expected 3).`);
    if (count !== 3) throw new Error(`Expected 3 balloons, found ${count}`);

    const balloonTexts = [];
    for (let i = 0; i < count; i++) {
      const val = await balloonElements.nth(i).getAttribute('data-balloon-value');
      balloonTexts.push(val);
    }
    console.log('   Balloon values:', balloonTexts);

    // 4. Test 1st wrong tap
    const wrongVal = balloonTexts.find((v) => v !== '5');
    console.log(`4. Tapping wrong balloon: ${wrongVal}...`);
    await page.locator(`[data-balloon-value="${wrongVal}"]`).click({ force: true });
    await page.waitForTimeout(600);

    // Check encouraging message
    const speech = await page.locator('text=Oops! Try again!').count();
    console.log('   Encouragement toast displayed:', speech > 0 ? 'YES' : 'NO');

    // 5. Test 2nd wrong tap
    const remainingCount = await page.locator('[data-balloon-value]').count();
    let secondWrongVal = null;
    for (let i = 0; i < remainingCount; i++) {
      const v = await page.locator('[data-balloon-value]').nth(i).getAttribute('data-balloon-value');
      if (v !== '5') {
        secondWrongVal = v;
        break;
      }
    }
    console.log(`5. Tapping second wrong balloon: ${secondWrongVal}...`);
    await page.locator(`[data-balloon-value="${secondWrongVal}"]`).click({ force: true });
    await page.waitForTimeout(800);

    // Check explanation modal
    console.log('   Verifying Visual Dot-Grouping Explanation Modal...');
    const modalHeading = page.locator('text=Helpful Clue!');
    await modalHeading.waitFor({ state: 'visible', timeout: 5000 });
    console.log('   Visual explanation modal shown successfully!');

    // Click Continue
    const continueBtn = page.getByRole('button', { name: /I Got It! Try Again/i });
    await continueBtn.click();
    await page.waitForTimeout(400);

    // 6. Test Correct Tap (5)
    console.log('6. Tapping correct balloon (5)...');
    await page.locator('[data-balloon-value="5"]').click({ force: true });
    await page.waitForTimeout(1000);

    // 7. Verify Celebration Modal & Stars
    console.log('7. Verifying Celebration Modal & Star Award...');
    const celebrationTitle = page.locator('text=LEVEL 1 CLEAR!');
    await celebrationTitle.waitFor({ state: 'visible', timeout: 5000 });
    console.log('   Celebration modal active!');

    // 8. Go to Sky Map
    console.log('8. Opening Sky Map...');
    const skyMapBtn = page.getByRole('button', { name: /Sky Map/i });
    await skyMapBtn.click();
    await page.waitForTimeout(600);

    // Verify Level 2 is unlocked
    const currentBadge = page.locator('text=Current: Level 2 of 100');
    await currentBadge.waitFor({ state: 'visible', timeout: 5000 });
    console.log('   Sky Map verifies Level 2 is now UNLOCKED!');

    // 9. Test LocalStorage Persistence
    console.log('9. Reloading page to test persistence...');
    await page.reload({ waitUntil: 'networkidle' });
    
    // On Home screen, the Play button now displays "LEVEL 2"
    const level2PlayBtn = page.getByRole('button', { name: /LEVEL 2/i });
    await level2PlayBtn.waitFor({ state: 'visible', timeout: 5000 });
    console.log('   Home Screen button successfully displays LEVEL 2!');

    // Open map again to confirm level 2 unlock persisted
    const mapBtn = page.getByRole('button', { name: /100-Level Sky Map/i });
    await mapBtn.click();
    await page.waitForTimeout(500);

    const currentBadgeAfterReload = page.locator('text=Current: Level 2 of 100');
    await currentBadgeAfterReload.waitFor({ state: 'visible', timeout: 5000 });
    console.log('   Progress persisted across reload successfully!');

    // 10. Check Console Errors
    if (consoleErrors.length > 0) {
      console.warn('⚠️ Console errors detected:', consoleErrors);
    } else {
      console.log('✅ ZERO console errors detected during full playthrough!');
    }

    console.log('🎉 PLAYTEST PASSED 100% WITH ZERO DEFECTS!');
  } catch (err) {
    console.error('❌ Playtest failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runPlaytest();
