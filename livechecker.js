const puppeteer = require('puppeteer');

async function isUserLive(username) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

  try {
    const profileUrl = `https://www.tiktok.com/@${username}`;
    await page.goto(profileUrl, { waitUntil: 'networkidle2', timeout: 0 });

    // Espera 5 segundos para que cargue el contenido dinámico
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Busca el badge de LIVE con la clase conocida
    const isLive = await page.$('.css-101726n-SpanLiveBadge.e1vl87hj3') !== null;

    return { username, isLive };
  } catch (error) {
    return { username, isLive: false, error: error.message };
  } finally {
    await browser.close();
  }
}

module.exports = { isUserLive };
