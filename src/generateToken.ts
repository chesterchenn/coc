import express from 'express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const router = express.Router();
const email = process.env.email;
const password = process.env.password;

/**
 * 登陆
 */
async function login() {
  const res = await fetch('https://developer.clashofclans.com/api/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const cookie = res.headers.get('set-cookie');
  return cookie;
}

/**
 * 查询key列表
 */
async function queryKeys(cookie: string) {
  const res = await fetch(
    'https://developer.clashofclans.com/api/apikey/list',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie,
      },
    },
  );
  return await res.json();
}

/**
 * 删除指定的 key
 */
async function revokeKey(cookie: string, id: string) {
  const r = await fetch(
    'https://developer.clashofclans.com/api/apikey/revoke',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie,
      },
      body: JSON.stringify({ id }),
    },
  );
  console.log(await r.json());
}

/**
 * 生成 key
 */
async function createKey(cookie: string, data: unknown) {
  const res = await fetch(
    'https://developer.clashofclans.com/api/apikey/create',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie,
      },
      body: JSON.stringify(data),
    },
  );
  const result = await res.json();
  return result;
}

router.get('/', async (req, res) => {
  const ip = req.query.ip || req.ip;

  // 登录
  const cookie = await login();

  if (!cookie) {
    res.send('登陆失败');
    return;
  }

  // 查询 token 列表
  const list = await queryKeys(cookie);

  // 删除指定的 token
  const keys = list.keys.filter((k: Record<string, string>) =>
    k.name.includes('auto-api'),
  );
  const ids = keys.map((k: Record<string, string>) => k.id);
  if (ids.length > 0) {
    ids.forEach(async (id: string) => {
      revokeKey(cookie, id);
    });
  }

  // 添加指定的token
  const uuidKey = {
    name: `auto-api-${uuidv4()}`,
    description: 'auto api',
    cidrRanges: [ip],
    scopes: null,
  };

  const result = await createKey(cookie, uuidKey);

  res.send(result);
});

export default router;
