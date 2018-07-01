const config = require('./../config/config');
const cfg = config.getEnvironment();
const wice = require('./../lib/utils/wice');
const { configOptions } = require('./seed/seed');

describe('Test triggers', () => {
  test('should create a session', async () => {
    const customOptions = {
      mandant: '',
      username: '',
      password: '',
      path: 'https://oihwice.wice-net.de',
      apikey: ''
    };
    const cookie = await wice.createSession(customOptions);
    expect(cookie).toHaveLength(32);
  });
});
