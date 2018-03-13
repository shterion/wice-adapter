const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  name: 'Tess Ltd'
}

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let organization = JSON.stringify(input);
    let existingRowid = 0;
    let requestOptions = {
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_companies&cookie=${cfg.cookie}&ext_search_do=1&name=${input.name}`,
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    checkForExistingCompany().then(() => {
      if (existingRowid == 0) {
        console.log('Flag 1', existingRowid);
        const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=insert_company&cookie=${cfg.cookie}&data=${organization}`;
        requestToWice(uri);

      } else {
        console.log('Flag 2', existingRowid);
        input.rowid = existingRowid;
        const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=update_company&cookie=${cfg.cookie}&data=${organization}`;
        requestToWice(uri);
      }
    });

    function checkForExistingCompany() {
      let options = {
        method: 'POST',
        uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
        form: {
          method: 'get_all_companies',
          cookie: cfg.cookie,
          ext_search_do: 1,
          name: input.name
        },
        headers: {
          'X-API-KEY': cfg.apikey
        }
      };

      return new Promise((resolve, reject) => {
        request(options)
          .then((res) => {
            let resObj = JSON.parse(res);
            if (resObj.loop_addresses) {
              existingRowid = resObj.loop_addresses[0].rowid;
              console.log(`Organization alredy exists ... ROWID: ${existingRowid}`);
            }
            resolve(true);
          })
          .catch((err) => {
            reject(err);
          });
      });

      // return new Promise((resolve, reject) => {
      //   request.get(requestOptions).then((res) => {
      //     let resObj = JSON.parse(res);
      //     if (resObj.loop_addresses) {
      //       existingRowid = resObj.loop_addresses[0].rowid;
      //       console.log(`Organization alredy exists ... ROWID: ${existingRowid}`);
      //     }
      //     resolve(true);
      //   }).catch((e) => {
      //     reject(e);
      //   })
      // });
    };

    function requestToWice(uri) {
      request.get(uri).then((res) => {
        reply = res;
        // console.log(typeof res);
      });
    }

    // START WORKING VERSION
    // let organization = JSON.stringify(input);
    // let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=insert_company&cookie=${cfg.cookie}&data=${organization}`;
    //
    // request.get(uri).then((res) => {
    //   let newOrganization = JSON.parse(res);
    //   console.log(`Organization: ${newOrganization['rowid']}`);
    // }, (err) => {
    //   console.log(`ERROR: ${err}`);
    // }).catch((e) => {
    //   console.log(`ERROR: ${e}`);
    // });

    // END WORKING VERSION

    // try {
    //   let newOrganization = await request.get(uri);
    //   console.log(`NEW COMPANY ADDED: ${organization}`);
    // } catch (e) {
    //   console.log(`ERROR: ${e}`);
    // }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
