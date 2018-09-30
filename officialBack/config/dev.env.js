var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"/api/carSkypegmwcn/sys/"',
  PHOTO_IP: '"http://192.168.1.188:8080"'
})
