/**
 * Created by Yogesh on 11/7/16.
 */

import {Meteor} from 'meteor/meteor';
import {HTTP as HTTP_Meteor} from 'meteor/http';

import {Utils} from './helpers.lib.js';

import {
  apiRequestTimeout,
  defaultHeaders
} from './lib/constants.js';

const requestTypes = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  del: 'DEL'
};

const buildUrl = (request) => {
  let url = request.url;

  if (request.options && request.options.query) {
    url = url.includes('?') ? `${url}&` : `${url}?`;
    url = `${url}${Object.keys(request.options.query).map(key => [key, request.options.query[key]].join('=')).join('&')}`;
  }

  return url;
};

const buildOptions = (request) => {
  return Object.assign(Object.assign({
    timeout: apiRequestTimeout
  }, request.options || {}), {
    headers: Object.assign({}, defaultHeaders(), request.options && request.options.headers || {})
  });
};

const logRequest = (type, url, options) => {
  const loggedOptions = Object.assign({}, options);

  if (loggedOptions.data) {
    Object.keys(loggedOptions.data).forEach(key => {
      if (-1 !== key.search(/pass/i)) {
        const maskedData = {};

        maskedData[key] = '***masked***';

        loggedOptions.data = Object.assign({}, loggedOptions.data, maskedData);
      }
    });
  }

  console.log(type, url);
  console.log(`DETAILS`, JSON.stringify(loggedOptions));
};

const handleError = (error) => {
  if (error) {

    let details;

    try {
      details = JSON.stringify(error);
    } catch (e) {
      details = JSON.stringify(e);
    } finally {
      console.error(details);
    }

    let errorData = error.response && (error.response.data && error.response.data.error || error.response.data);
    let errorContent = error.response && error.response.content;

    let code = (errorData &&
        (errorData.httpCode ||                          // UAS HTTP status code
            errorData.statusId ||                           // UAS status id
            errorData.errorCode)) ||                        // RA errorCode
        (error.response &&
            error.response.statusCode) ||                   // Node HTTP status code
        500;                                              // Default status code

    let description = (errorData &&
        (errorData.userMessage ||                       // UAS user message
            errorData.systemMessage ||                      // UAS system message
            errorData.description ||                        // RA error message
            errorData.message)) ||                          // Node error message
        (error &&
            error.message) ||                               // JS error message
        errorContent ||                                   // Unparsed error content
        `Unknown error occurred`;                         // Default error message

    throw {
      code,
      description,
      details
    };

  }
};

const handleResponse = response => {
  if (response.data && response.data.error) {
    throw {
      response: {
        data: response.data.error
      }
    };
  }

  if (undefined === response ||
      (undefined === response.data &&
          undefined === response.content)) {
    throw new Error(`No response received`);
  }

  return response.data || response.content;
};

const HTTPRequest = (function () {

  function request(request) {
    const type = request.type || requestTypes.get;

    if (!request.url) {
      throw {
        code: 400,
        description: `No url specified for HTTP ${type} request`
      };
    }

    try {
      const url = buildUrl(request);
      const options = buildOptions(request);

      logRequest(type, url, options);

      return handleResponse(HTTP_Meteor.call(type, url, options));
    } catch (error) {
      handleError(error);
    }

  }

  function call(request) {
    return Meteor.call('request', request);
  }

  function get(url, options) {
    return call({
      type: requestTypes.get,
      url: url,
      options: options
    });
  }

  function post(url, options) {
    return call({
      type: requestTypes.post,
      url: url,
      options: options
    });
  }

  function put(url, options) {
    return call({
      type: requestTypes.put,
      url: url,
      options: options
    });
  }

  function del(url, options) {
    return call({
      type: requestTypes.del,
      url: url,
      options: options
    });
  }

  Meteor.methods({
    request: Utils.makeAsync(request)
  });

  return {
    call,
    get,
    post,
    put,
    del
  };

}());

export default HTTPRequest;
