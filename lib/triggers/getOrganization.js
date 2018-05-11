const request = require('request-promise');
const wice = require('./../actions/wice');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

let input = {
  rowid: 367979
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {
    const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_company&cookie=${cfg.cookie}&pkey=${input.rowid}`;
    request.get(uri)
    .then((res) => {
      let resObj = JSON.parse(res);
      console.log(resObj.name);
      return resObj;
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });
  } else {
    console.log('ERROR: No cookie found...');
    return;
  }
});
