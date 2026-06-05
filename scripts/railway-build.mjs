import { spawnSync } from 'child_process';
import { resolveRailwayAppTarget } from './railway-app-target.mjs';

const target = resolveRailwayAppTarget();
const cwd = target === 'server' ? 'server' : 'my-app';

function run(cmd, args) {
  const result = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: false });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (target === 'server') {
  run('npm', ['install', '--omit=dev']);
} else {
  run('npm', ['install']);
  run('npm', ['run', 'build']);
}

console.log(`[railway-build] OK (${target})`);
