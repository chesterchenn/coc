import path from 'node:path';

const root = path.resolve(process.cwd());
const envfile = path.resolve(process.cwd(), '.env');

export { envfile, root };
