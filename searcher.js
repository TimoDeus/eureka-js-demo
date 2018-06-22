const express = require('express');
require('dotenv').config();
const request = require('request');

const PORT = 4444;

// ------------------ Express --------------------------------------------------

const app = express();
app.all('/', (req, res) => {
	const search = req.query.search;
	const options = {
		method: 'GET',
		uri: 'https://api.cognitive.microsoft.com/bing/v7.0/search?q=' + encodeURIComponent(search),
		headers: {
			'Ocp-Apim-Subscription-Key': process.env.API_KEY
		}
	};
	request(options, (error, resp, body) => {
		const result = JSON.parse(body);
		const processedResult = result.webPages ? result.webPages.value.map(item => ({name: item.name, url: item.url})) : {};
		res.json(processedResult);
	});
});
app.listen(PORT);

// ------------------ Eureka --------------------------------------------

const Eureka = require('eureka-js-client').Eureka;

const eureka = new Eureka({
	instance: {
		app: 'demo-searcher',
		hostName: 'localhost',
		ipAddr: '127.0.0.1',
		statusPageUrl: `http://localhost:${PORT}`,
		port: {
			'$': PORT,
			'@enabled': 'true'
		},
		vipAddress: 'vip.node.test.client',
		dataCenterInfo: {
			'@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
			name: 'MyOwn'
		}
	},
	eureka: {
		host: 'localhost',
		port: 8080
	}
});
eureka.start();
