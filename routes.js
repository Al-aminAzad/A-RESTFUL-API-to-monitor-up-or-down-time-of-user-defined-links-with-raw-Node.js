/*
 *Title : Routes
 *Description : A RESTFUL API to monitor up or down time of user defined links
 *Author : Al-amin
 *Credit : Sumit Saha
 *Date : 01/25/2021
 */
//dependencies

const { sampleHandler } = require('./handlers/routeHandlers/samplehandlers');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { checkHandler } = require('./handlers/routeHandlers/checkHandler');
const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};

module.exports = routes;
