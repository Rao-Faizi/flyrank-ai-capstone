fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] })
}).then(async r => {
  console.log(r.status);
  const text = await r.text();
  console.log(text.substring(0, 100));
}).catch(console.error);
