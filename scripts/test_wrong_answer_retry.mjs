import { chromium } from 'playwright';

async function testWrongAnswerRetryBalloonsRestored() {
  console.log('🧪 Testing Wrong Answer Retry: Balloons Must Return to Original State...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

  try {
    await page.goto('http://localhost:5173/');

    // Click Play
    const playBtn = page.getByRole('button', { name: /^(PLAY|LEVEL \d+)$/i });
    await playBtn.click();
    await page.waitForTimeout(500);

    const initialCount = await page.locator('[data-balloon-value]').count();
    console.log(`   • Initial balloon count: ${initialCount}`);

    // Tap first wrong balloon
    const allValues = [];
    for (let i = 0; i < initialCount; i++) {
      allValues.push(await page.locator('[data-balloon-value]').nth(i).getAttribute('data-balloon-value'));
    }
    const wrongValues = allValues.filter((v) => v !== '5');
    console.log(`   • Tapping 1st wrong balloon: ${wrongValues[0]}...`);
    await page.locator(`[data-balloon-value="${wrongValues[0]}"]`).click({ force: true });
    await page.waitForTimeout(500);

    // Balloons count should be initialCount - 1
    const countAfter1stWrong = await page.locator('[data-balloon-value]').count();
    console.log(`   • Balloons remaining after 1st wrong tap: ${countAfter1stWrong}`);

    // Tap second wrong balloon
    console.log(`   • Tapping 2nd wrong balloon: ${wrongValues[1]}...`);
    await page.locator(`[data-balloon-value="${wrongValues[1]}"]`).click({ force: true });
    await page.waitForTimeout(600);

    // Check Explanation modal appears
    const modalHeading = page.locator('text=Helpful Clue!');
    await modalHeading.waitFor({ state: 'visible', timeout: 5000 });
    console.log('   • Visual Explanation Modal appeared!');

    // Click "I Got It! Try Again"
    console.log('   • Clicking "I Got It! Try Again"...');
    const continueBtn = page.getByRole('button', { name: /I Got It! Try Again/i });
    await continueBtn.click();
    await page.waitForTimeout(400);

    // Verify all balloons are restored back to original state
    const countAfterRetry = await page.locator('[data-balloon-value]').count();
    console.log(`   • Unpopped balloons after "I Got It! Try Again": ${countAfterRetry} (Expected ${initialCount})`);
    if (countAfterRetry !== initialCount) {
      throw new Error(`Balloons did NOT return to original state! Found ${countAfterRetry}, expected ${initialCount}`);
    }
    console.log('   • PASS: All popped balloons returned to their original unpopped state on modal retry!');

    // Test the header restart button as well
    console.log('   • Now popping 1 balloon to test header restart button...');
    await page.locator(`[data-balloon-value="${wrongValues[0]}"]`).click({ force: true });
    await page.waitForTimeout(400);

    const restartBtn = page.locator('button[aria-label="Restart Level"]');
    await restartBtn.click();
    await page.waitForTimeout(300);

    const countAfterHeaderRestart = await page.locator('[data-balloon-value]').count();
    console.log(`   • Unpopped balloons after header restart: ${countAfterHeaderRestart} (Expected ${initialCount})`);
    if (countAfterHeaderRestart !== initialCount) {
      throw new Error(`Balloons did not restore on header restart! Found ${countAfterHeaderRestart}`);
    }
    console.log('   • PASS: Header restart button also returns all balloons to original state!');

    console.log('\n🎉 ALL WRONG ANSWER RETRY TESTS PASSED 100%!\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testWrongAnswerRetryBalloonsRestored();
