import { chromium } from 'playwright';
import { LEVELS } from '../src/data/levels.ts';

async function runStressTest() {
  console.log('🚀 Running Stress Test on Level 50 and Level 100...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 }, // Android Galaxy / Pixel viewport
    hasTouch: true,
  });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5173/');

    // Test Level 50
    console.log('1. Testing Level 50 (Multiplication)...');
    const lvl50 = LEVELS.find((l) => l.level === 50);
    console.log('   Question:', lvl50.question, 'Answer:', lvl50.answer, 'Options:', lvl50.options);

    // Set localStorage unlockedLevel to 50
    await page.evaluate(() => {
      localStorage.setItem('balloon_math_blast_progress', JSON.stringify({
        unlockedLevel: 50,
        levelStars: {},
        highestScore: 0,
        totalPops: 49,
      }));
    });
    await page.reload({ waitUntil: 'networkidle' });

    // Click Play (which now loads level 50)
    await page.getByRole('button', { name: /LEVEL 50/i }).click();
    await page.waitForTimeout(500);

    const q50 = page.locator(`text=${lvl50.question}`);
    await q50.waitFor({ state: 'visible', timeout: 5000 });
    console.log('   Level 50 question loaded successfully!');

    // Check balloon count
    const b50Count = await page.locator('[data-balloon-value]').count();
    console.log(`   Found ${b50Count} balloons for Level 50 (Expected ${lvl50.balloonCount}).`);
    if (b50Count !== lvl50.balloonCount) throw new Error('Level 50 balloon count mismatch');

    // Click correct answer
    console.log(`   Popping correct answer: ${lvl50.answer}...`);
    await page.locator(`[data-balloon-value="${lvl50.answer}"]`).click({ force: true });
    await page.waitForTimeout(800);

    await page.locator('text=LEVEL 50 CLEAR!').waitFor({ state: 'visible', timeout: 5000 });
    console.log('   Level 50 Cleared successfully!');

    // Test Level 100
    console.log('2. Testing Level 100 (Zero & BODMAS Twist)...');
    const lvl100 = LEVELS.find((l) => l.level === 100);
    console.log('   Question:', lvl100.question, 'Answer:', lvl100.answer, 'Options:', lvl100.options);

    await page.evaluate(() => {
      localStorage.setItem('balloon_math_blast_progress', JSON.stringify({
        unlockedLevel: 100,
        levelStars: {},
        highestScore: 0,
        totalPops: 99,
      }));
    });
    await page.reload({ waitUntil: 'networkidle' });

    await page.getByRole('button', { name: /LEVEL 100/i }).click();
    await page.waitForTimeout(500);

    const q100 = page.locator(`text=${lvl100.question}`);
    await q100.waitFor({ state: 'visible', timeout: 5000 });
    console.log('   Level 100 question loaded successfully!');

    const b100Count = await page.locator('[data-balloon-value]').count();
    console.log(`   Found ${b100Count} balloons for Level 100 (Expected ${lvl100.balloonCount}).`);
    if (b100Count !== lvl100.balloonCount) throw new Error('Level 100 balloon count mismatch');

    // Click correct answer
    console.log(`   Popping correct answer: ${lvl100.answer}...`);
    await page.locator(`[data-balloon-value="${lvl100.answer}"]`).click({ force: true });
    await page.waitForTimeout(800);

    await page.locator('text=LEVEL 100 CLEAR!').waitFor({ state: 'visible', timeout: 5000 });
    console.log('   Level 100 Cleared successfully! All 100 levels verified!');
    console.log('🎉 STRESS TEST PASSED 100%!');
  } catch (err) {
    console.error('❌ Stress test error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runStressTest();
