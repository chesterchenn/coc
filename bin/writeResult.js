import fs from 'node:fs';
import { formatString2UTC } from '../utils/index.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { envfile } from '../config/paths.js';
import dotenv from 'dotenv';

dotenv.config({
  path: envfile,
});
const showName = process.env.SHOW;
const fileName = 'result.txt';
const tz = 'Asia/Shanghai';
const isCWL = process.env.npm_lifecycle_event === 'cwl';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(tz);

/**
 * 写入结果
 */
export function writeResult({ clan, startTime, endTime, opponent }) {
  const startTimeUTC = formatString2UTC(startTime);
  const endTimeUTC = formatString2UTC(endTime);
  const st = dayjs.utc(startTimeUTC).tz(tz).format('YYYY-MM-DD HH:mm');
  const et = dayjs.utc(endTimeUTC).tz(tz).format('YYYY-MM-DD HH:mm');
  const now = dayjs().format('YYYY-MM-DD HH:mm');
  const isStart = dayjs(now).isAfter(dayjs(st));

  const membersNames = clan.members.map((m) => m.name);
  let text = '';
  text = text + `开始时间🕛 ${st}\n`;
  text = text + `结束时间🕛 ${et}\n`;
  text = text + `查询时间🕛 ${now}\n\n`;

  if (!isStart || showName === 'all') {
    text = text + `参赛人员：\n`;
    membersNames.forEach((m) => (text = text + m + '\n'));
    text = text + '\n';
  }

  // 未开战只返回参赛人员
  if (!isStart) {
    fs.writeFileSync(fileName, text);
    return;
  }

  /**
   * 进攻的人员
   */
  const membersAttacks = clan.members
    .filter((m) => m.attacks && m.attacks.length > 1)
    .map(
      (m) =>
        `${m.mapIndex.toString().padStart(2, '0')}号: ${m.name}(${
          m.attacks.length
        })`,
    );
  const membersPartlyAttacks = clan.members
    .filter((m) => m.attacks && m.attacks.length === 1)
    .map(
      (m) =>
        `${m.mapIndex.toString().padStart(2, '0')}号: ${m.name}(${
          m.attacks.length
        })`,
    );
  /**
   * 未进攻的人员
   */
  const membersNoAttacks = clan.members
    .filter((m) => !m.attacks)
    .map((m) => `${m.mapIndex.toString().padStart(2, '0')}号: ${m.name}`);
  /**
   * 未摧毁的对手
   */
  const unDestroyedOpponent = opponent.members
    .filter((m) => !m.bestOpponentAttack || m.bestOpponentAttack.stars !== 3)
    .map((m) => ({
      ...m,
      output: `${m.mapIndex.toString().padStart(2, '0')}号: ${m.name}(${
        m.bestOpponentAttack ? m.bestOpponentAttack.stars : 0
      })[${m.townhallLevel}本][${
        m.bestOpponentAttack ? m.bestOpponentAttack.destructionPercentage : 0
      }%]`,
    }));

  // 摧毁率精确到小数点后两位
  const clanDes = clan.destructionPercentage.toFixed(2);
  const opponentDes = opponent.destructionPercentage.toFixed(2);

  text = text + `我方星星✨ ${clan.stars} 对方星星✨ ${opponent.stars}\n`;
  text = text + `我方摧毁率🎉 ${clanDes}% ` + `对方摧毁率🎉 ${opponentDes}%\n`;
  text = text + '\n';
  if (isCWL) {
    text = text + `全部进攻人员🔥(${membersPartlyAttacks.length})\n`;
    membersPartlyAttacks.forEach((m) => (text = text + m + '\n'));
    text = text + '\n';
  }
  if (!isCWL) {
    text = text + `全部进攻人员🔥(${membersAttacks.length})\n`;
    membersAttacks.forEach((m) => (text = text + m + '\n'));
    text = text + '\n';
    text = text + `部分进攻人员🔥(${membersPartlyAttacks.length})\n`;
    membersPartlyAttacks.forEach((m) => (text = text + m + '\n'));
    text = text + '\n';
  }
  text = text + `未进攻人员💫(${membersNoAttacks.length})\n`;
  membersNoAttacks.forEach((m) => (text = text + m + '\n'));
  text = text + '\n';
  text = text + `未三星的对手💀(${unDestroyedOpponent.length})\n`;
  unDestroyedOpponent.forEach((m) => (text = text + m.output + '\n'));
  text = text + '\n';

  fs.writeFileSync(fileName, text);
}
