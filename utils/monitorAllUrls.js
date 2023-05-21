const URL = require("../models/urlModel");
const monitorUrl = require("./monitorUrl");

async function monitorAllUrls() {
	try {
		const urls = await URL.find({});
		urls.forEach((url) => {
			monitorUrl(url.link);
		});

		console.log("Monitoring started for all URLs");
	} catch (error) {
		console.log("Error occurred while monitoring URLs:", error);
	}
}

module.exports = monitorAllUrls;
