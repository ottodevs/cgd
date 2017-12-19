$(window).on("load resize ", function() {
  var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
  $('.tbl-header').css({'padding-right':scrollWidth});
}).resize();

$(document).ready(function() {

  var currentPrice = {};
  var socket = io.connect('https://streamer.cryptocompare.com/');
  //Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
  //Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
  //For aggregate quote updates use CCCAGG as market
  var subscription = ['2~Bitfinex~BTC~USD', '2~Bitfinex~ETH~USD', '2~Bitfinex~BCH~USD',
  '2~Bitfinex~LTC~USD', '2~Bitfinex~XRP~USD', '2~Bitfinex~XMR~USD',
  '2~Coinbase~ETH~USD', '2~Coinbase~BTC~USD', '2~Coinbase~LTC~USD', '2~Bitstamp~BTC~USD',
  '2~Bitstamp~ETH~USD', '2~Bitstamp~BCH~USD', '2~Bitstamp~LTC~USD', '2~XRP~ETH~USD',
  '2~Poloniex~BTC~USD', '2~Poloniex~ETH~USD', '2~Poloniex~BCH~USD',
  '2~Poloniex~LTC~USD', '2~Poloniex~XRP~USD', '2~Poloniex~XMR~USD' ,'2~BitTrex~BTC~USD', 
  '2~BitTrex~ETH~USD', '2~BitTrex~BCH~USD', '2~BitTrex~LTC~USD', '2~BitTrex~XRP~USD', '2~BitTrex~XMR~USD'];
  socket.emit('SubAdd', { subs: subscription });
  socket.on("m", function(message) {
    var messageType = message.substring(0, message.indexOf("~"));
    var res = {};
    if (messageType == CCC.STATIC.TYPE.CURRENT) {
      res = CCC.CURRENT.unpack(message);
      dataUnpack(res);
    }
  });

  var dataUnpack = function(data) {
    var from = data['FROMSYMBOL'];
    var to = data['TOSYMBOL'];
    var market = data['MARKET'];
    var fsym = CCC.STATIC.CURRENCY.getSymbol(from);
    var tsym = CCC.STATIC.CURRENCY.getSymbol(to);
    var pair = from + to;

    if (!currentPrice.hasOwnProperty(pair)) {
      currentPrice[pair] = {};
    }

    for (var key in data) {
      currentPrice[pair][key] = data[key];
    }

    if (currentPrice[pair]['LASTTRADEID']) {
      currentPrice[pair]['LASTTRADEID'] = parseInt(currentPrice[pair]['LASTTRADEID']).toFixed(0);
    }
    currentPrice[pair]['CHANGE24HOUR'] = CCC.convertValueToDisplay(tsym, (currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']));
    currentPrice[pair]['CHANGE24HOURPCT'] = ((currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']) / currentPrice[pair]['OPEN24HOUR'] * 100).toFixed(2) + "%";;
    displayData(currentPrice[pair], from, tsym, fsym, market);
  };

  var displayData = function(current, from, tsym, fsym, market) {
    console.log(current);
    var priceDirection = current.FLAGS;
    for (var key in current) {
      if (key == 'CHANGE24HOURPCT') {
        $('#' + key + '_' + market + '_' + from).text(current[key]);
      }
      else if (key == 'PRICE') {
        $('#' + key + '_' + market + '_' + from).text(accounting.formatMoney(current[key]));
      }
    }
  };
});