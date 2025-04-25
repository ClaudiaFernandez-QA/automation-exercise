const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Empezar trace
  await context.tracing.start({ screenshots: true, snapshots: true });

  // Ir a la web
  await page.goto('https://www.automationexercise.com');

  console.log('\n🕵️ Explorá la web manualmente...');
  console.log('⏸️ Presioná Enter en la consola cuando termines para guardar el trace\n');

  // Esperar que toques Enter
  process.stdin.once('data', async () => {
    await context.tracing.stop({ path: 'trace.zip' });
    console.log('✅ Trace guardado como trace.zip');
    await browser.close();
    process.exit();
  });
})();
