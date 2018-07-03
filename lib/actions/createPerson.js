const request = require('request-promise');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

const {
  createSession
} = require('./../utils/wice');

const options = {
  method: 'POST',
  uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
  headers: {
    'X-API-KEY': cfg.apikey
  }
};
const input = {
  name: 'Peters',
  firstname: 'Sebastian',
  email: 'speters@mail.com',
  same_contactperson: 'auto'
};

async function checkForExistingPerson(person, cookie) {
  let existingRowid = 0;
  try {
    options.form = {
      method: 'get_all_persons',
      cookie: cookie,
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
      cookie: cookie,
      data: person
    };
    if (existingRowid == 0) {
      console.log('Creating a person ...');
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

// wice.createSession(cfg, () => {
//   if (cfg.cookie) {
//     let existingRowid = 0;
//
//     const options = {
//       method: 'POST',
//       uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
//       headers: {
//         'X-API-KEY': cfg.apikey
//       }
//     };
//
//     for (var person of input) {
//       const user = JSON.stringify(person);
//       checkForExistingUser()
//       .then(() => {
//         if (existingRowid == 0) {
//           console.log('Creating a person ...');
//           createOrUpdatePerson('insert_contact', user);
//         } else {
//           input.rowid = existingRowid;
//           createOrUpdatePerson('update_contact', user);
//         }
//       });
//     }
//
//     function checkForExistingUser() {
//       options.form = {
//         method: 'get_all_persons',
//         cookie: cfg.cookie,
//         ext_search_do: 1,
//         name: person.name
//       };
//
//       return new Promise((resolve, reject) => {
//         request.post(options).then((res) => {
//           const resObj = JSON.parse(res);
//           if (resObj.loop_addresses) {
//             existingRowid = resObj.loop_addresses[0].rowid;
//             console.log(`Person alredy exists ... ROWID: ${existingRowid}`);
//           }
//           resolve(existingRowid);
//         }).catch((e) => {
//           reject(e);
//         })
//       });
//     };
//
//     function createOrUpdatePerson(method, user) {
//       options.form = {
//         method,
//         cookie: cfg.cookie,
//         data: user
//       };
//       request.post(options)
//       .then((res) => {
//         reply = res;
//         return reply;
//       });
//     };
//   } else {
//     console.log('ERROR: No cookie found...');
//     return;
//   }
// });
