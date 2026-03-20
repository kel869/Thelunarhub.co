const https = require('https');

exports.handler = async function(event) {
  const { card, suit, meaning } = JSON.parse(event.body);

  const data = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 250,
    messages: [{
      role: 'user',
      content: 'You are a gifted tarot reader. The card drawn today is the ' + card + '. Its core meaning is: ' + meaning + '. Write a personal, mystical, and uplifting daily message for the person who drew this card. 3-4 sentences. Speak directly to them as "you". No intro or label — just the message.'
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
          body: JSON.stringify({ message: text })
        });
      });
    });
    req.on('error', () => resolve({
      statusCode: 500,
      body: JSON.stringify({ message: 'This card carries deep significance for you today.' })
    }));
    req.write(data);
    req.end();
  });
};
