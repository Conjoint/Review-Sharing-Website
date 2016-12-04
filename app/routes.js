module.exports = function(app, passport) {
    var Yelp = require("yelp");
    var configAuth = require('../config/auth');
    var yelp = new Yelp(configAuth.yelp);
    var reviews = require('../app/models/review');
    

    // normal routes ===============================================================
    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // FIND RESTAURANT SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('res_view.ejs', {
            user: req.user
        });
    });

    // PLAN TRIP SECTION =========================
    app.get('/trip', isLoggedIn, function(req, res) {
        res.render('trip.ejs', {
            user: req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // LOGIN ===============================
    // show the login form
    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', {
            message: req.flash('loginMessage')
        });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.get('/find', function(req, res) {
       // var y = req.body.category;
        //console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
        //console.log(req.body.category);
        console.log("Latitude = " + req.query.latitude);
        console.log("Longitude = " + req.query.longitude);

        var swLat = parseFloat(req.query.latitude) - 0.0075;
        var swLong = parseFloat(req.query.longitude) - 0.0075;
        var neLat = parseFloat(req.query.latitude) + 0.0075;
        var neLong = parseFloat(req.query.longitude) + 0.0075;

        yelp.search({
            term: ww,
            //bounds: swLat + "," + swLong + "|" + neLat + "," + neLong
            location: city
        })
            .then(function(data) {
                res.json(data);
                console.log("check here..........");
                console.log(data);
            })
            .catch(function(err) {
                console.log(err);
            });
            //console.log(req.query.category);
            //console.log("revengee");
    });

   

    app.post('/saveListToDb', function(req, res) {
        var plan = new hangouts({
            user: req.body.user,
            plans: req.body.hangoutList
        });
        plan.save(function(err, plan) {
            if (err) {
                return console.log(err);
            }
            console.log("Plan Saved");
            res.json(plan);
        });
    });

    app.post('/review', function(req, res) {
        var tempReview = new reviews({
            restaurant: req.body.restaurant,
            rating: req.body.rating,
            written: req.body.written,
            restaurantID: req.body.restaurantID,
            date: req.body.date,
            user: req.body.user,
            image: req.body.image
        });
        console.log(tempReview);

        tempReview.save(function(err, tempReview) {
            if (err) {
                return console.log(err);
            }
            console.log("Review Successfully Saved!");
            res.json(tempReview);
        });
    });


     app.post('/try', function(req, res) {
       
           
            var ww =  req.body.category;
            global.ww = req.body.category;
          
       
        console.log(ww);

        
    });


 app.post('/try2', function(req, res) {
       //console.log("YEEEE");
           
            var city =  req.body.txtPlaces;
            global.city = req.body.txtPlaces;
          
       
        console.log(city);

        
    });


    app.get('/review', function(req, res) {
        reviews.find({
          
          restaurant: req.query.restaurant
          // date: req.query.date
           
        }, function(err, obj) {
            if (err) {
                res.json({
                    "status": "not found"
                });
            } else {
                res.json(obj);
                console.log(obj);
            }
        });
    });




};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}



