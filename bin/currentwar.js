import dotenv from 'dotenv';
import { envfile } from '../config/paths.js';
import { writeResult } from './writeResult.js';
dotenv.config({
  path: envfile,
});

const url = process.env.url;
// const url = 'http://localhost:3030';

async function queryCoc() {
  const response = await fetch(`${url}/currentwar`);
  return response.json();
}

queryCoc().then((res) => {
  if (res.reason === 'accessDenied') {
    console.log('访问权限受限');
    return;
  }
  if (res.state === 'notInwar') {
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
