/* GET 'about us' page */
module.exports.about = function(req, res) {
    res.render('generic-text', {
        title: 'Giới thiệu về GIST',
        content: "Đồ án GIS ..............abc xyz........"
    });
};

module.exports.index = function(req, res) {
    res.render("index", {});
}