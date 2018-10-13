var request = require('request');
var mongoose = require("mongoose");
var Loc = mongoose.model("Location");

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

var apiOptions = {
    server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "https://gist1.herokuapp.com";
}


var _showError = function (req, res, status) {
    var title, content;
    if (status === 404) {
        title = "404, page not found";
        content = "Oh dear. Looks like we can't find this page. Sorry.";
    } else if (status === 500) {
        title = "500, internal server error";
        content = "How embarrassing. There's a problem with our server.";
    } else {
        title = status + ", something's gone wrong";
        content = "Something, somewhere, has gone just a little bit wrong.";
    }
    res.status(status);
    res.render('generic-text', {
        title : title,
        content : content
    });
};




var renderHomepage = function(req, res){
    res.render('locations-list', {
        title: 'GIST - tìm một tiệm caffe có wifi gần bạn!',
        pageHeader: {
            title: 'GIST',
            strapline: 'Tìm một tiệm caffe có wifi gần bạn!'
        },
        sidebar: "Bạn muốn một chỗ ngồi với wifi? Với GIS bạn có thể tìm một tiệm cafe gần bạn.",
    });
};

/* GET 'home' page */
module.exports.homelist = function(req, res){
    renderHomepage(req, res);
};

var getLocationInfo = function (req, res, callback) {
    var requestOptions, path;

    path = "/api/locations/" + req.params.locationid;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            var data = body;
            if (response.statusCode === 200) {
                data.coords = {
                    lng: body.coords[0],
                    lat: body.coords[1]
                };
                callback(req, res, data);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

var renderDetailPage = function (req, res, locDetail) {
    res.render('location-info', {
        title: locDetail.name,
        pageHeader: {title: locDetail.name},
        sidebar: {
            context: "Nếu như bạn thích hoặc không thích " + locDetail.name + ", đừng quên để lại review.",
            callToAction: "Bạn có thể tham khảo bản đồ chỉ đường của GIST."
        },
        location: locDetail
    });
};

/* GET 'Location info' page */
module.exports.locationInfo = function(req, res){
    getLocationInfo(req, res, function(req, res, responseData) {
        renderDetailPage(req, res, responseData);
    });
};

var renderReviewForm = function (req, res, locDetail) {
    res.render('location-review-form', {
        title: 'Review ' + locDetail.name + ' on Loc8r',
        pageHeader: { title: 'Review ' + locDetail.name },
        error: req.query.err
    });
};

/* GET 'Add review' page */
module.exports.addReview = function(req, res){
    getLocationInfo(req, res, function(req, res, responseData) {
        renderReviewForm(req, res, responseData);
    });
};

/* POST 'Add review' page */
module.exports.doAddReview = function(req, res){
    var requestOptions, path, locationid, postdata;
    locationid = req.params.locationid;
    path = "/api/locations/" + locationid + '/reviews';
    postdata = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json : postdata
    };
    if (!postdata.author || !postdata.rating || !postdata.reviewText) {
        res.redirect('/location/' + locationid + '/reviews/new?err=val');
    } else {
        request(
            requestOptions,
            function(err, response, body) {
                if (response.statusCode === 201) {
                    res.redirect('/location/' + locationid);
                } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
                    res.redirect('/location/' + locationid + '/reviews/new?err=val');
                } else {
                    console.log(body);
                    _showError(req, res, response.statusCode);
                }
            }
        );
    }
};