const { spawn } = require('child_process');

const transfer = spawn('npx', [
  'strapi',
  'transfer',
  '--from', 'https://mintdealsbackend-production.up.railway.app',
  '--from-token', '2f468a84-4e37-40c4-bab0-38d1a3676178',
  '--force'
], {
  stdio: ['pipe', 'inherit', 'inherit']
});

// Answer the prompts
transfer.stdin.write('http://localhost:1337\n');
setTimeout(() => {
  transfer.stdin.write('7b9f122f7da6f4c41d9b898088c81caf72446eaf75895b98784beb6d4618a4313fd7b901733c87e4b6d159b2801dc28b866aca56697975ab62a2cc2710927d3b44df3184b10cb810377063c7d82c15d58ad1cc0cb24cba65a30f4acf5f4136efbdd792c0815c403222ef9d1e3562a4f235dcd4ad8dee1af80d510f5ca81603c4\n');
  transfer.stdin.end();
}, 1000);

transfer.on('close', (code) => {
  process.exit(code);
});
