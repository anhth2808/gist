/* GET 'about us' page */
module.exports.about = function(req, res) {
    res.render('generic-text', {
        title: 'Giới thiệu về GIST',
        content: "Đồ án GIS ..............abc xyz........ Khoảng cách được tính bằng bán kính từ người dùng tới địa điểm"
    });
};

module.exports.index = function(req, res) {
    res.render("index", {});
}