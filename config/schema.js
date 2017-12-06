var Joi = require('joi')

var serverSchema = Joi.object().required().keys({
  host: Joi.string().hostname(),
  port: Joi.number().required(),
  oauth: Joi.string(),
  folder: Joi.string(),
  uri: Joi.string(),
  client_id: Joi.string(),
  client_secret: Joi.string(),
  tls: Joi.object(),
  _tls: Joi.object(),
  labels: Joi.string()
})

module.exports = {
  server: serverSchema,
  logging: Joi.object(),
  views: Joi.object().required().keys({
    isCached: Joi.boolean().required()
  })
}
