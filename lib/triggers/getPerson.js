const request = require('request-promise');
const wice = require('./../actions/wice');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

let input = {
  rowid: 412148
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {
    const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_person&cookie=${cfg.cookie}&pkey=${input.rowid}`;
    request.get(uri)
    .then((res) => {
      const resObj = JSON.parse(res);
      let customObject = {
        name: resObj.name,
        firstname: resObj.firstname
      };

      console.log(customObject);
      return customObject;
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });
  } else {
    console.log('ERROR: No cookie found...');
    return;
  }
});
