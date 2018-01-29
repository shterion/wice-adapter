const request = require('request-promise');

const wice = require('./../actions/wice');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  rowid: 5711
};

wice.createSession(cfg, () => {
  if (cfg.cookie) {

    let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_article&cookie=${cfg.cookie}&show_detailview=${input.rowid}`;

    request.get(uri).then((res) => {
      let resObj = JSON.parse(res);
      console.log(resObj.description);

      // for (const article of Object.keys(resObj.loop_articles)) {
      //   if (resObj.loop_articles[article].rowid == input.rowid) {
      //     console.log(resObj.loop_articles[article]);
      //     return resObj.loop_articles[article];
      //   }
      // }

    }, (err) => {
      if (err) {
        console.log(`ERROR: ${err}`);
      }
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });

    // try {
    //   let articles = await request.get(uri);
    //   let resObj = JSON.parse(articles);
    //
    //   for (const article of Object.keys(resObj.loop_articles)) {
    //     if (resObj.loop_articles[article].rowid == input.rowid) {
    //       console.log(resObj.loop_articles[article]);
    //       return resObj.loop_articles[article];
    //     }
    //   }
    //
    // Use wice api endpoint for getting an user
    // // let getArticle = JSON.stringify(input);
    // // let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_article&cookie=${cfg.cookie}&data=${getArticle}`;
    // //
    // // try {
    // //   let getArticle = await request.get(uri);
    // //   console.log(JSON.parse(getArticle));
    //
    // } catch (e) {
    //   console.log(`ERROR: ${e}`);
    // }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
