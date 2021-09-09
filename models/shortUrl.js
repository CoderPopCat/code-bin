const mongoose = require('mongoose')


const e = new mongoose.Schema({
  name: {
    type: String,
    required: true,
		default: null
  },
  code: {
    type: String,
    required: true,
    default: null
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },
	title: {
		type: String,
		required: false,
		default: null
	},
	description: {
		type: String,
		required: false,
		default: "Store and Access your codes on the cloud"
	}
})

module.exports = mongoose.model('paste', e)
