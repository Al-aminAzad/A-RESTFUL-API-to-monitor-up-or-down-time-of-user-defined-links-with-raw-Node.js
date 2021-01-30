/*
 *Title : Worker file
 *Description : workers files.
 *Author : Al-amin
 *Credit : Sumit Saha
 *Date : 01/30/2021
 */
//Dependencies 
const data = require('./data');
const url = require('url');
const http = require('http');
const https = require('https');
const { parseJSON } = require('../helpers/utilities');
const {sendTwilioSms} = require('../helpers/notifications');

//worker object -module caffolding
const worker = {};
//look up all the checks
worker.gatherAllChecks = () => {
    data.list('checks', (err1, checks) => {
        if (!err1 && checks && checks.length > 0) {
            checks.forEach(check => {
                //read the check data
                data.read('checks', check, (err2, originalCheckData) => {
                    if (!err2 && originalCheckData) {
                        //pass the data to check validator
                        worker.validateCheckData(parseJSON(originalCheckData));
                    } else {
                        console.log('Error: reading one of the check data');
                    }
                })
            });
        } else {
            console.log('Error : could not find any checks to process');
        }
    })
}
// validate indvidual check data
worker.validateCheckData = (originalCheckData) => {
    let originalData = originalCheckData;
    if (originalCheckData && originalCheckData.id) {
        originalData.state = typeof (originalCheckData.state) === 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';
        originalData.lastChecked = typeof (originalCheckData.lastChecked) === 'number' && originalCheckData.lastChecked ? originalCheckData.lastChecked : false;
        //pass to the next process
        worker.performCheck(originalData);
    } else {
        console.log('Error : check was invalid or not properly formatted');
    }
}
//perform check
worker.performCheck = (originalCheckData) => {
    //prepare the initial check outcome
    let checkOutCome = {
        error: false,
        responseCode: false,
    };
    //mar the outcome has not been sent
    let outComeSent = false;
    //parse the hostname & full url from original data
    const parsedUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true);
    const hostName = parsedUrl.hostname;
    const { path } = parsedUrl;
    //construct the request
    const requestDetails = {
        'protocol': `${originalCheckData.protocol}:`,
        'hostname': hostName,
        'method': originalCheckData.method.toUpperCase(),
        'path': path,
        'timeout': originalCheckData.timeoutSeconds * 1000,
    }
    const protocolToUse = originalCheckData.protocol === 'http' ? http : https;
    let req = protocolToUse.request(requestDetails, (res) => {
        //grab the status code
        const status = res.statusCode;
        //console.log(status);
        //update the check outcome and pass to the next process
        checkOutCome.responseCode = status;
        if (!outComeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutCome);
            outComeSent = true;
        }

    });
    req.on('error', (e) => {
        checkOutCome = {
            error: true,
            value: e,
        };
        if (!outComeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    });
    req.on('timeout', (e) => {
        checkOutCome = {
            error: true,
            value: 'timeout',
        };
        if (!outComeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    })
    //request send
    req.end();
}
//save check outcome to database and send to next proces
worker.processCheckOutcome =(originalCheckData,checkOutCome)=>{
    //check out come is down or up
    let state = !checkOutCome.error && checkOutCome.responseCode && originalCheckData.successCodes.indexOf(checkOutCome.responseCode) >-1 ? 'up':'down';
    //decide whethre we should alert the user or not
    let alertWanted = originalCheckData.lastChecked && originalCheckData.state !== state ? true:false;
    //update the check data
    let newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();
    //update thye check to disk
    data.update('checks',newCheckData.id, newCheckData,(err)=>{
        if(!err){
            if(alertWanted){
            //send the check data to next process
            worker.aletUserToStatusChange(newCheckData);
            }else{
                console.log('Alert is not needed as there is no state change');
            }
        }else{
            console.log('Error: trying to save check data one of the checks');
        }
    })
}
//send notofication to user if state changes
worker.aletUserToStatusChange =(newCheckData)=>{
    let msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;
    sendTwilioSms(newCheckData.userPhone,msg,(err)=>{
        if(!err){
            console.log(`user was alerted to a status changes vis SMS ${msg}`);
        }else{
            console.log('There was a problem sending sms to one of the user');
        }
    })
}

//timer to execute the worker process once per minutes
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 8000);
};
worker.init = () => {
    //console.log('Workers started');
    //gather all the checks from checks file in .data
    worker.gatherAllChecks();
    //call the loop so that checks continue 
    worker.loop();
}

module.exports = worker;
