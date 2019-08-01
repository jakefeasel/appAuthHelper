/*

License for AppAuth-JS (Apache 2.0) :
Copyright (c) 2019 The OpenID Foundation

License for AppAuthHelper (Apache 2.0) :
Copyright (c) 2019 ForgeRock, Inc.

*/
"use strict";(function(){function b(d,e,g){function a(j,i){if(!e[j]){if(!d[j]){var f="function"==typeof require&&require;if(!i&&f)return f(j,!0);if(h)return h(j,!0);var c=new Error("Cannot find module '"+j+"'");throw c.code="MODULE_NOT_FOUND",c}var k=e[j]={exports:{}};d[j][0].call(k.exports,function(b){var c=d[j][1][b];return a(c||b)},k,k.exports,b,d,e,g)}return e[j].exports}for(var h="function"==typeof require&&require,c=0;c<g.length;c++)a(g[c]);return a}return b})()({1:[function(a,b){(function(){"use strict";b.exports=function(a,b){return this.resourceServers=a,this.transmissionPort=b,this.failedRequestQueue=this.failedRequestQueue||{},this},b.exports.prototype={renewTokens:function renewTokens(a){this.transmissionPort.postMessage({message:"renewTokens",resourceServer:a})},getResourceServerFromUrl:function getResourceServerFromUrl(a){return this.resourceServers.filter(function(b){return 0===a.indexOf(b)})[0]},waitForRenewedToken:function waitForRenewedToken(a){var b=this;return new Promise(function(c,d){b.failedRequestQueue[a]||(b.failedRequestQueue[a]=[]),b.failedRequestQueue[a].push([c,d])})},retryFailedRequests:function retryFailedRequests(a){if(this.failedRequestQueue&&this.failedRequestQueue[a])for(var b=this.failedRequestQueue[a].shift();b;)b[0](),b=this.failedRequestQueue[a].shift()},sendRequestMessage:function sendRequestMessage(a){var b=this;return new Promise(function(c,d){var e=new MessageChannel;b.transmissionPort.postMessage({message:"makeRSRequest",request:a},[e.port2]),e.port1.onmessage=function(a){a.data.response?b.deserializeResponse(a.data.response).then(c):d(a.data.error)}})},interceptRequest:function interceptRequest(a,b){var c=this;return new Promise(function(d,e){return c.serializeRequest(a).then(function(a){return c.sendRequestMessage(a).then(d,function(f){"invalid_token"===f?(c.waitForRenewedToken(b).then(function(){return c.sendRequestMessage(a)}).then(d,e),c.renewTokens(b)):e(f)})})})},serializeRequest:function serializeRequest(){},deserializeResponse:function deserializeResponse(){}}})()},{}],2:[function(a,b){(function(){"use strict";var c=a("./IdentityProxyCore"),d=function(){return c.apply(this,arguments)};d.prototype=Object.create(c.prototype),d.prototype.serializeHeaders=function(a){var b={},c=!0,d=!1,e=void 0;try{for(var f,g,h=a.keys()[Symbol.iterator]();!(c=(f=h.next()).done);c=!0)g=f.value,b[g]=a.get(g)}catch(a){d=!0,e=a}finally{try{c||null==h.return||h.return()}finally{if(d)throw e}}return b},d.prototype.serializeRequest=function(a){var b=this;return new Promise(function(c){a.clone().text().then(function(d){return c({url:a.url,options:{method:a.method,headers:b.serializeHeaders(a.headers),body:-1===["GET","HEAD"].indexOf(a.method.toUpperCase())&&d.length?d:void 0,mode:a.mode,credentials:a.credentials,cache:a.cache,redirect:a.redirect,referrer:a.referrer,integrity:a.integrity}})})})},d.prototype.deserializeResponse=function(a){return Promise.resolve(new Response(a.body,a.init))},b.exports=d})()},{"./IdentityProxyCore":1}],3:[function(a){(function(){"use strict";var b=a("./IdentityProxyServiceWorker");self.addEventListener("install",function(a){a.waitUntil(self.skipWaiting())}),self.addEventListener("activate",function(a){a.waitUntil(self.clients.claim())}),self.addEventListener("message",function(a){"configuration"===a.data.message?(self.identityProxy=new b(a.data.resourceServers,a.ports[0]),a.waitUntil(self.clients.claim().then(function(){return a.ports[0].postMessage({message:"configured"})}))):"tokensRenewed"===a.data.message&&self.identityProxy.retryFailedRequests(a.data.resourceServer)}),self.addEventListener("fetch",function(a){if(self.identityProxy){var b=self.identityProxy.getResourceServerFromUrl(a.request.url);b&&!a.request.headers.get("authorization")&&a.respondWith(self.identityProxy.interceptRequest(a.request,b))}})})()},{"./IdentityProxyServiceWorker":2}]},{},[3]);
