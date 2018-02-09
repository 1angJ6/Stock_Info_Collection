var express = require('express');
var request = require('request');
var xml2js = require('xml2js');
var moment = require('moment');
var moment_tz = require('moment-timezone');
var router = express.Router();
var parseString = xml2js.parseString;

router.get('/test', function (req, res, next) {
    var result = {}
    result['time'] = Date();
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
});

router.get('/', function (req, res, next) {
    var hint = `
        API system is working...<br>
        <hr>
        1. Auto complete symbol<br>
        &nbsp;&nbsp;&nbsp;&nbsp;E.g. <a href='/api/symbols/A'>/api/symbols/A</a><br>
        2. price and volume<br>
        &nbsp;&nbsp;&nbsp;&nbsp;E.g. <a href='/api/time_series_daily/AAPL'>/api/time_series_daily/AAPL</a><br>
        3. Indicator<br>
        &nbsp;&nbsp;&nbsp;&nbsp;E.g. <a href='/api/indicator/SMA/AAPL'>/api/indicator/SMA/AAPL</a><br>
        4. News<br>
        &nbsp;&nbsp;&nbsp;&nbsp;E.g. <a href='/api/news/AAPL/amount/5'>/api/news/AAPL/amount/5</a><br>
    `;
    res.send(hint);
});

router.get('/symbols/:symbol', function(req, res, next) {
    var symbol = req.params.symbol;
    var url = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=" 
        + symbol;

    request(url, function (err, response, body) {
        if (err || response.statusCode !== 200) {
            return res.sendStatus(500);
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
        });

});

router.get('/symbols/', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send("[]");

});

router.get('/stock_details/:symbol', function (req, res, next) {
    var symbol = req.params.symbol;
    var url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" 
        + symbol + "&outputsize=full&apikey=PMRKGSBXSPMEQV9A";

    request(url, function (err, response, body) {
        if (err || response.statusCode !== 200) {
        //   return res.sendStatus(500);
            res.setHeader('Content-Type', 'application/json');
            res.send({"error": "alphavantage api is down..."});
        }
        try {
            var jsonObj = JSON.parse(body);
            var result = {}
            var lastTwoKey = Object.keys(jsonObj["Time Series (Daily)"]).slice(0,2);
            result["stockTickerSymbol"] = jsonObj["Meta Data"]["2. Symbol"];
            result["lastPrice"] = parseFloat(jsonObj["Time Series (Daily)"][lastTwoKey[0]]["4. close"]).toFixed(2);
            result["previousClose"] = parseFloat(jsonObj["Time Series (Daily)"][lastTwoKey[1]]["4. close"]).toFixed(2)
            result["change"] = parseFloat(result["lastPrice"] - result["previousClose"]).toFixed(2);
            result["changePercent"] = (parseFloat(result["change"] / result["lastPrice"]) * 100).toFixed(2);

            var today = lastTwoKey[0] + "T16:00:00-05:00";
            if(moment_tz().tz("America/New_York").isBefore(moment(today))) {
                result["timeStamp"] = moment_tz().tz("America/New_York").format('YYYY-MM-DD HH:mm:ss z');
            }
            else {
                result["timeStamp"] = moment_tz(today).tz("America/New_York").format('YYYY-MM-DD HH:mm:ss z');
            }
            result["open"] = parseFloat(jsonObj["Time Series (Daily)"][lastTwoKey[0]]["1. open"]).toFixed(2);
            result["close"] = parseFloat(jsonObj["Time Series (Daily)"][lastTwoKey[0]]["4. close"]).toFixed(2);
            result["high"] = parseFloat(jsonObj["Time Series (Daily)"][lastTwoKey[0]]["2. high"]).toFixed(2);
            result["low"] = parseFloat(jsonObj["Time Series (Daily)"][lastTwoKey[0]]["3. low"]).toFixed(2);
            result["volume"] = parseFloat(jsonObj["Time Series (Daily)"][lastTwoKey[0]]["5. volume"]).toLocaleString('en');
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        }
        catch(e) {
            res.setHeader('Content-Type', 'application/json');
            res.send({"error": e});
        }
    });
});

router.get('/time_series_daily/:symbol', function (req, res, next) {
    var symbol = req.params.symbol;
    var url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" 
        + symbol + "&outputsize=full&apikey=PMRKGSBXSPMEQV9A";

    request(url, function (err, response, body) {
        if (err || response.statusCode !== 200) {
            res.setHeader('Content-Type', 'application/json');
            res.send({"error": "alphavantage api is down..."});
        }

        try {
            var jsonObj = JSON.parse(body);
            var history = jsonObj["Time Series (Daily)"];
            var date = Object.keys(history);
            var close = [];
            var volume = [];
            var td = new Date(date[0]);
            for(var i = 0; i < date.length; i++) {
                var dd = new Date(date[i]);
                if(parseInt((td-dd)/1000/3600/24/30) < 6) {
                    close.push(parseFloat( history[date[i]]["4. close"] ));
                    volume.push(parseFloat( history[date[i]]["5. volume"] ));
                }
                else {
                    date = date.slice(0, i);
                    break;
                }
                date[i] = date[i].substring(5);
            }
            let result = {}
            result["close"] = close.reverse();
            result["volume"] = volume.reverse();
            result["date"] = date.reverse();
    
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        } catch(e) {
            res.setHeader('Content-Type', 'application/json');
            res.send({"error": e});
        }
        
    });
});

