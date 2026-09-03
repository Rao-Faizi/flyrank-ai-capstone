const http = require('http');
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/chat',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, res => {
  console.log('Status:', res.statusCode);
  res.on('data', d => process.stdout.write(d));
  res.on('end', () => console.log('\nDone'));
});
req.write(JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }));
req.end();
