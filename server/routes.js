/**
 * Created by Jens on 26-Oct-16.
 */
module.exports = function (app) {
    //api routes
    let base = '/api/v1/';
    require('./users/user/routes')(app, base + 'users');

    //asset routes
    require('./assetRoutes')(app);

    //default routes
    require('./defaultRoutes')(app);
};