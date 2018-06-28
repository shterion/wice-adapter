
const request = require('request-promise');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

const { createSession } = require('./../utils/wice');

let input = {
  rowid: 413957 // 413957
};

async function getPerson(options) {
  try {
    const person = await request.get(options);
    const personObj = JSON.parse(person);

    if (!personObj.rowid) {
      throw new Error(`No user with ROWID: ${input.rowid} found...`);
    }

    return customPerson(personObj);
  } catch (e) {
    throw new Error(e);
  }
}

function customPerson(person) {
  const customUserFormat = {
    rowid: person.rowid,
    for_rowid: person.for_rowid,
    same_contactperson: person.same_contactperson,
    name: person.name,
    firstname: person.firstname,
    email: person.email,
    title: person.title,
    salutation: person.salutation,
    birthday: person.birthday,
    private_street: person.private_street,
    private_street_number: person.private_street_number,
    private_zip_code: person.private_zip_code,
    private_town: person.private_town,
    private_state: person.private_state,
    private_country: person.private_country,
    phone: person.phone,
    fax: person.fax,
    private_phone: person.private_phone,
    private_mobile_phone: person.private_mobile_phone,
    private_email: person.private_email
  };
  return customUserFormat;
}

(async function () {
  try {
    const cookie = await createSession(cfg);
    const options = {
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_person&cookie=${cookie}&pkey=${input.rowid}`,
      headers: { 'X-API-KEY': cfg.apikey }
    };
    getPerson(options)
      .then((res) => {
        console.log(res);
        return  res;
      }).catch((e) => console.log(e));
  } catch (e) {
    throw new Error(e);
  }
})();
