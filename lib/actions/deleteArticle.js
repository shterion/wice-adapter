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

  // Create a session in Wice
  wice.createSession(cfg, () => {
    if (cfg.cookie) {

      function deleteArticle() {

        return new Promise((resolve, reject) => {

          const article = JSON.stringify(msg.body);
          const options = {
            method: 'POST',
            uri: 'https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json',
            form: {
              method: 'delete_article',
              cookie: cfg.cookie,
              data: article
            },
            headers: {
              'X-API-KEY': cfg.apikey
            }
          };

          request.post(options)
            .then((res) => {
              reply = res;
              console.log('Article has been deleted.');
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
        .then(deleteArticle)
        .then(emitData)
        .fail(emitError)
        .done(emitEnd);
    }
  });
}
