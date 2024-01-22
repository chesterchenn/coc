import fetch from 'node-fetch';
import express from 'express';
import path from 'node:path';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
const envfile = path.resolve(process.cwd(), '.env');
dotenv.config({
  path: envfile,
});

const app = express();
const port = 3000;
const tag = process.env.tag;
const token = process.env.token;
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: '频繁访问，请稍后重试',
});

app.use(limiter);

app.get('/', (_, res) => {
  console.log('hello');
  res.send('hello world');
});

app.get('/currentwar', async (req, res) => {
  const respose = await fetch(`https://api.clashofclans.com/v1/clans/%23${tag}/currentwar`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const r = await respose.json();
  console.log(r);
  res.send(r);
});

app.listen(port, () => {
  console.log(`Express app listen on port ${port}`);
});
