/* import middleware and components dependencies */
var express = require('express');
var engine = require('ejs-locals');
var bodyParser = require('body-parser');
var compress = require('compression');
var Cache = require("static-cache") //notice first letter capitalized
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var errorHandler = require('errorhandler');

var cache = new Cache({path: __dirname+"/_cache", maxAge: 1000*60*60*24}); // maxAge := one day
var utils = require('./utils');
var app = express();

/* function exported */
exports.init = function(port) {

	/* application scope variables declared here */
	app.locals._layoutFile = 'layout.ejs';
	app.locals.title = "Bootstrap Zero - Free Bootstrap Themes and Templates";
	/*desc:"Bootstrap Zero is a collection of open source, free Bootstrap themes and templates. Bootstrap designers and developers can use these free templates to kickstart responsive Web development projects.",*/
	app.locals.desc = "Bootstrap themes and templates curated in one totally free, high-quality collection. Bootstrap designers and developers can use these free templates and themes to kickstart Responsive Web Design projects.";
	app.locals.keywords = "bootstrap, themes, templates, bootstrap templates, twitter bootstrap, free, responsive, open source";
	app.locals.path = "";
	app.locals.utils = utils;

	/* If name is one of the application settings,
	 * it affects the behavior of the application.
	 */
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	
	/* plug into middleware stack */
	app.use(express.static(__dirname + '/static', { // let express host static resources 
		maxAge : 86400000
	}));
	app.use(compress());
	app.use(cache.serve);
	app.use(bodyParser());
	app.use(methodOverride());
	app.use(cookieParser());
	app.use(cookieSession({
		cookie : {
			path : '/',
			httpOnly : true,
			maxAge : null
		},
		secret : 'skeletor'
	}));

	app.engine('ejs', engine);

	if ('development' == app.get('env')) {
		app.use(errorHandler({
			dumpExceptions : true,
			showStack : true
		}));
	}

	if ('production' == app.get('env')) {
		app.use(errorHandler());
	}

	app.use(function(err, req, res, next) {
		res.render('500.ejs', {
			locals : {
				error : err
			},
			status : 500
		});
	});

	var server = app.listen(port);
	console.log("Listening on port %d in %s mode", server.address().port,
			app.settings.env);
	return app;

}