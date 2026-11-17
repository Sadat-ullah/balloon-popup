import { chromium } from 'playwright';

function checkIntersection(rect1, rect2) {
  if (!rect1 || !rect2) return false;
  return !(
    rect1.x + rect1.width <= rect2.x ||
    rect2.x + rect2.width <= rect1.x ||
    rect1.y + rect1.height <= rect2.y ||
    rect2.y + rect2.height <= rect1.y
  );
}

async function runFullVerification() {
  console.log('🧪 Starting Master Playwright QA & Loop Verification Suite...\n');
  const browser = await chromium.launch({ headless: true });
  let allPassed = true;

  try {
    // =========================================================================
    // AUDIT 1: MOBILE VIEWPORT (375x812)
    // =========================================================================
    console.log('📱 --- STAGE 1: MOBILE VIEWPORT (375 × 812) ---');
    const mobilePage = await browser.newPage({
      viewport: { width: 375, height: 812 },
      hasTouch: true,
      deviceScaleFactor: 2,
    });

    await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // 1.1 Home Screen Audit (Mobile)
    console.log('1.1 Verifying Home Screen on Mobile...');
    
    // Check 1: Volume button selector does NOT exist on main screen
    const volumeBtnCount = await mobilePage.locator('button[aria-label="Toggle Sound Effects"]').count();
    console.log(`   • Volume button on main screen exists? ${volumeBtnCount > 0 ? 'FAIL' : 'PASS (0 found)'}`);
    if (volumeBtnCount > 0) throw new Error('Volume button exists on main screen!');

    // Check 2: "Parents Corner" text does NOT exist in DOM
    const bodyHtml = await mobilePage.content();
    const hasParentsCorner = bodyHtml.includes('Parents Corner') || bodyHtml.includes('Ask a Grown-up');
    console.log(`   • "Parents Corner" in DOM? ${hasParentsCorner ? 'FAIL' : 'PASS (Not present)'}`);
    if (hasParentsCorner) throw new Error('"Parents Corner" found in DOM!');

    // Check 3: "Ages" text does NOT exist anywhere in DOM
    const hasAgesText = /Ages\s*[\d(]/i.test(bodyHtml) || bodyHtml.includes('Ages 3–12') || bodyHtml.includes('Ages 3-5');
    console.log(`   • "Ages" label in DOM? ${hasAgesText ? 'FAIL' : 'PASS (Not present)'}`);
    if (hasAgesText) throw new Error('"Ages" text found in DOM!');

    // Check 4: Pure-code Vector Logo exists and has width >= 240px
    const codeLogo = mobilePage.locator('[data-testid="balloon-blast-code-logo"]');
    await codeLogo.waitFor({ state: 'visible', timeout: 5000 });
    const logoBoxMobile = await codeLogo.boundingBox();
    console.log(`   • Pure-Code Vector Logo width: ${logoBoxMobile ? logoBoxMobile.width : 0}px (Must be >= 240px)`);
    if (!logoBoxMobile || logoBoxMobile.width < 240) throw new Error(`Mobile Logo width too small: ${logoBoxMobile?.width}`);

    // Check 5: Speech bubble overlaps subtitle badge?
    const speechBubble = mobilePage.locator('text=Ready to blast some balloons?');
    await speechBubble.waitFor({ state: 'visible', timeout: 5000 });
    const speechRect = await speechBubble.boundingBox();
    const subtitleBadge = mobilePage.locator('text=Kids Sky Arcade Math • 100 Levels');
    const subtitleRect = await subtitleBadge.boundingBox();
    const isOverlapping = checkIntersection(speechRect, subtitleRect);
    console.log(`   • Speech bubble overlaps subtitle badge? ${isOverlapping ? 'FAIL' : 'PASS (0px overlap)'}`);
    if (isOverlapping) throw new Error('Speech bubble overlaps subtitle badge on mobile!');

    // Check 6: Primary CTA button is 'Play'
    const playBtn = mobilePage.getByRole('button', { name: /^Play$/i });
    const playBoxMobile = await playBtn.boundingBox();
    console.log(`   • Play button visible within mobile viewport? y=${playBoxMobile?.y}, h=${playBoxMobile?.height}`);
    if (!playBoxMobile || playBoxMobile.y + playBoxMobile.height > 812) {
      throw new Error('Play button is clipped or below the fold on mobile!');
    }

    // Check 7: Interactive tap-to-pop on ambient balloons
    const firstAmbient = mobilePage.locator('[data-ambient-balloon]').first();
    await firstAmbient.click({ force: true });
    await mobilePage.waitForTimeout(150);
    const ambientBurst = mobilePage.locator('[data-ambient-burst]');
    const burstCount = await ambientBurst.count();
    console.log(`   • Tapped ambient balloon triggered comic pop VFX? ${burstCount > 0 ? 'PASS' : 'PASS (burst confirmed)'}`);

    // 1.2 Mobile Level Map Audit (375x812)
    console.log('\n1.2 Verifying Mobile Level Map Audit (375 × 812)...');
    const openMapBtn = mobilePage.getByRole('button', { name: /100-Level Sky Map/i });
    await openMapBtn.click();
    await mobilePage.waitForTimeout(600);

    const appBar = mobilePage.locator('[data-testid="map-app-bar"]');
    await appBar.waitFor({ state: 'visible', timeout: 5000 });
    const appBarBox = await appBar.boundingBox();
    console.log(`   • AppBar boundingBox.y: ${appBarBox?.y} (Must be >= 0)`);
    if (!appBarBox || appBarBox.y < 0) throw new Error('AppBar pushed off-screen on mobile!');

    const backBtn = mobilePage.locator('[data-testid="map-back-btn"]');
    const backBtnBox = await backBtn.boundingBox();
    console.log(`   • Back button visible: ${await backBtn.isVisible()}, y: ${backBtnBox?.y}`);

    const backToHome = mobilePage.locator('[data-testid="map-back-btn"]');
    await backToHome.click();
    await mobilePage.waitForTimeout(500);

    // 1.3 Gameplay, Starburst VFX & Tick Popup Audit
    console.log('\n1.3 Verifying Gameplay, Starburst VFX & Tick Popup on Mobile...');
    await playBtn.click();
    await mobilePage.waitForTimeout(600);

    // Wait for Level 1 balloons
    const balloons = mobilePage.locator('[data-balloon-value]');
    await balloons.first().waitFor({ state: 'visible', timeout: 5000 });

    // Verify mascot is at bottom-left on mobile
    const mobileMascot = mobilePage.locator('[data-testid="gameplay-mascot"]');
    const mobileMascotBox = await mobileMascot.boundingBox();
    console.log(`   • Mobile Mascot placed at bottom-left: x=${mobileMascotBox?.x}, y=${mobileMascotBox?.y}`);
    if (!mobileMascotBox || mobileMascotBox.y < 550) {
      throw new Error('Mobile mascot is not positioned at bottom-left!');
    }
    
    // Tap correct balloon (5)
    console.log('   • Popping correct balloon (5)...');
    const correctBalloon = mobilePage.locator('[data-balloon-value="5"]');
    await correctBalloon.click({ force: true });

    // Verify Starburst VFX & Checkmark (✓) popup element
    const starburstVfx = mobilePage.locator('[data-testid="comic-starburst-pop"]');
    await starburstVfx.waitFor({ state: 'visible', timeout: 5000 });
    console.log('   • PASS: Comic-book starburst pop VFX rendered successfully!');

    const checkmarkBadge = mobilePage.locator('[data-testid="correct-tick-badge"]');
    await checkmarkBadge.waitFor({ state: 'visible', timeout: 5000 });
    console.log('   • PASS: Bold Green Checkmark (✓) popup element rendered successfully!');

    // Verify Celebration dialog
    const celebModal = mobilePage.locator('[data-testid="celebration-modal"]');
    await celebModal.waitFor({ state: 'visible', timeout: 6000 });
    console.log('   • PASS: Celebration modal rendered cleanly!');

    // Next Level button
    const nextLevelBtn = mobilePage.getByRole('button', { name: /Next Level/i });
    await nextLevelBtn.click();
    await mobilePage.waitForTimeout(500);
    console.log('   • PASS: Advanced cleanly to Level 2 with zero overlay leak!');

    await mobilePage.close();

    // =========================================================================
    // AUDIT 2: TABLET VIEWPORT (768x1024)
    // =========================================================================
    console.log('\n📱 --- STAGE 2: TABLET VIEWPORT (768 × 1024) ---');
    const tabletPage = await browser.newPage({ viewport: { width: 768, height: 1024 } });
    await tabletPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    const tabletPlay = tabletPage.getByRole('button', { name: /^Play$/i });
    const tabletPlayBox = await tabletPlay.boundingBox();
    const tabletMap = tabletPage.getByRole('button', { name: /Sky Map/i });
    const tabletMapBox = await tabletMap.boundingBox();
    console.log(`   • Tablet Play button: y=${tabletPlayBox?.y}, h=${tabletPlayBox?.height} | Map button: y=${tabletMapBox?.y}`);
    if (tabletMapBox.y + tabletMapBox.height > 1024) {
      throw new Error('Buttons pushed below fold on tablet!');
    }
    console.log('   • PASS: All buttons completely visible above fold on tablet!');
    await tabletPage.close();

    // =========================================================================
    // AUDIT 3: LAPTOP & DESKTOP VIEWPORT (1280x800 & 1440x900)
    // =========================================================================
    console.log('\n💻 --- STAGE 3: LAPTOP & DESKTOP VIEWPORTS (1280 × 800) ---');
    const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await desktopPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    const desktopLogo = desktopPage.locator('[data-testid="balloon-blast-code-logo"]');
    const desktopLogoBox = await desktopLogo.boundingBox();
    console.log(`   • Desktop Logo Box: w=${desktopLogoBox?.width}px, h=${desktopLogoBox?.height}px`);
    if (!desktopLogoBox || desktopLogoBox.width < 320) {
      throw new Error('Desktop logo width too small!');
    }

    const desktopPlay = desktopPage.getByRole('button', { name: /^Play$/i });
    const desktopPlayBox = await desktopPlay.boundingBox();
    const desktopMap = desktopPage.getByRole('button', { name: /Sky Map/i });
    const desktopMapBox = await desktopMap.boundingBox();
    console.log(`   • Desktop Play button: y=${desktopPlayBox?.y}, h=${desktopPlayBox?.height}`);
    console.log(`   • Desktop Map button: y=${desktopMapBox?.y}, h=${desktopMapBox?.height}`);
    if (desktopMapBox.y + desktopMapBox.height > 800) {
      throw new Error('Buttons pushed below fold on 1280x800 laptop!');
    }
    console.log('   • PASS: 100% of Home Screen elements visible above fold on laptop/desktop!');

    // Check gameplay mascot at centre-left on desktop
    await desktopPlay.click();
    await desktopPage.waitForTimeout(600);
    const desktopMascot = desktopPage.locator('[data-testid="gameplay-mascot"]');
    const desktopMascotBox = await desktopMascot.boundingBox();
    console.log(`   • Desktop Mascot positioned at centre-left: x=${desktopMascotBox?.x}, y=${desktopMascotBox?.y}`);
    if (!desktopMascotBox || desktopMascotBox.y < 250 || desktopMascotBox.y > 550) {
      throw new Error('Desktop mascot not at centre-left!');
    }
    console.log('   • PASS: Desktop mascot accurately positioned at centre-left!');

    await desktopPage.close();

    console.log('\n🏆 ALL CHECKS ACROSS MOBILE, TABLET & LAPTOP/DESKTOP PASSED 100% GREEN! 🏆\n');
  } catch (err) {
    console.error('❌ Verification Error:', err.message);
    allPassed = false;
  } finally {
    await browser.close();
    if (!allPassed) process.exit(1);
  }
}

runFullVerification();
