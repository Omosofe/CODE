//
module.exports = function(app, passport) {



// normal routes ===============================================================
// route middleware to ensure user is not logged in
	// app.use('/', notLoggedIn, function(req, res, next) {
	// 	next();
	// });

	app.get('/', function(req, res) {
		res.render('index');
	});


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

// route middleware to ensure user is logged in
// function notLoggedIn(req, res, next) {
// 	if (!req.isAuthenticated())
// 		return next();
//
// 	res.redirect('/');
// }

// closing curly brace fpr module.exports
};
