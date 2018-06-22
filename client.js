const express = require('express');
const request = require('request');
const Eureka = require('eureka-js-client').Eureka;

const PORT = 5555;
const SEARCHER = 'demo-searcher';

// ------------------ Express --------------------------------------------------

const app = express();
app.all('/client', function (req, res) {
	const {q} = req.query;
	const instance = eureka.getInstancesByAppId(SEARCHER)[0];
	const url = `http://${instance.hostName}:${instance.port['$']}?search=${q}`;
	request(url).pipe(res);
});
app.listen(PORT);

// ------------------ Eureka --------------------------------------------

const eureka = new Eureka({
	instance: {
		app: 'demo-client',
		hostName: 'localhost',
		ipAddr: '127.0.0.1',
		statusPageUrl: `http://localhost:${PORT}`,
		port: {
			'$': PORT,
			'@enabled': 'true',
		},
		vipAddress: 'vip.demo.client',
		dataCenterInfo: {
			'@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
			name: 'MyOwn',
		},
	},
	eureka: {
		host: 'localhost',
		port: 8080
	}
});
eureka.start();
