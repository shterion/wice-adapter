const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  name: 'Frenchy',
  firstname: 'Ben',
  same_contactperson: 'auto'
};

wice.createSession(cfg, () => {
  if (cfg.cookie) {

    let user = JSON.stringify(input);
    let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_persons&cookie=${cfg.cookie}&ext_search_do=1&name=${input.name}`;
    let existingRowid = 0;
    let requestOptions = {
      uri,
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    function checkForExistingUser() {
      return new Promise((resolve, reject) => {
        request.get(requestOptions).then((res) => {
          let resObj = JSON.parse(res);
          // console.log(JSON.stringify(resObj));

          if (resObj.loop_addresses) {
            existingRowid = resObj.loop_addresses[0].rowid;
            console.log(`Person alredy exists ... ROWID: ${existingRowid}`);
            // return true;
          }

          // resObj.loop_addresses.forEach((person) => {
          //   // if (person.name === msg.body.name) {
          //     existingRowid = person.rowid;
          //     console.log('Person alredy exists...');
          //     // flag = true;
          //     return false;
          //   // }
          // });

          resolve(true);
        }).catch((e) => {
          reject(e);
        })
      });
    };

    checkForExistingUser().then(() => {
      if (existingRowid == 0) {
        const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=insert_contact&cookie=${cfg.cookie}&data=${user}`;

        request.get(uri).then((res) => {
          reply = res;
          console.log('NOT EXISTS');
        });

      } else {
        input.rowid = existingRowid;
        contact = JSON.stringify(input);
        const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=update_contact&cookie=${cfg.cookie}&data=${contact}`;

        request.get(uri).then((res) => {
          reply = res;
          console.log('EXISTS');
        });

      }
      // console.log(flag);
      // if (!flag) {
      //   const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=insert_contact&cookie=${cfg.cookie}&data=${user}`;
      //   request.get(uri).then((res) => {
      //     let newPerson = JSON.parse(res);
      //     // console.log(JSON.stringify(newPerson, undefined, 2));
      //     console.log(newPerson.rowid);
      //   });
      // } else {
      //   console.log('HERE');
      // }
    });
    // const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=insert_contact&cookie=${cfg.cookie}&data=${user}`;
    //
    // request.get(uri).then((res) => {
    //   let newPerson = JSON.parse(res);
    //   // console.log(JSON.stringify(newPerson, undefined, 2));
    //   console.log(newPerson.rowid);
    // }
    // , (err) => {
    //   console.log(`ERROR: ${err}`);
    // }).catch((e) => {
    //   console.log(`ERROR: ${e}`);
    // });

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
