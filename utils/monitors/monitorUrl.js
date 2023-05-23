const axios = require("axios");
const URL = require("../../models/urlModel");
const User = require("../../models/userModel");
const sendEmail = require("../notifications/mailService");
const { error } = require("ajv/dist/vocabularies/applicator/dependencies");

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
			let currentStatus;

			// Check if the website is up or down
			try {
				await axios.get(link, { timeout });
				currentStatus = "up";
			} catch (error) {
				currentStatus = "down";
			}
			const end = Date.now();
			const responseTime = end - start;

			if (currentStatus != url.status) {
				url.status = currentStatus;
				currentStatus === "down" ? (url.uptime = 0) : (url.downtime = 0);
				let user = await User.findOne({ _id: url.userID });
				sendEmail(user.email, user.name, currentStatus, url.link);
			} else {
				currentStatus === "up" ? (url.uptime += 600) : (url.downtime += 600);
			}


			url.history.push({
				timestamp: start,
				status: currentStatus,
			});

			url.requests_count++;
			url.total_response_time += responseTime / 1000;
			url.outages = currentStatus === "down" ? url.outages + 1 : url.outages;

			await URL.findOneAndUpdate({ link: link }, url);

			await new Promise((resolve) => setTimeout(resolve, pollingInterval));
		}
	} catch (error) {
		return error;
	}
}

module.exports = monitorWebsite;
