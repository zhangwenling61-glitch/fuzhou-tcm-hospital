const { chromium } = require('playwright');
const path = require('path');

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    channel: 'chrome', // 使用本地安装的 Chrome
    headless: true
  });

  // 模拟 iPhone 12
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();
  
  console.log('Navigating to http://localhost:8088 ...');
  try {
    await page.goto('http://localhost:8088', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
  } catch (e) {
    console.log('Navigation networkidle timeout, continuing...');
  }

  // 额外等待几秒，确保渲染
  console.log('Waiting 6 seconds for render...');
  await page.waitForTimeout(6000);

  // 截取长图
  const outputPath = path.join(__dirname, 'screenshot_3x.png');
  console.log(`Taking full page screenshot to ${outputPath}...`);
  await page.screenshot({
    path: outputPath,
    fullPage: true
  });

  console.log('Screenshot saved successfully to:', outputPath);
  await browser.close();
}

run().catch(err => {
  console.error('Error during screenshot:', err);
  process.exit(1);
});
