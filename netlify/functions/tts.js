exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const { text } = JSON.parse(event.body || '{}');
  if (!text) return { statusCode: 400, body: 'Missing text' };

  const res = await fetch('https://api.cartesia.ai/tts/bytes', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.CARTESIA_KEY,
      'Cartesia-Version': '2024-06-10',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model_id: 'sonic-2',
      transcript: text,
      voice: { mode: 'id', id: '15d0c2e2-8d29-44c3-be23-d585d5f154a1' },
      output_format: { container: 'mp3', encoding: 'mp3', sample_rate: 44100 },
      language: 'es'
    })
  });

  if (!res.ok) {
    const err = await res.text();
    return { statusCode: res.status, body: err };
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'audio/mpeg', 'Access-Control-Allow-Origin': '*' },
    body: buffer.toString('base64'),
    isBase64Encoded: true
  };
};
