import { spawn } from 'child_process';
import { resolveRailwayAppTarget } from './railway-app-target.mjs';

const target = resolveRailwayAppTarget();
const cwd = target === 'server' ? 'server' : 'my-app';

console.log(`[railway-start] ${target} (${cwd})`);

const child = spawn('npm', ['run', 'start'], {
  cwd,
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 1);
});
