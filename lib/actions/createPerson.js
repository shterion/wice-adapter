const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  name: 'Pötärs',
  firstname: 'Sebastän',
  email: 'löwwwww@mail.com',
  same_contactperson: 'auto'
  // rowid: 412149
};

wice.createSession(cfg, () => {
  if (cfg.cookie) {
    let user = JSON.stringify(input);
    let existingRowid = 0;
    // let requestOptions = {
    //   uri: `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_persons&cookie=${cfg.cookie}&ext_search_do=1&name=${input.name}`,
    //   headers: {
    //     'X-API-KEY': cfg.apikey
    //   }
    // };

    checkForExistingUser().then(() => {
      if (existingRowid == 0) {
        console.log('Flag 1', existingRowid);
        // const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=insert_contact&cookie=${cfg.cookie}&data=${user}`;
        requestToWice('insert_contact', user);

      } else {
        console.log('Flag 2', existingRowid);
        input.rowid = existingRowid;
        // const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=update_contact&cookie=${cfg.cookie}&data=${user}`;
        requestToWice('update_contact', user);
      }
    });

    function checkForExistingUser() {

      let options = {
        method: 'POST',
        uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
        form: {
          method: 'get_all_persons',
          cookie: cfg.cookie,
          ext_search_do: 1,
          name: input.name
        },
        headers: {
          'X-API-KEY': cfg.apikey
        }
      };

      // return new Promise((resolve, reject) => {
      //   request(options)
      //     .then((res) => {
      //       let resObj = JSON.parse(res);
      //       console.log(resObj);
      //       if (resObj.loop_addresses) {
      //         existingRowid = resObj.loop_addresses[0].rowid;
      //         console.log(`Person alredy exists ... ROWID: ${existingRowid}`);
      //       }
      //       resolve(true);
      //     })
      //     .catch((err) => {
      //       reject(err);
      //     });
      // });

      return new Promise((resolve, reject) => {
        request.post(options).then((res) => {
          let resObj = JSON.parse(res);
          if (resObj.loop_addresses) {
            existingRowid = resObj.loop_addresses[0].rowid;
            console.log(`Person alredy exists ... ROWID: ${existingRowid}`);
          }
          resolve(true);
        }).catch((e) => {
          reject(e);
        })
      });
    };

    function requestToWice(method, user) {
      let options = {
        method: 'POST',
        uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
        form: {
          method: method,
          cookie: cfg.cookie,
          data: user
        },
        headers: {
          'X-API-KEY': cfg.apikey
        }
      };

      request.post(options).then((res) => {
        reply = res;
      });
    };

  } else {
    console.log('ERROR: No cookie found...');
  }
});
