const { default: Axios } = require('axios');
const { respondError } = require('./common');

module.exports.post = async ({ url, headers = {}, body = {} }) => {
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
    const cookie = response.headers['set-cookie'].reduce((a, b) => {
      if (i === 0) b += ';';
      return a += b;
    }, '');
    return { ...response.data, cookie };
  } catch (error) {
    console.error('ERROR - post():', error);
    return null;
  }
}

module.exports.get = async ({ url, headers }) => {
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
    console.log('ERROR - get():', error);
    return null;
  }
}
