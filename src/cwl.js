import dotenv from 'dotenv';
import express from 'express';
import resultProcess from './resultProcess.js';

dotenv.config();
const router = express.Router();
const token = process.env.token;
const tag = process.env.tag;
const url = 'https://api.clashofclans.com/v1';

/**
 * 查询联赛分组情况
 */
async function queryLeagueGroup() {
  const res = await fetch(`${url}/clans/%23${tag}/currentwar/leaguegroup`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
}

/**
 * 查询联赛的战斗
 */
async function queryWars(warTag) {
  const res = await fetch(`${url}/clanwarleagues/wars/%23${warTag}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
}

router.get('/', async (req, res) => {
  const queryRound = req.query.round;
  const leaguegroup = await queryLeagueGroup();
  if (leaguegroup.reason === 'notFound') {
    res.send(leaguegroup);
    return;
  }
  const { rounds } = leaguegroup;

  // 判断当前回合
  // 寻找未开始的场次，如果有，则向前第二场为当前回合，如果没有，则为最后两场
  const index = rounds.findIndex((_r) => _r.warTags[0] === '#0');
  let currentIndex = 0;
  if (index === -1) {
    const lastButOne = rounds.length - 2;
    const firstWar = rounds[lastButOne].warTags[0];
    const firstResult = await queryWars(firstWar.slice(1));
    if (firstResult.state === 'inWar') {
      currentIndex = lastButOne;
    } else {
      currentIndex = rounds.length - 1;
    }
  } else if (index - 2 < 0) {
    currentIndex = 0;
  } else {
    currentIndex = index - 2;
  }

  const { warTags } = queryRound
    ? rounds[queryRound - 1]
    : rounds[currentIndex];

  const wars = await Promise.all(
    warTags.map((wTag) => {
      return queryWars(wTag.slice(1));
    }),
  );
  wars.forEach((war) => {
    if (war.clan.tag === `#${tag}` || war.opponent.tag === `#${tag}`) {
      const result = resultProcess(war);
      res.send(result);
    }
  });
});

export default router;
