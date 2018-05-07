const request = require('request-promise');

const wice = require('./../actions/wice');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

wice.createSession(cfg, () => {
  if (cfg.cookie) {

    let requestOptions = {
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_persons&full_list=1&cookie=${cfg.cookie}`,
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    request.get(requestOptions).then((res) => {
      let resObj = JSON.parse(res);
      let customUserFormat;
      let result = [];

      resObj.loop_addresses.forEach((user) => {
        customUserFormat = {
          rowid: user.rowid,
          name: user.name,
          firstname: user.firstname,
          email: user.email
        };
        result.push(customUserFormat)
      });
      console.log(result.length);
      // console.log(`CONTACTS LENGTH: ${resObj.loop_addresses.length}`);
      // console.log(JSON.stringify(result, undefined, 2));
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });

    // try {
    //   let persons = await request.get(uri);
    //   let resObj = JSON.parse(persons);
    //   console.log(`CONTACTS LENGTH:${resObj.loop_addresses.length}`);
    //   // console.log(JSON.stringify(resObj.loop_addresses, undefined, 2));
    //
    // } catch (e) {
    //   console.log(`ERROR: ${e}`);
    // }
  } else {
    console.log('ERROR: No cookie found...');
  }
});
