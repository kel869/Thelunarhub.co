exports.handler = async function(event) {
  const { card, suit, meaning } = JSON.parse(event.body);
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 250,
      messages: [{
        role: 'user',
        content: 'You are a gifted tarot reader. The card drawn today is the ' + card + '. Its core meaning is: ' + meaning + '. Write a personal, mystical, and uplifting daily message for the person who drew this card. 3-4 sentences. Speak directly to them as "you". No intro or label — just the message.'
      }]
    })
  });
  const data = await response.json();
  const message = data.content[0].text;
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ message })
  };
};
