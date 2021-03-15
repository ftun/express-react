import React from 'react';
const axios = require('axios');

const Request = async (request, extraHeaders={}) => {
    try {
        // extraHeaders['Authorization'] = request.auth || `Bearer ${localStorage.jwttoken}`;
        const config = {
            url : request.url,
            method : request.method || 'get',
            data : request.data || null,
            responseType : request.responseType || 'json',
            headers : extraHeaders,
        };

        if (request.maxContentLength) config.maxContentLength = request.maxContentLength;
        if (request.maxBodyLength) config.maxBodyLength = request.maxBodyLength;
        let response = await axios(config);
        console.log('response => ', response.data);
        return {
                error: false,
                code: response.status,
                data: (response.status != 204 && response.data.hasOwnProperty('data')) ? response.data.data : response.data,
                message: (response.status != 204 && response.data.hasOwnProperty('message')) ? response.data.message : response.statusText
            };
    }
    catch(error) {
        let data = error.response.data || {};
        if (!error.response) {
            if(!error.hasOwnProperty('request') || !error.request.hasOwnProperty('_currentRequest')) {
                return {
                    code: 500,
                    error: true,
                    message: error.message,
                    data: data
                }
            }else {
                if(error.request._currentRequest.res.statusCode === 204) {
                    return {
                        code: 204,
                        error: false,
                        message: error.request._currentRequest.res.statusMessage,
                        data: data
                    }
                }
            }
        };

        if (!error.response.data || error.response.data === '') {
            return {
                code: error.response.status,
                error: true,
                message: (error.response.status !== 404) ? error.response.statusText : `URL: ${error.response.statusText}`,
                data: data
            }
        };

        return {
            data: data,
            error: true,
            code: error.response.status,
            message: error.response.data.hasOwnProperty('message') ? error.response.data.message : (error.response.data.hasOwnProperty('messages') ? error.response.data.messages : error.response.statusText)
        };
    }
};

export default Request;
