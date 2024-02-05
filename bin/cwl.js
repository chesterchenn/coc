import { envfile } from '../config/paths.js';
import { writeResult } from './writeResult.js';
import dotenv from 'dotenv';
dotenv.config({
  path: envfile,
});

const url = process.env.url;
// const url = 'http://localhost:3030';
const tag = process.env.tag;
const argv = process.argv.slice(2);

async function queryCWL() {
  if (argv.legnth === 0) {
    const response = await fetch(`${url}/cwl`);
    return response.json();
  }
  const args = argv.reduce((acc, cur) => {
    const [key, value] = cur.split('=');
    acc[key] = value;
    return acc;
  }, {});

  const params = new URLSearchParams(args);
  console.log(params);
  const response = await fetch(`${url}/cwl?${params}`);
  return response.json();
}

queryCWL().then((res) => {
  if (res.state === 'notInWar') {
    console.log('尚未开战');
    return;
  }
  console.log(res);
  let { clan, startTime, endTime, opponent } = res;

  const [_clan, _opponent] =
    clan.tag !== `#${tag}` ? [opponent, clan] : [clan, opponent];
  writeResult({
    clan: _clan,
    startTime,
    endTime,
    opponent: _opponent,
  });
});
