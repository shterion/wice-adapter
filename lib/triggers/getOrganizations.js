const request = require('request-promise');

const wice = require('./../actions/wice');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

wice.createSession(cfg, () => {
  if (cfg.cookie) {

    // let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_companies&cookie=${cfg.cookie}`;
    let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_companies&cookie=${cfg.cookie}`;

    request.get(uri).then((res) => {
      let resObj = JSON.parse(res);
      console.log(`COMPANIES LENGTH:${resObj.loop_addresses.length}`);
      // console.log(JSON.stringify(resObj.loop_addresses, undefined, 2));
    }, (err) => {
      if (err) {
        console.log(`ERROR: ${err}`);
      }
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });

    // try {
    //   let organizations = await request.get(uri);
    //   let resObj = JSON.parse(organizations);
    //   console.log(`COMPANIES LENGTH:${resObj.loop_addresses.length}`);
    //   // console.log(JSON.stringify(resObj.loop_addresses, undefined, 2));
    // } catch (e) {
    //   console.log(`ERROR: ${e}`);
    // }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
