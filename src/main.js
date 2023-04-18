const Log4js = require("log4js");
const express = require("express");
const portNumber = 9000;
let request_count = 0

Log4js.configure({
    appenders: {
        out: { type: 'file',filename: 'out.log', layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss} %p %c %m'
            }}
    },
    categories: { default: { appenders: ['out'], level: 'info' } }
});

const  logger = Log4js.getLogger();
logger.level = 'all';

const app = express();
app.get("/api/get", function(req, res){
    request_count += 1
    logger.info(`${req.method} & ${request_count}REQUEST-OUT START
                            METHOD: ${req.method}
                            PROTOCOL:${req.protocol}
                            HEADER: ${JSON.stringify(req.headers)}
                            Param: ${JSON.stringify(req.query)}
                            END`)
    res.sendStatus(200);
});
app.get("/api/post", function(req, res, next) {
    request_count += 1
    logger.info(`${req.method} & ${request_count}REQUEST-OUT START
                            METHOD: ${req.method}
                            PROTOCOL:${req.protocol}
                            HEADER: ${JSON.stringify(req.headers)}
                            Body: ${JSON.stringify(req.body)}
                            END`)
    res.sendStatus(200);
});



app.listen(portNumber)