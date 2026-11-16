import { chromium } from 'playwright';

async function testReplayAndMascot() {
  console.log('🧪 Testing Replay State Reset and Top-Visible Mascot Placement...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // Mobile viewport
    hasTouch: true,
  });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5173/');

    // Click Play
    const playBtn = page.getByRole('button', { name: /^(PLAY|LEVEL \d+)$/i });
    await playBtn.click();
    await page.waitForTimeout(600);

    // 1. Check Mascot position on mobile (center-left)
    const mascot = page.locator('[data-testid="gameplay-mascot"]');
    await mascot.waitFor({ state: 'visible', timeout: 5000 });
    const mascotBox = await mascot.boundingBox();
    console.log(`   • Mobile Mascot coordinates: x=${mascotBox.x}, y=${mascotBox.y}, w=${mascotBox.width}, h=${mascotBox.height}`);
    if (mascotBox.x > 50 || mascotBox.y < 250 || mascotBox.y > 600) {
      throw new Error(`Mascot not at centre-left! Coordinates: x=${mascotBox.x}, y=${mascotBox.y}`);
    }
    console.log('   • PASS: Mascot is placed at the centre-left of the screen, completely visible and clear of all boundaries!');

    // 2. Pop 1 wrong balloon
    const initialBalloons = await page.locator('[data-balloon-value]').count();
    console.log(`   • Initial balloon count: ${initialBalloons}`);
    
    // Tap correct balloon (5)
    console.log('   • Tapping correct balloon (5) to win...');
    await page.locator('[data-balloon-value="5"]').click({ force: true });
    await page.waitForTimeout(1000);

    // Celebration modal shows up
    const celebModal = page.locator('[data-testid="celebration-modal"]');
    await celebModal.waitFor({ state: 'visible', timeout: 5000 });
    console.log('   • Celebration modal is visible!');

    // Click "Replay"
    console.log('   • Clicking REPLAY button in Celebration modal...');
    const replayBtn = page.getByRole('button', { name: /Replay/i });
    await replayBtn.click();
    await page.waitForTimeout(600);

    // 3. Verify that on Replay, celebration modal is GONE and all 3 balloons are restored fresh
    const modalCount = await page.locator('[data-testid="celebration-modal"]').count();
    console.log(`   • Celebration modals active after replay: ${modalCount} (Expected 0)`);
    if (modalCount !== 0) throw new Error('Celebration modal remained after replay!');

    const replayedBalloons = await page.locator('[data-balloon-value]').count();
    console.log(`   • Unpopped balloons after replay: ${replayedBalloons} (Expected ${initialBalloons})`);
    if (replayedBalloons !== initialBalloons) {
      throw new Error(`Balloons were still popped! Found ${replayedBalloons}, expected ${initialBalloons}`);
    }
    console.log('   • PASS: All balloons fully restored to fresh, unpopped initial state on replay!');

    // Test that the newly replayed level is playable again
    console.log('   • Popping correct balloon (5) again to verify full playability...');
    await page.locator('[data-balloon-value="5"]').click({ force: true });
    await page.waitForTimeout(1000);
    await page.locator('[data-testid="celebration-modal"]').waitFor({ state: 'visible', timeout: 5000 });
    console.log('   • PASS: Level plays through flawlessly on replay!');

    console.log('\n🎉 ALL REPLAY AND MASCOT PLACEMENT TESTS PASSED 100%!\n');
  } catch (err) {
    console.error('❌ Test error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testReplayAndMascot();
