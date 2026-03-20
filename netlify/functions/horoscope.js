const https = require('https');

exports.handler = async function(event) {
  const { sign, period } = JSON.parse(event.body);
  
  const data = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: 'Write a ' + period + ' horoscope for ' + sign + ' for ' + new Date().toDateString() + '. 2-3 sentences, mystical and uplifting tone. Just the horoscope text, no label or sign name.'
    }]
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const parsed = JSON.parse(body);
        const text = parsed.content[0].text;
        resolve({
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ horoscope: text })
        });
      });
    });
    req.on('error', () => resolve({
      statusCode: 500,
      body: JSON.stringify({ horoscope: 'The stars are aligning for you today.' })
    }));
    req.write(data);
    req.end();
  });
};
