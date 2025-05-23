const puppeteer = require('puppeteer');

async function isUserLive(username) {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: '/usr/bin/chromium-browser', // usa el Chrome del contenedor
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(`https://www.tiktok.com/@${username}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await page.waitForTimeout(2000);
    const isLive = await page.$('.css-101726n-SpanLiveBadge.e1vl87hj3');

    await browser.close();
    return Boolean(isLive);
  } catch (error) {
    console.error(`⚠️ Error al verificar a ${username}:`, error.message);
    return false;
  }
}

module.exports = { isUserLive };


