"use strict";
const Q = require('q');
const request = require('request-promise');
const messages = require('elasticio-node').messages;

const wice = require('./../actions/wice');

exports.process = processTrigger;

/**
 *  This method will be called from elastic.io platform providing following data
 *
 * @param msg
 * @param cfg
 */
function processTrigger(msg, cfg) {

  let articles = [];
  let self = this;

  // Create a session in Wice

  wice.createSession(cfg, () => {

    function getArticles() {

      return new Promise((resolve, reject) => {
        let uri = `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=get_all_articles&cookie=${cfg.cookie}`;
        let requestOptions = {
          uri,
          headers: {
            'X-API-KEY': cfg.apikey
          }
        };

        request.get(requestOptions).then((res) => {
          let resObj = JSON.parse(res);
          articles = resObj.loop_articles;
          resolve(articles);
        }).catch((e) => {
          reject(e);
        });
      });
    }

    // Emit data from promise depending on the result
    function emitData() {
      let data = messages.newMessageWithBody({
        "articles": articles
      });
      self.emit('data', data);
    }

    function emitError(e) {
      console.log(`ERROR: ${e}`);
      self.emit('error', e);
    }

    function emitEnd() {
      console.log('Finished execution');
      self.emit('end');
    }

    Q()
      .then(getArticles)
      .then(emitData)
      .fail(emitError)
      .done(emitEnd);

  });
}
