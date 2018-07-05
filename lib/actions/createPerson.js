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
  name: 'Peterss',
  firstname: 'Sebastian',
  email: 'speters@mail.com',
  same_contactperson: 'auto'
};

async function checkForExistingPerson(person, cookie) {
  let existingRowid = 0;
  try {
    options.form = {
      method: 'get_all_persons',
      cookie,
      ext_search_do: 1,
      name: person.name
    };

    const rowid = await request.post(options);
    const rowidObj = JSON.parse(rowid);
    if (rowidObj.loop_addresses) {
      existingRowid = rowidObj.loop_addresses[0].rowid;
      console.log(`Person already exists ... ROWID: ${existingRowid}`);
    }
    return existingRowid;
  } catch (e) {
    throw new Error(e);
  }
}

async function createOrUpdatePerson(existingRowid, cookie) {
  const person = JSON.stringify(input);
  try {
    options.form = {
      cookie,
      data: person
    };
    if (existingRowid == 0) {
      console.log('Creating person ...');
      options.form.method = 'insert_contact';
      const person = await request.post(options);
      // console.log(JSON.stringify(person, undefined, 2));
      return person;
    } else {
      console.log('Updating person ...');
      input.rowid = existingRowid;
      options.form.method = 'update_contact';
      options.form.data = JSON.stringify(input);
      const person = await request.post(options);
      return person;
    }
  } catch (e) {
    throw new Error(e);
  }
}

(async function() {
  try {
    const cookie = await createSession(cfg);
    const existingRowid = await checkForExistingPerson(input, cookie);
    createOrUpdatePerson(existingRowid, cookie);
  } catch (e) {
    throw new Error(e);
  }
})();
