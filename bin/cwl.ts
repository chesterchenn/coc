import { envfile } from '../config/paths';
import { writeResult } from './writeResult';
import dotenv from 'dotenv';
dotenv.config({
  path: envfile,
});

const url = process.env.url;
// const url = 'http://localhost:3030';
const argv = process.argv.slice(2);

async function queryCWL() {
  if (argv.length === 0) {
    const response = await fetch(`${url}/cwl`);
    return response.json();
  }
  const args = argv.reduce((acc, cur) => {
    const [key, value] = cur.split('=');
    acc[key] = value;
    return acc;
  }, {});

  const params = new URLSearchParams(args);
  const response = await fetch(`${url}/cwl?${params}`);
  return response.json();
}

queryCWL().then((res) => {
  if (res.reason === 'accessDenied') {
    console.log('访问权限受限');
    return;
  }
  if (res.reason === 'notFound') {
    console.log('尚未开战');
    return;
  }

  writeResult(res);
});
