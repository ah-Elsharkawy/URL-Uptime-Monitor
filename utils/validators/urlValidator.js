const Ajv = require("ajv");
const ajv = new Ajv();

// Custom format function for date-time validation
ajv.addFormat("date-time", (data) => {
	return !isNaN(Date.parse(data));
  });

// url schema
const schema = {
	type: "object",
	properties: {
		link: {
			type: "string",
		},
		userID: {
			type: "string",
		},
		status: {
			type: "string",
			default: "down",
		},
		downtime: {
			type: "number",
			default: 0,
		},
		uptime: {
			type: "number",
			default: 0,
		},
		history: {
			type: "array",
			items: {
				type: "object",
				properties: {
					timestamp: {
						type: "string",
						format: "date-time",
					},
					status: {
						type: "string",
					},
				},
				required: ["timestamp", "status"],
			},
		},
		requests_count: {
			type: "number",
			default: 0,
		},
		outages: {
			type: "number",
			default: 0,
		},
		total_response_time: {
			type: "number",
			default: 0,
		},
		tag: {
			type: "string",
			default: "none",
		},
	},
	required: ["link", "userID"],
};

module.exports = ajv.compile(schema);
