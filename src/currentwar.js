import dotenv from 'dotenv';
import express from 'express';
import sortWart from './sortWar.js';

dotenv.config();
const router = express.Router();
const token = process.env.token;
const tag = process.env.tag;
const url = 'https://api.clashofclans.com/v1';

/**
 * 查询联赛分组情况
 */
async function queryCurrentWar() {
  const respose = await fetch(`${url}/clans/%23${tag}/currentwar`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await respose.json();
  return result;
}

router.get('/', async (_, res) => {
  const result = queryCurrentWar();
  console.log(result);
  if (result.state === 'notInWar') {
    res.send(result);
    return;
  }
  const sortResult = sortWart(result);
  res.send(sortResult);
});

export default router;
