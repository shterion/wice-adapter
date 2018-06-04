const request = require('request-promise');
const wice = require('./../actions/wice');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

wice.createSession(cfg, () => {
  if (cfg.cookie) {
    getCategoryRowid()
    .then((res) => {
      getDeletedOrganizations(res);
    });
  } else {
    console.log('ERROR: No cookie found...');
    return;
  }
});

function getCategoryRowid() {
  return new Promise((resolve, reject) => {
    const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_companies&cookie=${cfg.cookie}`;
    request.get(uri)
      .then((res) => {
        const resObj = JSON.parse(res);
        resolve(resObj.global_config.trash_address_company_category1);
      }).catch((e) => {
        reject(`ERROR: ${e}`);
      });
  });
}

function getDeletedOrganizations(categoryId) {
  const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_companies&full_list=1&address_category1=${categoryId}&select_category1=${categoryId}&ext_search_do=1&cookie=${cfg.cookie}`;
  let customOrganizationFormat;
  let result = [];

  request.get(uri)
    .then((res) => {
      const resObj = JSON.parse(res);
      resObj.loop_addresses.forEach((organization) => {
        customOrganizationFormat = {
          rowid: organization.rowid,
          name: organization.name
        };
        result.push(customOrganizationFormat);
      });
      console.log(JSON.stringify(result, undefined, 2));
      return result;
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });
}
