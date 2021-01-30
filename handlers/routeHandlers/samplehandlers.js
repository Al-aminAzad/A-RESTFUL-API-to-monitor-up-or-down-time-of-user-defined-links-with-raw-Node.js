/*
 *Title : Sample Handler
 *Description : A RESTFUL API to monitor up or down time of user defined links
 *Author : Al-amin
 *Credit : Sumit Saha
 *Date : 01/25/2021
 */

// module -scaffolding
const handler = {};
handler.sampleHandler = (requestProperties, callback) => {
  //console.log(requestProperties);
  callback(200, {
    message: 'This is sample url',
  });
};
module.exports = handler;
