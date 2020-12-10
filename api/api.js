const fetch = require('node-fetch');

module.exports.post = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const cookie = response.headers.get('Set-Cookie');
    if (response.ok) {
      const payload = await response.json();
      return { ...payload, cookie };
    }
  } catch (error) {
    console.error('ERROR - post():', error);
  }
}
