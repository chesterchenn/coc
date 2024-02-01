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
const showName = process.env.SHOW;
const tz = 'Asia/Shanghai';
dayjs.tz.setDefault(tz);
const fileName = 'currentwar.txt';

async function queryCoc() {
  const response = await fetch(`${url}/currentwar`);
  return response.json();
}

queryCoc().then((res) => {
  if (res.state === 'notInWar') {
    console.log('尚未开战');
    return;
  }
  console.log(res);
  const { clan, startTime, endTime, opponent } = res;
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
  text = text + `开始时间🕛 ${st}\n`;
  text = text + `结束时间🕛 ${et}\n`;

  const now = dayjs().format('YYYY-MM-DD HH:mm');
  const isStart = dayjs(now).isAfter(dayjs(st));
  if (isStart) {
    text = text + `我方星星✨ ${clan.stars} 对方星星✨ ${opponent.stars}\n`;
    text =
      text +
      `我方摧毁率🎉 ${clan.destructionPercentage}% ` +
      `对方摧毁率🎉 ${opponent.destructionPercentage}%\n`;
    text = text + '\n';
    text = text + `有进攻人员💀(${membersAttacks.length})\n`;
    membersAttacks.forEach((m) => (text = text + m + '\n'));
    text = text + '\n';
    text = text + `未进攻人员💫(${membersNoAttacks.length})\n`;
    membersNoAttacks.forEach((m) => (text = text + m + '\n'));
    text = text + '\n';
  }

  if (!isStart || showName === 'all') {
    text = text + `参赛人员：\n`;
    membersNames.forEach((m) => (text = text + m + '\n'));
    text = text + '\n';
  }

  fs.writeFileSync(fileName, text);
});
