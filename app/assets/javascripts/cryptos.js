$(document).ready(function() {

const wss = new WebSocket('wss://api.bitfinex.com/ws/')

const btcRequest = {
  event: 'subscribe', 
  channel: 'ticker', 
  symbol: 'tBTCUSD' 
}

const ethRequest = {
  event: 'subscribe', 
  channel: 'ticker', 
  symbol: 'tETHUSD' 
}

const bchRequest = {
  event: 'subscribe', 
  channel: 'ticker', 
  symbol: 'tBCHUSD' 
}

const xrpRequest = {
  event: 'subscribe', 
  channel: 'ticker', 
  symbol: 'tXRPUSD' 
}


const ltcRequest = {
  event: 'subscribe', 
  channel: 'ticker', 
  symbol: 'tLTCUSD' 
}

const dashRequest = {
  event: 'subscribe', 
  channel: 'ticker', 
  symbol: 'tDASHUSD' 
}

const iotaRequest = {
  event: 'subscribe', 
  channel: 'ticker', 
  symbol: 'tIOTAUSD' 
}


const pingTest = {
  event:"ping",
   cid: 1234
}

wss.onopen = () => {
  wss.send(JSON.stringify(btcRequest));
  wss.send(JSON.stringify(ethRequest));
  wss.send(JSON.stringify(bchRequest));
  wss.send(JSON.stringify(ltcRequest));
  wss.send(JSON.stringify(xrpRequest));
}

var btcId = 0;
var ethId = 0;
var bchId = 0;
var ltcId = 0;
var xrpId = 0;

var btcPrice = document.getElementById("btcPrice");
var ethPrice = document.getElementById("ethPrice");
var bchPrice = document.getElementById("bchPrice");
var ltcPrice = document.getElementById("ltcPrice");
var xrpPrice = document.getElementById("xrpPrice");

wss.onmessage = function(response) {
    var jsonResponse = JSON.parse(response.data);
    var chanId = "";
    var pair = "";

    if (jsonResponse['event'] === "subscribed") {
      chanId = jsonResponse['chanId'];
      pair = jsonResponse['pair'];

      if (pair === "BTCUSD") {
        btcId = chanId;
      }
      else if (pair === "ETHUSD") {
        ethId = chanId;
      }
      else  if (pair === "BCHUSD") {
        bchId = chanId;
      }
      else if (pair === "LTCUSD") {
        ltcId = chanId;
      }
      else  if (pair === "XRPUSD") {
        xrpId = chanId;
      }
      else  {
        ;
      }
    }

    if (jsonResponse[0] == btcId) {
      if (typeof jsonResponse[7] != 'undefined') {
        btcPrice.innerText = jsonResponse[7];
      }
    }
    else if (jsonResponse[0] == ethId) {
      if (typeof jsonResponse[7] != 'undefined') {
        ethPrice.innerText = jsonResponse[7];
      }
    }
    else if (jsonResponse[0] == bchId) {
      if (typeof jsonResponse[7] != 'undefined') {
        bchPrice.innerText = jsonResponse[7];
      }
    }
    else if (jsonResponse[0] == ltcId) {
      if (typeof jsonResponse[7] != 'undefined') {
        ltcPrice.innerText = jsonResponse[7];
      }
    }
    else if (jsonResponse[0] == xrpId) {
      if (typeof jsonResponse[7] != 'undefined') {
        xrpPrice.innerText = jsonResponse[7];
      }
    }
}

});