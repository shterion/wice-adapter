const request = require('request-promise');
const wice = require('./../actions/wice');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

wice.createSession(cfg, () => {
  if (cfg.cookie) {
    const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_companies&full_list=1&cookie=${cfg.cookie}`;
    request.get(uri)
      .then((res) => {
        let resObj = JSON.parse(res);
        console.log(`COMPANIES LENGTH:${resObj.loop_addresses.length}`);
        // console.log(JSON.stringify(resObj.loop_addresses, undefined, 2));
        return resObj;
      }).catch((e) => {
        console.log(`ERROR: ${e}`);
      });
  } else {
    console.log('ERROR: No cookie found...');
    return;
  }
});
