$(window).on("load resize ", function() {
  var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
  $('.tbl-header').css({'padding-right':scrollWidth});
}).resize();

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

const xmrRequest = {
  event: 'subscribe', 
  channel: 'ticker', 
  symbol: 'tXMRUSD' 
}

const iotaRequest = {
  event: 'subscribe', 
  channel: 'ticker', 
  symbol: 'tIOTUSD' 
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
  wss.send(JSON.stringify(xmrRequest));
  wss.send(JSON.stringify(iotaRequest));
}

var btcId = 0;
var ethId = 0;
var bchId = 0;
var ltcId = 0;
var xrpId = 0;
var xmrId = 0;
var iotaId = 0;

var btcPrice = document.getElementById("btcPrice");
var ethPrice = document.getElementById("ethPrice");
var bchPrice = document.getElementById("bchPrice");
var ltcPrice = document.getElementById("ltcPrice");
var xrpPrice = document.getElementById("xrpPrice");
var xmrPrice = document.getElementById("xmrPrice");
var iotaPrice = document.getElementById("iotaPrice");

var btcPercentChange = document.getElementById("btcPercentChange");
var ethPercentChange = document.getElementById("ethPercentChange");
var bchPercentChange = document.getElementById("bchPercentChange");
var ltcPercentChange = document.getElementById("ltcPercentChange");
var xrpPercentChange = document.getElementById("xrpPercentChange");
var xmrPercentChange = document.getElementById("xmrPercentChange");
var iotaPercentChange = document.getElementById("iotaPercentChange");

wss.onmessage = function(response) {
    console.log(response);
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
      else  if (pair === "XMRUSD") {
        xmrId = chanId;
      }
      else  if (pair === "IOTUSD") {
        iotaId = chanId;
      }
      else  {
        ;
      }
    }

    if (jsonResponse[0] == btcId) {
      if (typeof jsonResponse[7] != 'undefined') {
        btcPrice.innerText = accounting.formatMoney(jsonResponse[7]);
        btcPercentChange.innerText = (jsonResponse[6] * 100).toFixed(2) + '%';
      }
    }
    else if (jsonResponse[0] == ethId) {
      if (typeof jsonResponse[7] != 'undefined') {
        ethPrice.innerText = accounting.formatMoney(jsonResponse[7]);
        ethPercentChange.innerText = (jsonResponse[6] * 100).toFixed(2) + '%';
      }
    }
    else if (jsonResponse[0] == bchId) {
      if (typeof jsonResponse[7] != 'undefined') {
        bchPrice.innerText = accounting.formatMoney(jsonResponse[7]);
        bchPercentChange.innerText = (jsonResponse[6] * 100).toFixed(2) + '%';
      }
    }
    else if (jsonResponse[0] == ltcId) {
      if (typeof jsonResponse[7] != 'undefined') {
        ltcPrice.innerText = accounting.formatMoney(jsonResponse[7]);
        ltcPercentChange.innerText = (jsonResponse[6] * 100).toFixed(2) + '%';
      }
    }
    else if (jsonResponse[0] == xrpId) {
      if (typeof jsonResponse[7] != 'undefined') {
        xrpPrice.innerText = accounting.formatMoney(jsonResponse[7]);
        xrpPercentChange.innerText = (jsonResponse[6] * 100).toFixed(2) + '%';
      }
    }
    else if (jsonResponse[0] == xmrId) {
      if (typeof jsonResponse[7] != 'undefined') {
        xmrPrice.innerText = accounting.formatMoney(jsonResponse[7]);
        xmrPercentChange.innerText = (jsonResponse[6] * 100).toFixed(2) + '%';
      }
    }
    else if (jsonResponse[0] == iotaId) {
      if (typeof jsonResponse[7] != 'undefined') {
        iotaPrice.innerText = accounting.formatMoney(jsonResponse[7]);
        iotaPercentChange.innerText = (jsonResponse[6] * 100).toFixed(2) + '%';
      }
    }
}

});