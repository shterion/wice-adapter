"use strict";
const Q = require('q');
const request = require('request-promise');
const messages = require('elasticio-node').messages;

const wice = require('./wice.js');

exports.process = processAction;

/**
 * This method will be called from elastic.io platform providing following data
 *
 * @param msg incoming message object that contains ``body`` with payload
 * @param cfg configuration that is account information and configuration field values
 */

function processAction(msg, cfg) {

  let reply = {};
  let self = this;
  msg.body.number = 'auto';

  // First create a session in Wice
  wice.createSession(cfg, () => {
    if (cfg.cookie) {

      let article = JSON.stringify(msg.body);
      let existingRowid = 0;

      let options = {
        method: 'POST',
        uri: 'https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json',
        headers: {
          'X-API-KEY': cfg.apikey
        }
      };

      checkForExistingArticle().then(() => {
        if (existingRowid == 0) {
          console.log('Creating an article ...');
          saveArticle('insert_article', article);
        } else {
          msg.body.rowid = existingRowid;
          console.log('Updating an article ...');
          saveArticle('update_article', article);
        }
      }).catch((e) => {
        console.log(`ERROR: ${e}`);
      });

      // Check it the article alredy exists
      function checkForExistingArticle() {

        options.form = {
          method: 'get_all_articles',
          cookie: cfg.cookie,
          search_filter: msg.body.description
        };

        return new Promise((resolve, reject) => {
          request.post(options)
            .then((res) => {
              let resObj = JSON.parse(res);
              if (resObj.loop_articles) {
                existingRowid = resObj.loop_articles[0].rowid;
                console.log(`Article alredy exists ... Rowid: ${existingRowid}`);
              }
              resolve(true);
            })
            .catch((err) => {
              reject(err);
            });
        });
      };

      // Send a request to Wice
      function saveArticle(method, article) {
        options.form = {
          method,
          cookie: cfg.cookie,
          data: article
        };

        request.post(options).then((res) => {
          reply = res;
        }).catch((e) => {
          console.log(`ERROR: ${e}`);
        });
      };
    }
  });

  function emitData() {
    let data = messages.newMessageWithBody(reply);
    self.emit('data', data);
  }

  function emitError(e) {
    console.log('Oops! Error occurred');
    self.emit('error', e);
  }

  function emitEnd() {
    console.log('Finished execution');
    self.emit('end');
  }

  Q()
  .then(emitData)
  .fail(emitError)
  .done(emitEnd);
}
