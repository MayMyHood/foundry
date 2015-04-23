var helpers = require("./helpers");

module.exports = (function () {

    var init,
        process,
        poll,
        distance = document.getElementById("distance").innerHTML,
        sampleData = require("./sample"),
        interval,
        get;

    // users lat long
    poll = function (lat, lng, distance) {
        distance = document.getElementById("distance").innerHTML;
        interval = setInterval(function () {
            window.JSONP("http://foundry.thirdmurph.net:5000/?latlong="+lat+","+lng+"&dist=" + distance, function (data) {
                window.publish("update", [data, lat, lng, distance]);
            });
        }, 10000);
    };

    init = function (lat, lng) {
        window.publish("update", [sampleData, lat, lng]);
        window.JSONP("http://foundry.thirdmurph.net:5000/?latlong="+lat+","+lng+"&dist=" + distance, function (data) {
             window.publish("update", [data, lat, lng]);
        });
        poll(lat, lng, "5");
    };

    distance = function (data, lat, lng) {
        data.forEach(function (value, index, arr) {
            data[index].distance = helpers.distance(
                value.location[0].latitude,
                value.location[0].longitude,
                lat,
                lng,
                "K"
            );
        });
        return data;
    };

    get = function () {
        return results;
    };

    // update distance on location change
    window.subscribe('location', function (lat, lng) {
        init(lat, lng);
    });

    // update distance on location change
    // pass in users lat long
    window.subscribe('update', function (data, lat, lng) {
        console.log("data", data);
        window.publish('data', [distance(data.resultSet, lat, lng)]);
    });
}());