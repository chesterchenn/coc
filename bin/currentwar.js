import dotenv from 'dotenv';
import { envfile } from '../config/paths.js';
import { writeResult } from './writeResult.js';
dotenv.config({
  path: envfile,
});

const url = process.env.url;

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

  writeResult({
    clan,
    startTime,
    endTime,
    opponent,
  });
});
