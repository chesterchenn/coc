import dotenv from 'dotenv';
import { envfile } from '../config/paths';
import { writeResult } from './writeResult';
import fetch from 'node-fetch';
import { QueryResult } from '../types';

dotenv.config({
  path: envfile,
});

const url = process.env.url;
// const url = 'http://localhost:3030';

async function queryCoc(): Promise<QueryResult> {
  const response = await fetch(`${url}/currentwar`);
  return response.json() as Promise<QueryResult>;
}

queryCoc().then((res: QueryResult) => {
  if (res.reason === 'accessDenied') {
    console.log('访问权限受限');
    return;
  }
  if (res.state === 'notInWar') {
    console.log('尚未开战');
    return;
  }

  writeResult(res);
});
