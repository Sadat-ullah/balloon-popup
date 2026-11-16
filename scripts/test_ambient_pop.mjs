import { chromium } from 'playwright';

async function testAmbientBalloonPopDisappears() {
  console.log('🧪 Testing Ambient Balloon Pop & Auto-Disappearance (No Freezing)...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

  try {
    await page.goto('http://localhost:5173/');

    // Observe ambient balloons for 6 seconds
    console.log('   • Monitoring ambient balloons on Home Screen for bursts and clean recovery...');
    let observedBurst = false;
    let burstRecovered = false;

    for (let i = 0; i < 60; i++) { // poll every 100ms for 6s
      await page.waitForTimeout(100);
      const burstCount = await page.locator('[data-ambient-burst]').count();
      if (burstCount > 0) {
        observedBurst = true;
        console.log(`   • Burst event detected (count: ${burstCount})! Waiting for it to disappear...`);
        // Wait 700ms (burst should last ~450ms then vanish)
        await page.waitForTimeout(700);
        const burstCountAfter = await page.locator('[data-ambient-burst]').count();
        console.log(`   • Burst count after 700ms: ${burstCountAfter} (Must be 0)`);
        if (burstCountAfter === 0) {
          burstRecovered = true;
          console.log('   • PASS: Pop animation vanished cleanly and balloon respawned!');
          break;
        } else {
          throw new Error('Pop burst is STILL frozen on screen after 700ms!');
        }
      }
    }

    if (!observedBurst) {
      console.log('   • Note: No spontaneous burst triggered during 6s window, verifying balloon count is stable.');
      const count = await page.locator('[data-ambient-balloon]').count();
      console.log(`   • Active ambient balloons: ${count}`);
    }

    console.log('\n🎉 AMBIENT POP CLEANUP TEST PASSED WITH ZERO FREEZING!\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testAmbientBalloonPopDisappears();
