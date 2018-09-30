'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"/api/carSkypegmwcn"',
  PHOTO_IP: '"http://192.168.1.189:8080"'
})
