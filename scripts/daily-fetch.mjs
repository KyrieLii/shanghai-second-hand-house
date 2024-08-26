import path from 'node:path';
import { logger } from '@rsbuild/core';
import fs from 'fs-extra';
import puppeteer from 'puppeteer';

import { fetchWithRetry, getDate, sleep } from './utils.mjs';

const __dirname = new URL('.', import.meta.url).pathname;

// set up tz
process.env.TZ = 'Asia/Shanghai';

const write = (obj) => {
  // yesterday
  const { year, month, day, yyyymmdd } = getDate(-1);

  const jsonPath = path.join(__dirname, '../data', `${year}.json`);

  // new data
  const data = {
    date: yyyymmdd,
    ...obj,
  };

  fs.ensureFileSync(jsonPath);

  const json = fs.readJsonSync(jsonPath);

  // if new month
  if (!json[month]) {
    json[month] = {};
  }

  // if exists
  if (json[month][day]) {
    logger.error('exists', json[month][day]);
    logger.error('exists', data);
    process.exit(0);
  }

  // today data
  json[month][day] = data;

  // write file
  fs.writeJsonSync(jsonPath, json, {
    space: 2,
  });

  // done
  logger.success('done:', data);
};

async function fetch() {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    product: 'firefox',
    timeout: 1000000,
    args: [
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list',
      '--disable-web-security',
      '--disable-features=HttpsUpgrades',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto('http://www.fangdi.com.cn/old_house/old_house.html');

  await sleep(5000);

  let retryTime = 0;
  let num;
  let area;

  const getData = async () => {
    if (process.env.DEBUG) {
      const html = await page.waitForSelector('html');
      const htmlStr = await html?.evaluate((node) => node.innerHTML);
      console.log('current url', page.url());
      console.log('htmlStr', htmlStr);
    }

    const numSelector = await page.waitForSelector('#z_sell_num_p');
    const areaSelector = await page.waitForSelector('#z_sell_area_p');

    const num = await numSelector?.evaluate((node) => node.textContent);
    const area = await areaSelector?.evaluate((node) => node.textContent);
    return { num, area };
  };

  while (!num || !area) {
    if (retryTime > 3) {
      logger.error('retry time out, break.');
      break;
    }
    retryTime++;
    await sleep(5000);
    const dd = await getData();
    console.log('debug', dd);
    logger.debug('dd res', dd);
    num = dd.num;
    area = dd.area;
  }

  if (!num || !area) {
    throw new Error('fetch data failed');
  }

  write({
    num: num?.replace('套', '').trim(),
    area: area?.replace('㎡', '').trim(),
  });

  await page.close();
}

const main = async () => {
  await fetchWithRetry(fetch, 3);
};

main();
