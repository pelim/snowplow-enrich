
var d = require('debug')('snowplow-enrich:enrichments:raw')
  , uuid = require('uuid')
  , fs = require('fs')
  , moment = require('moment')
  , uaParser = require('ua-parser')
  ;


try{
  var pkg = {}
  pkg = JSON.parse(fs.readFileSync(__dirname + '/../../package.json'))
} catch (e) {
  console.error('couldn\'t load package.json')
}

module.exports = {
  basic: function (raw, e) {
    var timestamp = parseInt(raw.timestamp / 1000);

    e.collector_tstamp = moment(timestamp).toISOString();
    e.etl_tstamp       = moment(timestamp).toISOString();
    e.dvce_tstamp      = moment(timestamp).toISOString();

    e.event_id = uuid.v4() //UUID.randomUUID().toString
    e.v_collector = 'node-collector' //raw.source.collector // May be updated later if we have a `cv` parameter
    e.v_etl = etlVersion()
    e.user_ipaddress = raw.ipAddress
  },

  userAgent: function (raw, e) {
    // TODO check other parsers - woothee, useragent
    var c = uaParser.parse(raw.userAgent)

    e.br_name = c.ua.toString()
    e.br_family = c.ua.family
    e.br_version = c.ua.major + '.' + c.ua.minor
    e.br_type = ''
    e.br_renderengine = ''
    e.os_name = ''
    e.os_family = c.os.family
    e.os_manufacturer = ''
    e.dvce_type = c.device.family
    e.dvce_ismobile = ''
  }
}

function etlVersion() {
  return 'snowplow-enrich-' + (pkg.version || '')
}
