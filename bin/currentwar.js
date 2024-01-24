import fs from 'node:fs';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { envfile } from '../config/paths.js';
import { formatString2UTC } from '../utils/index.js';
dotenv.config({
  path: envfile,
});
dayjs.extend(utc);
dayjs.extend(timezone);

const url = process.env.url;
const tz = 'Asia/Shanghai';

async function queryCoc() {
  const response = await fetch(`${url}/currentwar`);
  return response.json();
}

queryCoc().then((res) => {
  console.log(res);
  if (res.state === 'notInWar') {
    fs.writeFileSync('currentwar.text', '尚未开战\n');
    console.log('尚未开战');
    return;
  }
  const { clan, startTime, endTime } = res;
  const { members } = clan;

  const startTimeUTC = formatString2UTC(startTime);
  const endTimeUTC = formatString2UTC(endTime);
  const st = dayjs.utc(startTimeUTC).tz(tz).format('YYYY-MM-DD HH:mm');
  const et = dayjs.utc(endTimeUTC).tz(tz).format('YYYY-MM-DD HH:mm');

  const membersOrders = members.sort((a, b) => a.mapPosition - b.mapPosition);
  const membersNames = membersOrders.map((m) => m.name);
  const membersAttacks = [];
  const membersNoAttacks = [];
  membersOrders.forEach((m) => {
    if (m.attacks) {
      membersAttacks.push(`${m.name}(${m.attacks.length})`);
    } else {
      membersNoAttacks.push(m.name);
    }
  });
  let text = '';
  text = text + `开始时间：${st}\n`;
  text = text + `结束时间：${et}\n`;
  text = text + '\n';
  membersNames.forEach((m) => (text = text + m + '\n'));
  text = text + '\n';
  text = text + `有进攻人员(${membersAttacks.length})\n`;
  membersAttacks.forEach((m) => (text = text + m + '\n'));
  text = text + '\n';
  text = text + `未进攻人员(${membersNoAttacks.length})\n`;
  membersNoAttacks.forEach((m) => (text = text + m + '\n'));
  fs.writeFileSync('currentwar.txt', text);
});
