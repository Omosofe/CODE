var express = require('express');
var User		= require('../app/models/user');
var Account = require('../app/models/account');

module.exports = function(app, passport) {


	// =============================================================================
	// AUTHENTICATED (Routes that are authenticated
	// (user should be signed in for routes to be accessible)) ===
	// =============================================================================

	// =============================================



	// PRE-PROFILE SECTION =========================
	// ADDITIONAL INFO FORM PAGE
	app.get('/userinfo', isLoggedIn, function(req, res) {
		res.render('user/personal-info', {user: req.user, title: 'user-info | sch00l'});
	});
	// =============================================================================
	// SAVING USER ACCOUNT DETAILS
	app.post('/userinfo', function(req, res, next) {
		var	user	= req.user;
		var full_name  = req.body.full_name;
		var user_name = req.body.user_name;
		var phone_number = req.body.phone_number;
		var address 	= req.body.address;
		var state = req.body.state;

		var account = new Account();
		account.user	= req.user;
		account.student_info.full_name  = full_name;
		account.student_info.user_name = user_name;
		account.student_info.phone_number = phone_number;
		account.student_info.address = address;
		account.student_info.referrer_state = state;
		account.save(function(err, savedAccount) {
			if(err) {
				console.log(err);
			} else {
			console.log('User account details successfully added');
			res.redirect('/home');
			}
		});
	});
	// END OF ADDITIONAL USER DETAILS



	// =============================================================================
	app.get('/home', isLoggedIn, function (req, res, next) {
		var account = Account({user: req.user});
		Account.findOne({user: req.user}, function(err, account) {
			if (err) {
				res.send(500);
				return;
			}
			console.log(account)
			res.render('user/home', {user: req.user, title: 'sch00l', account: account});
		});
	});
	// =============================================================================


	// =============================================================================
	// === USER SUPPORT ROUTE (FIRST LOGIN) ========================================
	// =============================================================================
	app.get('/support', isLoggedIn, function (req, res, next) {
		var account = Account({user: req.user});
		Account.findOne({user: req.user}, function(err, account) {
			if (err) {
				res.send(500);
				return;
			}
			console.log(account.student_info)
			res.render('user/support', {user: req.user, title: 'Support | sch00l', account: account});
		});
	});
	// =============================================================================
	app.post('/support', isLoggedIn, function(req, res, next) {
		Account.findOne({_id: req.params.account._id}).exec()
		.then(function(doc) {
			doc.student_info.full_name  = req.body.full_name || doc.student_info.full_name;
			doc.student_info.user_name = req.body.user_name || doc.student_info.user_name;
			doc.student_info.phone_number = req.body.phone_number || doc.student_info.phone_number;
			doc.student_info.address = req.body.address || doc.student_info.address;
			doc.student_info.state = req.body.state || doc.student_info.state;

			// chat
			doc.chat.question  = req.body.question || doc.chat.question;
			doc.chat.issue  = req.body.issue || doc.chat.issue;
			doc.chat.suggestion  = req.body.suggestion || doc.chat.suggestion;
			doc.chat.outbox  = req.body.outbox || doc.chat.outbox;
			doc.chat.inbox  = req.body.inbox || doc.chat.inbox;
			doc.chat.chat_time  = req.body.chat_time || doc.chat.chat_time;
			return doc.save();
		})
		.then(function() {
			// Save successful! Now redirect
			res.redirect('/home');
		})
		.catch(function(err) {
			// There was an error either finding the document or saving it.
			console.log(err);
		});
	});
	// =============================================================================



	// =============================================================================
	// WORK IN PROGRESS (This is where experimental code and features are being
	// tested)
	// =============================================================================
	app.get('/test', isLoggedIn, function(req, res) {
		res.render('user/test');
	});


	// KNOWLEDGE-BASE OF ALL THINGS DUFFLEBUG.
	app.get('/doc', isLoggedIn, function(req, res) {
		res.render('user/doc');
	});
	// END OF TEST ROUTES
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// =============================================================================


	// =============================================================================
	// UN-AUTHENTICATED (for all) ==================================================
	// =============================================================================
	// route middleware to ensure user is not logged in
	// app.use('/', notLoggedIn, function(req, res, next) {
	// 	next();
	// });

	// LOGOUT ==============================
	app.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});



	// =============================================================================
	// AUTHENTICATE (FIRST LOGIN) ==================================================
	// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the signin form
		app.get('/signin', function(req, res) {
			res.render('user/signin', {title: 'Signin | sch00l', message: req.flash('message')});
		});

		app.post('/signin', passport.authenticate('local-login', {
			successRedirect : '/home', 
			failureRedirect : '/login', 
			failureFlash : true // allow flash messages
		}));
	// =============================================================================
	// AUTHENTICATE (SIGNUP) =======================================================
	// =============================================================================
		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('user/signup', {title: 'Signup | sch00l', message: req.flash('message')});
		});

		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/userinfo', 
			failureRedirect : '/signup', 
			failureFlash : true // allow flash messages
		}));

};

	// route middleware to ensure user is logged in
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		//req.session.oldUrl = req.url; L
		res.redirect('/');
	}
