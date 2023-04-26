const Log4js = require("log4js");
const express = require("express");
const {json} = require("express");
const portNumber = 3300;
let request_count = 0
let jsonKey
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
app.use(express.json())


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
app.post("/api/post", async function (req, res, next) {
    request_count += 1
    jsonKey = req.query.jsonKey
    if (String(req.query.mode) == "html") {
        res.send(`<${req.query.tagName}>${req.body[jsonKey]}</${req.query.tagName}>`)
    }
    else if (String(req.query.mode) == "json") {
        res.json({ APIresponse: req.body[jsonKey] });
    }
    logger.info(`${req.method} & ${request_count}REQUEST-OUT START
                            QUERY:  mode ${req.query.mode} jsonKey: ${req.query.jsonKey}
                            METHOD: ${req.method}
                            PROTOCOL:${req.protocol}
                            HEADER: ${JSON.stringify(req.headers)}
                            Body: ${JSON.stringify(req.body)}
                            SELECTED: ${JSON.stringify(req.body[jsonKey])}
                            END`)
    //res.sendStatus(200);
});



app.listen(portNumber)