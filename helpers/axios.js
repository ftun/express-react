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
        return await axios(config);
    }
    catch(error) {
        return error;
    }
};

export default Request;
