import express from 'express';
import path from 'node:path';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import generateToken from './generateToken';
import cwl from './cwl';
import currentwar from './currentwar';

const envfile = path.resolve(process.cwd(), '.env');
dotenv.config({
  path: envfile,
});

const port = process.env.port;

const app = express();
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: '频繁访问，请稍后重试',
});

app.use(limiter);

app.use('/currentwar', currentwar);

app.use('/generateToken', generateToken);

app.use('/cwl', cwl);

app.listen(port, () => {
  console.log(`Express app listen on port ${port}`);
});
