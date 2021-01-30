/*
 *Title : Utilities 
 *Description : A RESTFUL API to monitor up or down time of user defined links
 *Author : Al-amin
 *Credit : Sumit Saha
 *Date : 01/26/2021
 */
//dependencies
const crypto = require('crypto');
const environments = require('./environments');
//module scaffolding
const utilities = {};
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

//string hashing
utilities.hash = (str) => {
    if (typeof (str) === 'string' && str.length > 0) {
        let hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

// cretae random string for token Id
utilities.createRandomString = (strlength) => {
    let length = strlength;
    length = typeof (strlength) === 'number' && strlength > 0 ? strlength : false;

    if (length) {
        const possiblecharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';
        for (let i = 1; i <= length; i++) {
            const randomCharecter = possiblecharacters.charAt(Math.floor(Math.random() * possiblecharacters.length));
            output += randomCharecter;
        }
        return output;
    } else {
        return false;
    }
};
module.exports = utilities;
