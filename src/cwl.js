import dotenv from 'dotenv';
import express from 'express';

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
  const { rounds } = leaguegroup;

  // 判断当前回合
  // 寻找未开始的场次，如果有，则向前第二场为当前回合，如果没有，则最后一场为当前回合
  const index = rounds.findIndex((_r) => _r.warTags[0] === '#0');
  const currentIndex = index === -1 ? rounds.length - 1 : index - 2;
  const { warTags } = queryRound
    ? rounds[queryRound - 1]
    : rounds[currentIndex];

  let result;
  Promise.all(
    warTags.map((wTag) => {
      return queryWars(wTag.slice(1));
    }),
  ).then((wars) => {
    wars.forEach((war) => {
      if (war.clan.tag === `#${tag}` || war.opponent.tag === `#${tag}`) {
        result = war;
      }
    });
    console.log(result);
    if (result.state === 'notInWar') {
      res.send(result);
      return;
    }
    const { clan, opponent } = result;
    const clanMembersOrders = clan.members.sort(
      (a, b) => a.mapPosition - b.mapPosition,
    );
    const opponentMembersOrders = opponent.members.sort(
      (a, b) => a.mapPosition - b.mapPosition,
    );
    res.send({
      ...result,
      clan: {
        ...clan,
        members: clanMembersOrders,
      },
      opponent: {
        ...opponent,
        members: opponentMembersOrders,
      },
    });
  });
});

export default router;
