const viewsRoute = require('./views');
const uploadRoute = require('./upload');

function initRoute(app) {
    app.use('/', viewsRoute);
    app.use('/api', uploadRoute);
}

module.exports = initRoute;
