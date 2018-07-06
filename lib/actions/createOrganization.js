const request = require('request-promise');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

const { createSession } = require('./../utils/wice');

const options = {
  method: 'POST',
  uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
  headers: {
    'X-API-KEY': cfg.apikey
  }
};

const input = {
  name: 'Company Ltd 3',
  email: 'info@company.com'
};

async function checkForExistingOrganization(organization, cookie) {
  let existingRowid = 0;
  try {
    options.form = {
      method: 'get_all_companies',
      cookie,
      ext_search_do: 1,
      name: input.name
    };

    const rowid = await request.post(options);
    const rowidObj = JSON.parse(rowid);

    if (rowidObj.loop_addresses) {
      existingRowid = rowidObj.loop_addresses[0].rowid;
      console.log(`Organization already exists ... ROWID: ${existingRowid}`);
    }
    return existingRowid;
  } catch (e) {
    throw new Error(e);
  }
}

async function createOrUpdateOrganization(existingRowid, cookie) {
  const organization = JSON.stringify(input);
  try {
    options.form = {
      cookie,
      data: organization
    };
    if (existingRowid == 0) {
      console.log('Creating organization ...');
      options.form.method = 'insert_company';
      const organization = await request.post(options);
      // console.log(JSON.stringify(organization, undefined, 2));
      return organization;
    } else {
      console.log('Updating organization ...');
      input.rowid = existingRowid;
      options.form.method = 'update_company';
      options.form.data = JSON.stringify(input);
      const organization = await request.post(options);
      return organization;
    }
  } catch (e) {
    throw new Error(e);
  }
}

(async function() {
  try {
    const cookie = await createSession(cfg);
    const existingRowid = await checkForExistingOrganization(input, cookie);
    createOrUpdateOrganization(existingRowid, cookie);
  } catch (e) {
    throw new Error(e);
  }
})();
