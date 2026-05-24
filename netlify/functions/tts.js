exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const { text } = JSON.parse(event.body || '{}');
  if (!text) return { statusCode: 400, body: 'Missing text' };

  const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam - español natural

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    })
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('ElevenLabs error:', err);
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
