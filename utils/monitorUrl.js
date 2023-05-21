const axios = require("axios");
const URL = require("../models/urlModel");

async function monitorWebsite(link) {
	const timeout = 5000;
	const pollingInterval = 600000;

	try {
		while (true) {
			let url = await URL.findOne({ link: link });
			if (!url) {
				console.log(
					`Stopped monitoring, url: ${link} no longer exists in the database`
				);
				break;
			}
			const start = Date.now();
			const response = await axios.get(link, { timeout });
			const end = Date.now();
			const responseTime = end - start;
			const currentStatus =
				response.status >= 200 && response.status < 400 ? "up" : "down";

			if (currentStatus != url.status) {
				url.status = currentStatus;
				// sendMail(user_email, currentStatus);
				currentStatus === "down" ? (url.uptime = 0) : (url.downtime = 0);
			} else {
				currentStatus === "up" ? (url.uptime += 10) : (url.downtime += 10);
			}

			url.history.push({
				timestamp: start,
				status: currentStatus,
			});

			url.requests_count++;
			url.total_response_time += responseTime;
			url.outages = currentStatus === "down" ? url.outages + 1 : url.outages;
            
			await URL.findOneAndUpdate({ link: link }, url);

			await new Promise((resolve) => setTimeout(resolve, pollingInterval));
		}
	} catch (error) {
		return error;
	}
}

module.exports = monitorWebsite;
