const request = require('request-promise');
// const wice = require('./../actions/wice');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

const { createSession } = require('./../utils/wice');

let input = {
  rowid: 1 // 368083
};

async function getOrganization(options) {
  try {
    const organization = await request.get(options);
    const organizationObj = JSON.parse(organization);

    if (!organizationObj.rowid) {
      throw new Error(`No organization with ROWID: ${input.rowid} found ...`);
    }

    return customOrganization(organizationObj);

  } catch (e) {
    throw new Error(e);
  }
}

function customOrganization(organization) {
  const customOrganizationFormat = {
    rowid: organization.rowid,
    name: organization.name,
    email: organization.email,
    phone: organization.phone,
    fax: organization.fax,
    street: organization.street,
    street_number: organization.street_number,
    zip_code: organization.zip_code,
    p_o_box: organization.p_o_box,
    town: organization.town,
    state: organization.state,
    country: organization.country

  };
  return customOrganizationFormat;
}

(async function () {
  try {
    const cookie = await createSession(cfg);
    const options = {
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_company&cookie=${cookie}&pkey=${input.rowid}`,
      headers: { 'X-API-KEY': cfg.apikey }
    };
    getOrganization(options)
      .then((res) => {
        console.log(res);
        return  res;
      }).catch((e) => console.log(e));
  } catch (e) {
    throw new Error(e);
  }
})();

// wice.createSession(cfg, async () => {
//   if (cfg.cookie) {
//     const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_company&cookie=${cfg.cookie}&pkey=${input.rowid}`;
//     request.get(uri)
//     .then((res) => {
//       let resObj = JSON.parse(res);
//       console.log(resObj);
//       return resObj;
//     }).catch((e) => {
//       console.log(`ERROR: ${e}`);
//     });
//   } else {
//     console.log('ERROR: No cookie found...');
//     return;
//   }
// });
