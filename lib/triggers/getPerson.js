const request = require('request-promise');

const wice = require('./../actions/wice');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  rowid: 410854
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let getUser = JSON.stringify(input);
    let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_person&cookie=${cfg.cookie}&data=${getUser}`;

    try {
      let getPerson = await request.get(uri);
      console.log(JSON.parse(getPerson));
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
