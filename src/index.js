//Loading Library
const Log4js = require("log4js");
const express = require("express");
const {json} = require("express");
const crypto = require("crypto");
const fs = require("fs")

//logger
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

//Server Configuration
const portNumber = 3300;

//Variable
let request_count = 0
let jsonKey
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

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
    logger.info(`REQUEST START
                            QUERY:  mode ${req.query.mode} 
                            METHOD: ${req.method}
                            PROTOCOL:${req.protocol}
                            HEADER: ${JSON.stringify(req.headers)}
                            Body: ${JSON.stringify(req.body)}
                            END`)
    try{
        switch (String(req.query.mode)) {
            case "external":
                res.json({id: req.body["id"], data: {APIresponse: crypto.randomUUID()}});
                break;
            case "json":
                if (req.body["id"] == undefined || req.body["id"] == "") {
                    logger.warn("RequestID is Empty,Bad Request")
                    res.status(400).send("RequestID is Empty")
                }
                if (data[req.body["id"]] == undefined) {
                    logger.warn("No JSON data matched the RequestID, Bad Request")
                    res.status(400).send("No JSON data matched the RequestID")}
                res.json(data[req.body["id"]]);
                break;
            default:
                logger.warn("Not matched Query mode, Bad Request")
                res.sendStatus(400);

        }
        logger.info(`REQUEST END`)
    }catch(e){
        logger.error(`EXCEPTION: ${e}
                            QUERY:  mode ${req.query.mode} 
                            METHOD: ${req.method}
                            PROTOCOL:${req.protocol}
                            HEADER: ${JSON.stringify(req.headers)}
                            Body: ${JSON.stringify(req.body)}
                            END`)
        res.sendStatus(500);
    }
});

app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).send(err.message);
});

app.listen(portNumber)