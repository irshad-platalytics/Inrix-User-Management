/*global Package, Npm*/

Package.describe({
  name: 'inrix:ums',
  summary: 'INRIX User Manangement',
  version: '1.0.0',
  git: ''
});

Npm.depends({
  'semver': '5.1.0'
});

Package.onUse(function (api) {
  var packages = [
    'http',
    'ecmascript',
    'grove:call-async'
  ];

  var clientPackages = [
    'blaze-html-templates',
    'less'
  ];

  api.use(packages);
  api.use(clientPackages, 'client');

  api.mainModule('client/inrix-ums.js', 'client');
  api.mainModule('server/inrix-ums.js', 'server');
});