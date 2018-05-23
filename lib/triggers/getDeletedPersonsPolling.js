const request = require('request-promise');
const wice = require('./../actions/wice');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

wice.createSession(cfg, () => {
  if (cfg.cookie) {
    const options = {
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_persons&full_list=1&cookie=${cfg.cookie}`,
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    request.get(options)
      .then((res) => {
        const resObj = JSON.parse(res);
        let customUserFormat;
        let deletedPersons = [];

        resObj.loop_addresses.forEach((user) => {

          if (user.deactivated == 1) {
            customUserFormat = {
              rowid: user.rowid,
              name: user.name,
              firstname: user.firstname,
              email: user.email,
              deactivated: user.deactivated
            };
            deletedPersons.push(customUserFormat);
          }
        });
        console.log(JSON.stringify(deletedPersons, undefined, 2));
        // console.log(`CONTACTS LENGTH: ${JSON.stringify(resObj.loop_addresses.length, undefined, 2)}`);
        return deletedPersons;
      }).catch((e) => {
        console.log(`ERROR: ${e}`);
      });
  } else {
    console.log('ERROR: No cookie found...');
    return;
  }
});
