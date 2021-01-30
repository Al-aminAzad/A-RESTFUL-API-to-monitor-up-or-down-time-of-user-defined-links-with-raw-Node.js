/*
 *Title : Environments
 *Description : A RESTFUL API to monitor up or down time of user defined links
 *Author : Al-amin
 *Credit : Sumit Saha
 *Date : 01/25/2021
 */

//module scaffolding
const environments = {};
environments.staging = {
    port: 3000,
    envName: 'satging',
    secretKey: 'adhshdhdhdddhmjhvvc',
    maxChecks:5,
    twilio: {
        fromPhone:'',
        accountSid:'',
        authToken:''
    }
};
environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'mbnnfbbgrtrurkh',
    maxChecks:5,
    twilio:{
        fromPhone:'',
        accountSid:'',
        authToken:''
    }
};

//Dtermine whiche environment is passed 
const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

//export corresponding environment object
const environmentToExport = typeof (environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;
module.exports = environmentToExport;