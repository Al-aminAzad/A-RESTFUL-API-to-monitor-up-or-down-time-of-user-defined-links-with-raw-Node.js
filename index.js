/*
 *Title : Uptime Monitoring Application
 *Description : A RESTFUL API to monitor up or down time of user defined links
 *Author : Al-amin
 *Credit : Sumit Saha
 *Date : 01/25/2021
 */
//Dependencies 
const server = require('./lib/server');
const workers = require('./lib/worker');


//App object -module caffolding
const app = {};
app.init =()=>{
  //start the server
  server.init()

  //start the workers
  workers.init();
}

app.init();

module.exports =app;