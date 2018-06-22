#Simple eureka-js-client demo

## Content

There are two services registering themselves with a Eureka server, `demo-client` and `demo-searcher`. 

`demo-searcher` will trigger `Bing Web Search` with a given query, and return a subset of the result.

`demo-client` will call `demo-searcher` without knowing the connection details. It gets hostname and port from Eureka registry:

```
const instance = eureka.getInstancesByAppId(SEARCHER)[0];
const url = `http://${instance.hostName}:${instance.port['$']}?search=${q};
```

## How to run demo

1. `npm install`
1. Start a Eureka server (Port 8080)
1. Create file `.env` and add `API_KEY=<your-bing-api-key>`
1. Start searcher: `npm run searcher.js`
1. Start client: `npm run client.js`
1. Call `http://localhost:5555/client?q=foo` in browser.
