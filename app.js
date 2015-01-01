/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/index');
var http = require('http');
var path = require('path');
var settings = require('./settings');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();

// all environments
app.set('port', process.env.PORT || 2015);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/public/images/icon.png'));
app.use(express.logger('dev'));
app.use(express.json());            //json、urlencoded这两行
app.use(express.urlencoded());      // 相当于以前的app.use(express.bodyParser())
app.use(express.methodOverride());
app.use(app.router);                //调用路径解析的规则
app.use(express.static(path.join(__dirname, 'public')));    //设置根目录下的public为存放images,js,css等静态文件的文件夹
app.use(session({
    secret: settings.cookieSecret,
    key: settings.db,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    store: new MongoStore({
        db: settings.db,
        host: settings.host,
        port: settings.port
    })
}));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), function () {
    console.log('服务器已打开！本地端口为：' + app.get('port'));
});