router.get('/indicator/:indicator/:symbol/', function (req, res, next) {
    var symbol = req.params.symbol;
    var indicator = req.params.indicator;
    var url = "";
    switch (indicator) {
        case "SMA":
            url = "https://www.alphavantage.co/query?function=SMA&symbol="
                +symbol+"&interval=daily&time_period=10&series_type=close&apikey=PMRKGSBXSPMEQV9A";
            break;
        case "EMA":
            url = "https://www.alphavantage.co/query?function=EMA&symbol="
                +symbol+"&interval=daily&time_period=10&series_type=close&apikey=PMRKGSBXSPMEQV9A";
            break;
        case "STOCH": 
            url = "https://www.alphavantage.co/query?function=STOCH&symbol="
                +symbol+"&interval=daily&slowkmatype=1&slowdmatype=1&apikey=PMRKGSBXSPMEQV9A";
            break;
        case "RSI": 
            url = "https://www.alphavantage.co/query?function=RSI&symbol="
                +symbol+"&interval=daily&time_period=10&series_type=close&apikey=PMRKGSBXSPMEQV9A";
            break;
        case "ADX": 
            url = "https://www.alphavantage.co/query?function=ADX&symbol="
                +symbol+"&interval=daily&time_period=10&apikey=PMRKGSBXSPMEQV9A";
            break;
        case "CCI": 
            url = "https://www.alphavantage.co/query?function=CCI&symbol="
                +symbol+"&interval=daily&time_period=10&apikey=PMRKGSBXSPMEQV9A";
            break;
        case "BBANDS": 
            url = "https://www.alphavantage.co/query?function=BBANDS&symbol="
                +symbol+"&interval=daily&time_period=5&series_type=close&nbdevup=3&nbdevdn=3&apikey=PMRKGSBXSPMEQV9A";
            break;
        case "MACD": 
            url = "https://www.alphavantage.co/query?function=MACD&symbol="
                +symbol+"&interval=daily&series_type=close&fastperiod=10&apikey=PMRKGSBXSPMEQV9A";
            break;
    }
    request(url, function (err, response, body) {
        if (err || response.statusCode !== 200) {
            res.setHeader('Content-Type', 'application/json');
            res.send({"error": "alphavantage api is down..."});
        }

        try {
            var jsonObj = JSON.parse(body);
            var dataset = jsonObj["Technical Analysis: "+indicator];
            var date = Object.keys(dataset);
            var data = {};
            var idxset = [];
            for(var key in dataset[date[0]]) {
                data[key] = [];
                idxset.push(key);
            }
            var td = new Date(date[0]);
            for(var i = 0; i < date.length; i++) {
                var dd = new Date(date[i]);
                if(parseInt((td-dd)/1000/3600/24/30) < 6) {
                    for(var j = 0; j < idxset.length; j++) {
                        data[idxset[j]].push(parseFloat(dataset[date[i]][idxset[j]]));
                    }
                }
                else {
                    date = date.slice(0, i);
                    break;
                }
                date[i] = date[i].substring(5);
            }
            var result = {};
            for(var i = 0; i < idxset.length; i++) {
                data[idxset[i]].reverse();
            }
            result["data"] = data;
            result["date"] = date.reverse();
            result["idxset"] = idxset;
    
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        }
        catch(e) {
            res.setHeader('Content-Type', 'application/json');
            res.send({"error": e});
        }
        
    });
});

router.get('/history/:symbol', function (req, res, next) {
    var symbol = req.params.symbol;
    var url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" 
        + symbol + "&outputsize=full&apikey=PMRKGSBXSPMEQV9A";

        request(url, function (err, response, body) {
            if (err || response.statusCode !== 200) {
                res.setHeader('Content-Type', 'application/json');
                res.send({"error": "alphavantage api is down..."});
            }

            try {
                var jsonObj = JSON.parse(body);
                var history = jsonObj["Time Series (Daily)"];
                var date = Object.keys(history);
                let result = []
                for(var i = 0; i < date.length; i++) {
                    result.push([moment(date[i],'YYYY-MM-DD').unix()*1000, parseFloat(history[date[i]]["4. close"])]);
                }
    
                res.setHeader('Content-Type', 'application/json');
                res.send(result.reverse());
            }
            catch(e) {
                res.setHeader('Content-Type', 'application/json');
                res.send({"error":e});
            }
            
        });
});

router.get('/news/:symbol/amount/:amount/', function (req, res, next) {
    var symbol = req.params.symbol;
    var amount = parseInt(req.params.amount);
    var url = "https://seekingalpha.com/api/sa/combined/" + symbol + ".xml";
    request(url, function(err, response, body) {
        if (err || response.statusCode !== 200) {
            res.setHeader('Content-Type', 'application/json');
            res.send({"error": "no news"});
        }
        else {
            parseString(body, function (err, result) {
                var news = [];
                var count = 0;
                const regex = /article/;
                var items = result['rss']['channel']['0']['item']
                for (var i = 0; i < items.length; i++) {
                    if (items[i]['link'][0].match(regex)) {
                        var item = {};
                        item['title'] = items[i]['title'][0];
                        item['link'] = items[i]['link'][0];
                        item['pubDate'] = 
                            moment_tz(items[i]['pubDate'][0]).
                            tz("America/New_York").
                            format('ddd, DD MMM YYYY HH:mm:ss z');
                        item['author'] = items[i]['sa:author_name'][0];
                        news.push(item);
                        count += 1;
                    }
                    if (count == amount) {
                        break;
                    }
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(news);
            });
        }
    });
});

router.post('/highchart', function (req, res) {
    var exportUrl = 'http://export.highcharts.com/';
    var chart = {
        options: req.body,
        filename: 'chart',
        type: 'image/png',
        async: true
    };
    request.post({url:exportUrl,body:chart,json:true}, function(err, response, body) {
        if(err) {
            // response.send({'error': 'No such chart'});
        } else {
            res.end(exportUrl+body);
        }
    });
});

module.exports = router;