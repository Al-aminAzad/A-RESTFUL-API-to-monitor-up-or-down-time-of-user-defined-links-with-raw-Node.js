/*
 *Title : User Handler
 *Description : A RESTFUL API to monitor up or down time of user defined links
 *Author : Al-amin
 *Credit : Sumit Saha
 *Date : 01/26/2021
 */
//dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

// module -scaffolding
const handler = {};
handler.userHandler = (requestProperties, callback) => {
    //   console.log(requestProperties);
    const acceptedMethod = ['get', 'post', 'put', 'delete'];
    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._user[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};
handler._user = {};
handler._user.post = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && (requestProperties.body.firstName.trim().length) > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof (requestProperties.body.lastName) === 'string' && (requestProperties.body.lastName.trim().length) > 0 ? requestProperties.body.lastName : false;
    const phone = typeof (requestProperties.body.phone) === 'string' && (requestProperties.body.phone.trim().length) === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === 'string' && (requestProperties.body.password.trim().length) > 0 ? requestProperties.body.password : false;
    const tosAgrement = typeof (requestProperties.body.tosAgrement) === 'boolean' ? requestProperties.body.tosAgrement : false;
    //console.log(`Firstname= ${firstName} lastname=${lastName} phone = ${phone} pass=${password} agmt= ${tosAgrement}`);
    if (firstName && lastName && phone && password && tosAgrement) {
        //make sure that the user does not exist
        data.read('users', phone, (err1) => {
            if (err1) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgrement
                }
                //store user information to db
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'Created sucessfully',
                        })
                    } else {
                        callback(500, {
                            error: 'Could not create file',
                        })
                    }
                })
            } else {
                callback(500, {
                    error: 'It already exists',
                })
            }
        })
    } else {
        callback(400, {
            error: 'you have a problem in your request',
        })
    }

}
handler._user.get = (requestProperties, callback) => {
    //phone number validation check
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && (requestProperties.queryStringObject.phone.trim().length) === 11 ? requestProperties.queryStringObject.phone : false;


    if (phone) {
        //verify token

        let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
        //console.log(token);
        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                //find user
                data.read('users', phone, (err, u) => {
                    const user = { ...parseJSON(u) }
                    if (!err && user) {
                        delete user.password;
                        callback(200, user);
                    } else {
                        callback(404, {
                            error: 'User not found!',
                        })
                    }
                })
            } else {
                callback(403, {
                    error: 'Authentication failed!'
                })
            }
        })
    } else {
        callback(404, {
            error: 'Phone number not valid!',
        })
    }
}
handler._user.put = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && (requestProperties.body.firstName.trim().length) > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof (requestProperties.body.lastName) === 'string' && (requestProperties.body.lastName.trim().length) > 0 ? requestProperties.body.lastName : false;
    const phone = typeof (requestProperties.body.phone) === 'string' && (requestProperties.body.phone.trim().length) === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === 'string' && (requestProperties.body.password.trim().length) > 0 ? requestProperties.body.password : false;

    if (phone) {
        if (firstName || lastName || password) {
            let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
            //console.log(token);
            tokenHandler._token.verify(token, phone, (tokenId) => {
                if (tokenId) {
                    //find the user based on their phone number
                    data.read('users', phone, (err1, uData) => {
                        const userData = { ...parseJSON(uData) };
                        if (!err1 && userData) {
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.password = hash(password);
                            }
                            //update to database
                            data.update('users', phone, userData, (err2) => {
                                if (!err2) {
                                    callback(200, {
                                        message: 'Updated succesfully!',
                                    });
                                } else {
                                    callback(500, {
                                        error: 'Could not update file!',
                                    })
                                }
                            })
                        } else {
                            callback(400, {
                                error: 'user not exists!',
                            })
                        }
                    })
                } else {
                    callback(403, {
                        error: 'Authentication failed!'
                    })
                }
            })

        } else {
            callback(400, {
                error: 'You have problem in your request!',
            })
        }
    } else {
        callback(400, {
            error: 'Phone number is not valid, please try again!',
        })
    }
}
handler._user.delete = (requestProperties, callback) => {
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && (requestProperties.queryStringObject.phone.trim().length) === 11 ? requestProperties.queryStringObject.phone : false;

    if (phone) {
        //verify token

        let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
        //console.log(token);
        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                //data read to find user using thei unique phone number
                data.read('users', phone, (err1, userData) => {
                    if (!err1 && userData) {
                        data.delete('users', phone, (err2) => {
                            if (!err2) {
                                callback(200, {
                                    message: 'User Successfully deleted!'
                                })
                            } else {
                                callback(500, { error: 'Could not delete!' })
                            }
                        })
                    } else {
                        callback(500, {
                            error: 'File does not exist!',
                        })
                    }
                })
            } else {
                callback(403, {
                    error: 'Authentication failed!'
                })
            }
        })

    } else {
        callback(400, {
            error: 'Phone number is not valid. Please try again',
        })
    }
}

module.exports = handler;