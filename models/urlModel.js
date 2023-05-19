const mongoose = require("mongoose");
const valid = require("validator");

let urlSchema = new mongoose.Schema({
	url: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		default: "down",
	},
	downtime: {
		type: Number,
		default: 0,
	},
	uptime: {
		type: Number,
		default: 0, 
	},
	history: [
		{
			timestamp: {
				type: Date,
				required: true,
			},
			status: {
				type: String,
				required: true,
			},
		},
	],
	requests_count: {
		type: Number,
		default: 0,
	},
	outages: {
		type: Number,
		default: 0,
	},
	total_response_time: {
		type: Number,
		default: 0,
	},
	tag: {
		type: String,
		default: "none",
	}
});

module.exports = mongoose.model("Url", urlSchema);