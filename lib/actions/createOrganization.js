const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  name: 'Cömpany Ltd 3'
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let organization = JSON.stringify(input);
    let existingRowid = 0;

    let options = {
      method: 'POST',
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
      form: {
        method: '',
        cookie: '',
        data: ''
      },
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    checkForExistingCompany().then(() => {
      if (existingRowid == 0) {
        console.log('Creating an organization ...');
        requestToWice('insert_company', organization);

      } else {
        input.rowid = existingRowid;
        requestToWice('update_company', organization);
      }
    });

    function checkForExistingCompany() {

      options.form = {
        method: 'get_all_companies',
        cookie: cfg.cookie,
        ext_search_do: 1,
        name: input.name
      };

      return new Promise((resolve, reject) => {
        request.post(options)
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
    };

    function requestToWice(method, organization) {
      options.form = {
        method,
        cookie: cfg.cookie,
        data: organization
      };

      request.post(options).then((res) => {
        reply = res;
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
