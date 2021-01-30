/*
 *Title : Notifications library building
 *Description : A RESTFUL API to monitor up or down time of user defined links
 *Author : Al-amin
 *Credit : Sumit Saha
 *Date : 01/29/2021
 */
//dependencies

const https = require('https');
const querystring = require('querystring');
const { twilio } = require('./environments');


//module scaffoldin
const notifications = {};

notifications.sendTwilioSms = (phone, msg, callback) => {
    //console.log('Dhukse');
    // const userPhone = typeof (phone) === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    // const userMsg = typeof (msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
    const userPhone =
        typeof phone === 'string' && phone.trim().length === 11 ? phone : false;

    const userMsg =
        typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600
            ? msg.trim()
            : false;
    //  console.log(userPhone);
    //  console.log(userMsg);
    if (userPhone && userMsg) {
        //congigure the request payload
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMsg,
        }
        // stringify the payload
        const stringifyPayload = querystring.stringify(payload);
        //console.log(stringifyPayload);
        //configure the request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid} : ${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
        //console.log(requestDetails);

        //instantiate the eequest object
        const req = https.request(requestDetails, (res) => {
            //get the status of the send request
            const status = res.statusCode;
            //console.log(status);
            if (status === 200 || status === 201 || status === 401 ) {
                callback(false);
            } else {
                callback(`Status code returnd ${status}`);
            }
        })
        req.on('error', (e) => {
            callback(e);
        })
        req.write(stringifyPayload);
        req.end();

    } else {
        callback('Phone number or message is invalid');
    }
}

module.exports = notifications;