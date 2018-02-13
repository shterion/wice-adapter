const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  name: 'Frenchyy',
  firstname: 'Ben',
  same_contactperson: 'auto'
}

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let user = JSON.stringify(input);

    let requestOptions = {
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_persons&cookie=${cfg.cookie}`,
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    // let flag = false;
    // request.get(requestOptions).then((res) => {
    //   let resObj = JSON.parse(res);
    //   for (let i = 0; i < resObj.loop_addresses.length; i++) {
    //     if (resObj.loop_addresses[i].name === input.name) {
    //       console.log('Person alredy exists...');
    //       flag = true;
    //     }
    //   }
    //   return flag;
    //
    //   // resObj.loop_addresses.forEach((person) => {
    //   //   // Best practice is with email but at this time the email is not accesible
    //   //   if (person.name === input.name) {
    //   //     console.log('Person alredy exists...');
    //   //     return false;
    //   //   } else {
    //   //     const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=insert_contact&cookie=${cfg.cookie}&data=${user}`;
    //   //     request.get(uri).then((res) => {
    //   //       let newPerson = JSON.parse(res);
    //   //       // console.log(JSON.stringify(newPerson, undefined, 2));
    //   //       console.log(newPerson.rowid);
    //   //     })
    //   //   }
    //   // });
    // });

    let flag = false;

    function checkForExistingUser() {
      return new Promise((resolve, reject) => {
        request.get(requestOptions).then((res) => {
          let resObj = JSON.parse(res);
          // for (let i = 0; i < resObj.loop_addresses.length; i++) {
          //   if (resObj.loop_addresses[i].name === input.name) {
          //     console.log('Person alredy exists...');
          //     flag = true;
          //   }
          // }

          resObj.loop_addresses.forEach((person) => {
              // Best practice is with email but at this time the email is not accesible
              if (person.name === input.name) {
                console.log('Person alredy exists...');
                flag = true;
              }
            });
          resolve(flag);
        })
      });
    }
    checkForExistingUser().then((flag) => {
      if (!flag) {
        const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=insert_contact&cookie=${cfg.cookie}&data=${user}`;
          request.get(uri).then((res) => {
            let newPerson = JSON.parse(res);
            // console.log(JSON.stringify(newPerson, undefined, 2));
            console.log(newPerson.rowid);
          });
      }
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
