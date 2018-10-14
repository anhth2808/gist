
109.2007077, 12.2704601
// static
https://api.mapbox.com/v4/mapbox.dark/-76.9,38.9,5/400x200.png?access_token=pk.eyJ1IjoidHJhZWg5OCIsImEiOiJjam1ldG02aWwxa2lkM2xueTZwbTZrcnV0In0.yq2V65aPuv5-ufol-3SC5w
heroku logs --tail


Mapbox note
    Adjust a layer's opacity
    Animate a line // vẽ đường
    Change building color based on zoom
    Animate a point
    display and style rich text labels // dùng để hiển thị cả tiếng anh và tiếng bản địa
    Add a geoJson line
    Center on symbol
    fly to a location
    fit a map to a bounding box
    locate the user  // cho biết vị trí hiện tại
    mapbox-gl-directions https://www.mapbox.com/mapbox-gl-js/example/mapbox-gl-directions/

// note
layout cần 1 nút refresh -> làm mới lại postion
    Tạo 1 cái chờ vài giây cho refresh
    Nâng cao: dùng socketio auto làm mới lại vị trí hiện tại (bỏ nút refresh)
location-info tạo nút reload lại vị trí bản thân.

Facilities
    item: {
        "name": "",
        "img": "",
        "price": "",
    }