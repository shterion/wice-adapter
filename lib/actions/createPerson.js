const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  name: 'Hamm',
  firstname: 'Ben',
  same_contactperson: 'auto'
}

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let user = JSON.stringify(input);
    const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=insert_contact&cookie=${cfg.cookie}&data=${user}`;

    request.get(uri).then((res) => {
      let newPerson = JSON.parse(res);
      // console.log(JSON.stringify(newPerson, undefined, 2));
      console.log(newPerson.rowid);
    }, (err) => {
      console.log(`ERROR: ${err}`);
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });

    // try {
    //   let newPerson = await request.get(uri);
    //   console.log(`NEW USER ADDED: ${newPerson}`);
    // } catch (e) {
    //   console.log(`ERROR: ${e}`);
    // }

    // request.get(uri).then((user) => {
    //   let newUser = JSON.parse(user);
    //   console.log(`NEW USER ADDED: ${JSON.stringify(newUser, undefined, 2)}`);
    // })

  } else {
    console.log('ERROR: No cookie found...');
  }
});
