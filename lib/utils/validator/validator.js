// "use strict";
//const messages = require('elasticio-node').messages;

//Import request and ajv module
const request = require('request-promise');
const Ajv = require('ajv');
const persons = require('./personsV2.json');

/**
 * Executes the action's logic by sending a request to the Petstore API and emitting response to the platform.
 * The function returns a Promise sending a request and resolving the response as platform message.
 *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as apiKey and pet status
 * @returns promise resolving a message to be emitted to the platform
 */
/*function processAction(msg, cfg) {

  const schema = () => {
    request.get(options);
  }

  var valid = ajv.validate(schema, data);
  (!valid) ? console.log(ajv.errors) : console.log('Validation successful');

}
exports.process = processAction;
*/

async function getSchema(){
  const input = {
    "categories": [],
    "calendars": [],
    "contactData": [
      {
        "description": "phone number",
        "type": "phone",
        "value": ""
      },
      {
        "description": "second phone number",
        "type": "phone"
      },
      {
        "description": "third phone number",
        "type": "phone"
      },
      {
        "description": "mobile phone number",
        "type": "phone"
      },
      {
        "description": "private mobile phone number",
        "type": "phone",
        "value": ""
      },
      {
        "description": "private phone number",
        "type": "phone",
        "value": ""
      },
      {
        "description": "fax",
        "type": "fax",
        "value": ""
      },
      {
        "description": "email",
        "type": "email",
        "value": ""
      },
      {
        "description": "private email",
        "type": "email",
        "value": ""
      },
      {
        "description": "xing",
        "type": "xing"
      }
    ],
    "address": [
      {
        "description": "",
        "primaryContact": "",
        "country": "",
        "region": "",
        "district": "",
        "city": null,
        "zipCode": null,
        "unit": ""
      }
    ],
    "anniversary": "",
    "nickname": "",
    "language": "",
    "displayName": "",
    "notes": "",
    "birthday": null,
    "gender": "",
    "lastName": "Klühs",
    "middleName": "",
    "firstName": "Hannes",
    "salutation": "",
    "title": "",
    "oihApplicationRecords": [
      {
        "created": "",
        "recordUid": "413954",
        "applicationUid": ""
      }
    ],
    "oihLastModified": "2018-06-05T15:22:54.501Z",
    "oihCreated": "",
    "oihUid": ""
  };

  try {
    // const options = {
    //   uri: 'https://raw.githubusercontent.com/openintegrationhub/Data-and-Domain-Models/master/src/main/schema/addresses/personV2.json',
    //   json: true
    // };
    // const persons = await request.get(options);


    let ajv = new Ajv();
    let blah = { persons };
    let validate = ajv.compile(persons);
    let valid = validate(input);

    if (valid) {
      console.log(`Valid: ${valid}`);
    } else {
      console.log('HEREEEEE');
      console.log(validate.errors);
    }




    // const schema = await request.get(options);
    // let ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    // let test = { persons };
    // let validate = ajv.compile(test);
    // var valid = validate(data);
    // console.log(valid);
    // if (!valid) console.log(validate.errors);

  } catch (e) {
    console.log(`ERROR: ${e}`);
  }

}
getSchema();
