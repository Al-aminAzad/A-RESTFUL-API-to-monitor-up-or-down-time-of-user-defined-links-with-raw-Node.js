/*
 *Title : Not Found Handler 404
 *Description : A RESTFUL API to monitor up or down time of user defined links
 *Author : Al-amin
 *Credit : Sumit Saha
 *Date : 01/25/2021
 */

// module -scaffolding
const handler = {};
handler.notFoundHandler = (requestProperties, callback) => {
  callback(404, {
    message: 'Not Found',
  });
  //  console.log('Not Found');
};
module.exports = handler;
