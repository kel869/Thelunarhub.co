exports.handler = async function(event) {
  const { sign, period } = JSON.parse(event.body);
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: 'Write a ' + period + ' horoscope for ' + sign + ' for ' + new Date().toDateString() + '. 2-3 sentences, mystical and uplifting tone. Just the horoscope text, no label or sign name.'
      }]
    })
  });
  const data = await response.json();
  const text = data.content[0].text;
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ horoscope: text })
  };
};
