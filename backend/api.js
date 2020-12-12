const { default: Axios } = require('axios');
const { respondError } = require('./common');

module.exports.post = async (url, headers, body, res) => {
  const config = {
    method: 'post',
    url,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(body),
  };
  try {
    const response = await Axios(config);
    const cookie = response.headers['set-cookie'].reduce((a, b, i) => {
      if (i === 0) {
        b += ';';
      }
      return a += b;
    }, '');
    return { ...response.data, cookie };
  } catch (error) {
    const { response } = error;
    if (((response || {}).data || {}).message) {
      return res.status(response.status).json(respondError(response.data.message))
    }
    console.error('ERROR - post()');
    return null;
  }
}

module.exports.get = async (url, headers, res) => {
  const config = {
    method: 'get',
    url,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await Axios(config);
    return response.data;
  } catch (error) {
    console.log('ERROR - get()');
    return null;
  }
}
