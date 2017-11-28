/*global process*/
import {Meteor} from 'meteor/meteor';

const processEnv = process && process.env;

let environment = 'development';

if (Meteor.isServer) {
  environment = processEnv && processEnv.NODE_ENV ?
    (processEnv.AWS_ENV ? processEnv.NODE_ENV: environment) : environment;
} else if (Meteor.isClient) {
  let hostname = window && window.location && window.location.hostname;
  environment = processEnv && processEnv.NODE_ENV ?
    // this check will not work if locally trying to connect with development setting
    ('development' === processEnv.NODE_ENV && 'localhost' === hostname ? environment : processEnv.NODE_ENV) : environment;
}

export const env = environment;

export const isDev = 'development' === env;
export const isQA = 'integration' === env;
export const isStage = 'staging' === env;
export const isProd = 'production' === env;

export const log = Meteor.settings.public.log;
export const logLevel = log && 0 <= log.level ? log.level : false;

export const iHaveNoSenseOfHumor = Meteor.settings.public['iHaveNoSenseOfHumor'];
