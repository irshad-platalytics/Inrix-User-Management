/**
 * Created by Yogesh on 6/9/17.
 */

/*eslint no-console: 0*/
/*global console*/
import {Meteor} from 'meteor/meteor';

import sha1 from 'sha1';

import {
  logLevel
} from './lib/settings.js';

import {
  maxStringViewableLength
} from './lib/constants.js';

const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4,
  ALL: 5
};

const timeStamp = () => {
  return new Date().toISOString();
};

export const Logger = (function () {
  let _logLevel = false === logLevel ? logLevels.INFO : logLevel; // default log level

  function method(name, level) {
    if (undefined !== console && 'function' === typeof console[name]) {
      const args = [...arguments];

      args.shift();
      args.shift();

      if (logLevels.ALL === level || level <= _logLevel) {
        if (logLevels.ALL === level) { // print time stamp only for non print logging
          console[name].apply(console, args);
        } else {
          console[name].apply(console, [timeStamp(), ':', ...args]);

          if (Meteor.isClient) {
            Meteor.applyAsync('serverLog', [...arguments]);
          }
        }
      }
    }
  }

  function serverLog(name, level) {
    const args = [...arguments];

    args.shift();
    args.shift();

    method.apply(Logger, [name, level, 'CLIENT:', ...args]);
  }

  if (Meteor.isServer) {
    Meteor.methods({
      serverLog
    });
  }

  return {
    get level() {
      return _logLevel;
    },
    set level(level) {
      _logLevel = level;
    },
    get levels() {
      return logLevels;
    },
    print: method.bind(this, 'log', logLevels.ALL),
    error: method.bind(this, 'error', logLevels.ERROR),
    warning: method.bind(this, 'warn', logLevels.WARN),
    info: method.bind(this, 'info', logLevels.INFO),
    log: method.bind(this, 'log', logLevels.DEBUG),
    debug: method.bind(this, 'debug', logLevels.DEBUG),
    time: method.bind(this, 'time', logLevels.DEBUG),
    timeEnd: method.bind(this, 'timeEnd', logLevels.DEBUG),
    trace: method.bind(this, 'trace', logLevels.TRACE)
  };

}());

function welcomeMessages(appName, appMode, version, env) {
  const messages = [
    `${appName} ${capitalize(appMode)} is loading`,
    `Version: ${version}`,
    `Environment: ${env}`,
    `Log Level: ${logLevel} (${Object.keys(logLevels).find(key => logLevel === logLevels[key])})`
  ];

  let longestMessageLen = Math.max(...messages.map(msg => msg.length));

  return messages.map(msg => {
    while (msg.length <= longestMessageLen) {
      msg = `${msg} `;
    }

    return msg;
  });
}

function capitalize(string) {
  if (!string) {
    return string;
  }

  return string.substr(0, 1).toUpperCase() + string.substr(1);
}

function truncate(string, maxLength = maxStringViewableLength) {
  const truncate = string.length > maxLength;

  return truncate && `${string.substring(0, 32)}...` || string;
}

function randomAlphaNum(length = 8) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function randomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function makeAsync(fn) {
  return function () {
    this.unblock();
    return fn.apply(this, [...arguments]);
  };
}

function hashToken(appId, appKey) {
  return sha1(`${appId}|${appKey}`);
}

function byteArrayToString(bytes) {
  const chars = [];
  for (let i = 0, n = bytes.length; i < n;) {
    chars.push(((bytes[i++] & 0xff) << 8) | (bytes[i++] & 0xff));
  }
  return String.fromCharCode.apply(null, chars);
}

function stringToByteArray(str) {
  const bytes = [];
  for (let i = 0, n = str.length; i < n; i++) {
    const char = str.charCodeAt(i);
    bytes.push(char >>> 8, char & 0xFF);
  }
  return bytes;
}

export const Utils = (function () {
  return {
    welcomeMessages,
    capitalize,
    truncate,
    randomAlphaNum,
    randomInteger,
    makeAsync,
    hashToken,
    byteArrayToString,
    stringToByteArray
  };
}());
