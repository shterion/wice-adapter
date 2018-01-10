const request = require('request-promise');

const wice = require('./../actions/wice');
const cfg = require('./../../config/config');

wice.createSession(cfg, async () => {
  let cookie = cfg.cookie;
  let path = cfg.path;

  let uri = `${path}/pserv/base/json?method=get_contacts&cookie=${cookie}`;

  // request.get(uri)
  //   .then((res) => {
  //     let resObj = JSON.parse(res);
  //     console.log(JSON.stringify(resObj, undefined, 2));
  //   }, (err) => {
  //     if (err) {
  //       console.log(`ERROR: ${err}`);
  //     }
  //   });

    try {
      let persons = await request.get(uri);
      let resObj = JSON.parse(persons);
      console.log(JSON.stringify(resObj, undefined, 2));
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

});
