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

  let reply = [];
  const self = this;
  msg.body.number = 'auto';

  // First create a session in Wice
  wice.createSession(cfg, () => {
    if (cfg.cookie) {

      const article = JSON.stringify(msg.body);
      let existingRowid = 0;

      let options = {
        method: 'POST',
        uri: 'https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json',
        headers: {
          'X-API-KEY': cfg.apikey
        }
      };

      // Check it the article alredy exists
      function checkForExistingArticle() {

        options = {
            method: 'GET',
            form: {
              method: 'get_all_articles',
              cookie: cfg.cookie,
              search_filter: msg.body.description
            }
        };

        return new Promise((resolve, reject) => {
          request.get(options)
            .then((res) => {
              let resObj = JSON.parse(res);
              if (resObj.loop_articles) {
                existingRowid = resObj.loop_articles[0].rowid;
                console.log(`Article alredy exists ... Rowid: ${existingRowid}`);
              }
              console.log(`existingRowid ${existingRowid}`);
              resolve(existingRowid);
            })
            .catch((e) => {
              reject(e);
            });
        });
      };

      function createArticle() {

        return new Promise((resolve, reject) => {
          if (existingRowid > 0) {
            msg.body.rowid = existingRowid;
            options.form = {
              method: 'update_article',
              cookie: cfg.cookie,
              data: article
            };
            console.log('Updating an article ...');
          } else {
            options.form = {
              method: 'insert_article',
              cookie: cfg.cookie,
              data: article
            };
            console.log('Creating an article ...');
          }

          request.post(options).then((res) => {
            const obj = JSON.parse(res);
            reply.push(obj);
            resolve(reply);
          }).catch((e) => {
            reject(e);
          });
        });
      }

      function emitData() {
        const data = messages.newMessageWithBody({
          "article": reply
        });
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
        .then(checkForExistingArticle)
        .then(createArticle)
        .then(emitData)
        .fail(emitError)
        .done(emitEnd);
    }
  });
}
