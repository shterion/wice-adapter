const request = require('request-promise');

const wice = require('./../actions/wice');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

wice.createSession(cfg, async () => {

  const uri = `${cfg.path}/pserv/base/json?method=get_allPersons&cookie=${cfg.cookie}`;

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
    console.log(`CONTACTS LENGTH:${resObj.length}`);
    // console.log(JSON.stringify(resObj, undefined, 2));
  } catch (e) {
    console.log(`ERROR: ${e}`);
  }

});
