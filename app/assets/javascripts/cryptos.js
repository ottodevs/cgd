$(document).ready(function() {

  var currentPrice = {};
  var socket = io.connect('https://streamer.cryptocompare.com/');
  //Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
  //Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
  //For aggregate quote updates use CCCAGG as market
  var subscription = ['2~Bitfinex~BTC~USD', '2~Bitfinex~ETH~USD', '2~Bitfinex~BCH~USD',
  '2~Bitfinex~LTC~USD', '2~Bitfinex~XRP~USD', '2~Bitfinex~XMR~USD', '2~Bitfinex~DASH~USD', '2~Bitfinex~ETC~USD', '2~Coinbase~BCH~USD',
  '2~Coinbase~ETH~USD', '2~Coinbase~BTC~USD', '2~Coinbase~LTC~USD','2~Coinbase~XRP~USD',,'2~Coinbase~XMR~USD','2~Coinbase~DASH~USD','2~Coinbase~ETC~USD', '2~Bitstamp~BTC~USD',
  '2~Bitstamp~ETH~USD', '2~Bitstamp~BCH~USD', '2~Bitstamp~LTC~USD', '2~Bitstamp~XRP~USD','2~Bitstamp~XMR~USD','2~Bitstamp~DASH~USD','2~Bitstamp~ETC~USD',
  '2~Poloniex~BTC~USD', '2~Poloniex~ETH~USD', '2~Poloniex~BCH~USD','2~Poloniex~DASH~USD','2~Poloniex~ETC~USD',
  '2~Poloniex~LTC~USD', '2~Poloniex~XRP~USD', '2~Poloniex~XMR~USD' ,'2~BitTrex~BTC~USD', 
  '2~BitTrex~ETH~USD', '2~BitTrex~BCH~USD', '2~BitTrex~LTC~USD', '2~BitTrex~XRP~USD', '2~BitTrex~XMR~USD','2~BitTrex~DASH~USD','2~BitTrex~ETC~USD','2~Kraken~BTC~USD', 
  '2~Kraken~ETH~USD', '2~Kraken~BCH~USD', '2~Kraken~LTC~USD', '2~Kraken~XRP~USD', '2~Kraken~XMR~USD', '2~Kraken~DASH~USD', '2~Kraken~ETC~USD','2~HitBTC~BTC~USD', 
  '2~HitBTC~ETH~USD', '2~HitBTC~BCH~USD', '2~HitBTC~LTC~USD', '2~HitBTC~XRP~USD', '2~HitBTC~XMR~USD','2~HitBTC~DASH~USD','2~HitBTC~ETC~USD','2~Exmo~BTC~USD', 
  '2~Exmo~ETH~USD', '2~Exmo~BCH~USD', '2~Exmo~LTC~USD', '2~Exmo~XRP~USD', '2~Exmo~XMR~USD', '2~Exmo~DASH~USD', '2~Exmo~ETC~USD'];
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
    currentPrice[pair]['CHANGE24HOURPCT'] = ((currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']) / currentPrice[pair]['OPEN24HOUR'] * 100).toFixed(2) + "%";
    displayData(currentPrice[pair], from, tsym, fsym, market);
  };

  var displayData = function(current, from, tsym, fsym, market) {
    var priceDirection = current.FLAGS;
    for (var key in current) {
      if (key == 'CHANGE24HOURPCT') {
        $('#' + key + '_' + market + '_' + from).text('(' + current[key] + ')');
      }
      else if (key == 'PRICE') {
        if (from == 'XRP') {
          $('#' + key + '_' + market + '_' + from).text(accounting.formatMoney(current[key], "$", 4, ",", ".", "%s%v"));
        }
        else {
          $('#' + key + '_' + market + '_' + from).text(accounting.formatMoney(current[key]));
        }
      }
    }

    if (current['PRICE'] > current['OPEN24HOUR']) {
      $('#CHANGE24HOURPCT_' + market + '_' + from).removeClass();
      $('#CHANGE24HOURPCT_' + market + '_' + from).addClass("up");
    }
    else if (current['PRICE'] < current['OPEN24HOUR']) {
      $('#CHANGE24HOURPCT_' + market + '_' + from).removeClass();
      $('#CHANGE24HOURPCT_' + market + '_' + from).addClass("down");
    } 
  };
});