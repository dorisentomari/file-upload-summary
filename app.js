const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const morgan = require('morgan');

const connectMongoDB = require('./mongodb');
const initRoute = require('./routes');

const app = express();
const PORT = 5800;

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
    res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE')
    if (req.method === 'OPTIONS') {
        return res.end();
    }
    next();
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(express.static(path.resolve(__dirname, 'node_modules')));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

(async function () {
    await connectMongoDB();
})();

initRoute(app);

app.listen(PORT, err => {
    if (err) {
        console.log(err);
    } else {
        console.log(`server is running at http://localhost:${PORT}`);
    }
});
