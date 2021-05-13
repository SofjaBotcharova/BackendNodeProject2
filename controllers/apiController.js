var config = require("../config");
var pgp = require("pg-promise")();
var db = pgp(config.getDbConnectionString());
module.exports = function (app) {
    app.get("/api/rooms", function (req, res) {
        db.any("SELECT DISTINCT room FROM controller_sensor")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can’t find any room",
                    error: err,
                });
            });
    });
    app.get("/api/room/:number/sensors", function (req, res) {
        db.any(
            "SELECT sensor.sensorname FROM sensor INNER JOIN controller_sensor ON controller_sensor.id_sensor=sensor.id " +
            "WHERE controller_sensor.room=" + req.params.number + ":: varchar"
        )
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });
    app.get("/api/controllers", function (req, res) {
        db.any("SELECT DISTINCT controllername FROM controller")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });
    app.get("/api/controller/sensors", function (req, res) {
        db.any(
            "SELECT DISTINCT controller.controllername, sensor.sensorname FROM controller, sensor, controller_sensor WHERE controller_sensor.id_sensor = sensor.id AND controller_sensor.id_controller = controller.id"
        )
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });
    app.get("/api/room/44/data", function (req, res) {
        db.any(
            "SELECT controller_sensor.room, datasensor.data, datasensor.date_time, sensor.sensorname FROM datasensor, controller_sensor, sensor WHERE datasensor.id_controllersensor = controller_sensor.id AND sensor.id = controller_sensor.id_sensor AND datasensor.date_time >= CURRENT_DATE AND controller_sensor.room = 44 ::varchar"
        )
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });
    app.get('/public', function(req, res) {
        res.set('Access-Control-Allow-Origin', '*')
        res.send('Hello')
    });
};