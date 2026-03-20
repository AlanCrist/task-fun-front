const useMock = process.env.REACT_APP_USE_MOCK === 'true';

const api = useMock
  ? require('./mockApi')
  : require('./api');

module.exports = api;
