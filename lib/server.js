/*
 *Title : Server file
 *Description : server files.
 *Author : Al-amin
 *Credit : Sumit Saha
 *Date : 01/30/2021
 */
//Dependencies 
const http = require('http');

const {handleReqRes} =require('../helpers/handleReqRes');
// const environment = require('./helpers/environments');
// const data = require('./lib/data');
// const {sendTwilioSms} = require('./helpers/notifications')


//server object -module caffolding
const server = {};
//configuration
//testing file system
// data.create('test','newFile',{name:'Bangladesh',language:'Bangla'},(err)=>{
//   console.log(`error was`,err);
// });

//read data from file
// data.read('test','newFile',(err,result)=>{
//   console.log(err,result);
// });

//update by truncating the file
// data.update('test','newFile',{name:'England',language:'English'},(err)=>{
//   console.log(err);
// })

//delete file
// data.delete('test','newFile',(err)=>{
//   console.log(err);
// })

// @NOTIFICATION TEST
// sendTwilioSms('01627296915', 'Hello SMS',(err)=>{
//   console.log(`This the error`,err);
// });
//configuration
server.config ={
  port:3000,
};

//create server
server.createServer = () => {
  const createServerVariable = http.createServer(server.handleReqRes);
  createServerVariable.listen(server.config.port, () => {
    console.log(`listening to port ${server.config.port}`);
  });
};
//Handle request and response
server.handleReqRes = handleReqRes;
//start call the server function

server.init =()=>{
    server.createServer();
}

module.exports =server;
