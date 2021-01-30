/*
 *Title : Token Handler
 *Description : A RESTFUL API to monitor up or down time of user defined links
 *Author : Al-amin
 *Credit : Sumit Saha
 *Date : 01/27/2021
 */
//dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { createRandomString } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');


// module -scaffolding
const handler = {};
handler.tokenHandler = (requestProperties, callback) => {
    //   console.log(requestProperties);
    const acceptedMethod = ['get', 'post', 'put', 'delete'];
    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};
handler._token = {};
handler._token.post = (requestProperties, callback) => {
    const phone = typeof (requestProperties.body.phone) === 'string' && (requestProperties.body.phone.trim().length) === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === 'string' && (requestProperties.body.password.trim().length) > 0 ? requestProperties.body.password : false;

    if (phone && password) {
        data.read('users', phone, (err1, userData) => {
            let hashedPassword = hash(password);
            if (hashedPassword === parseJSON(userData).password) {
                let tokenId = createRandomString(20);
                let expires = Date.now() + 60 * 60 * 1000;
                let tokenObject = {
                    phone,
                    'id': tokenId,
                    expires
                };
                //store the token
                data.create('tokens', tokenId, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            error: 'Could not create file!',
                        })
                    }
                });
            } else {
                callback(400, {
                    error: 'Password is not valid!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'Phone number or password is not valid!'
        })
    }
}

handler._token.get = (requestProperties, callback) => {
    //token id validation check
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && (requestProperties.queryStringObject.id.trim().length) === 20 ? requestProperties.queryStringObject.id : false;
    if (id) {
        //find token
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) }
            if (!err && token) {
                callback(200, token);
            } else {
                callback(404, {
                    error: 'Token not found!',
                })
            }
        })
    } else {
        callback(404, {
            error: 'Id not found!',
        })
    }
}
handler._token.put = (requestProperties, callback) => {
    const id = typeof (requestProperties.body.id) === 'string' && (requestProperties.body.id.trim().length) === 20 ? requestProperties.body.id : false;
    const extend = typeof (requestProperties.body.extend) === 'boolean' && (requestProperties.body.extend) === true ? true : false;
    if (id && extend) {
        data.read('tokens', id, (err1, tokenData) => {
            let tokenObject = parseJSON(tokenData);
            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                //store the token exipre time
                data.update('tokens', id, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200);
                    } else {
                        callback(500, {
                            error: 'Could not update token expire time!'
                        })
                    }
                })
            } else {
                callback(400, {
                    error: 'Token already expired!',
                })
            }
        })
    } else {
        callback(400, {
            error: 'There was a problem in your request!',
        });
    }
};
handler._token.delete = (requestProperties, callback) => {

    const id = typeof (requestProperties.queryStringObject.id) === 'string' && (requestProperties.queryStringObject.id.trim().length) === 20 ? requestProperties.queryStringObject.id : false;

    if (id) {
        //data read to find user using thei unique phone number
        data.read('tokens', id, (err1, tokenData) => {
            if (!err1 && tokenData) {
                data.delete('tokens', id, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'Token Successfully deleted!'
                        })
                    } else {
                        callback(500, { error: 'Could not delete!' })
                    }
                })
            } else {
                callback(500, {
                    error: 'ID does not exist!',
                })
            }
        })
    } else {
        callback(400, {
            error: 'Token id is not valid. Please try again',
        })
    }
}

//General function not route function 
handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            if (parseJSON(tokenData).phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    })
}

module.exports = handler;