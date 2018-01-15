const request = require('request-promise');

const wice = require('./../actions/wice');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  rowid: 410854
};

wice.createSession(cfg, async () => {
  const cookie = cfg.cookie;
  const path = cfg.path;

  let getUser = JSON.stringify(input);
  console.log(getUser);

  const uri = `${path}/pserv/base/json?method=get_person&cookie=${cookie}&data=${getUser}`;

  try {
    let person = await request.get(uri);
    let resObj = JSON.parse(person);
    // console.log(`CONTACTS LENGTH:${resObj.length}`);
    console.log(JSON.stringify(resObj, undefined, 2));
  } catch (e) {
    console.log(`ERROR: ${e}`);
  }

});
