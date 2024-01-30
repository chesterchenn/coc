import fetch from 'node-fetch';
import express from 'express';
import path from 'node:path';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import generateToken from './generateToken.js';

const envfile = path.resolve(process.cwd(), '.env');
dotenv.config({
  path: envfile,
});

const port = process.env.port;
const tag = process.env.tag;
const token = process.env.token;

const app = express();
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: '频繁访问，请稍后重试',
});

app.use(limiter);

app.get('/currentwar', async (_, res) => {
  const respose = await fetch(
    `https://api.clashofclans.com/v1/clans/%23${tag}/currentwar`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const result = await respose.json();
  console.log(result);
  if (result.state !== 'inWar') {
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
    members: {
      ...clan,
      members: clanMembersOrders,
    },
    opponent: {
      ...opponent,
      members: opponentMembersOrders,
    },
  });
});

app.use('/generateToken', generateToken);

app.listen(port, () => {
  console.log(`Express app listen on port ${port}`);
});
