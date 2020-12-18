"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P_3_2Server = void 0;
const Http = require("http");
const url = require("url");
var P_3_2Server;
(function (P_3_2Server) {
    console.log("Starting server"); // Konsolenausgabe
    let port = Number(process.env.PORT); // Holt aktuellen Port
    if (!port)
        port = 8100; // Wenn kein Port, Port = 8100
    let server = Http.createServer(); // Erstellt neuen HTTPServer
    server.addListener("request", handleRequest); // Fuegt Listener hinzu
    server.addListener("listening", handleListen);
    server.listen(port); // Horcht auf definierten Port
    function handleListen() {
        console.log("Listening");
    }
    function handleRequest(_request, _response) {
        console.log("I hear voices!"); // Konsolenausgabe
        console.log(_request.url); // URL auf Konsole ausgeben
        _response.setHeader("Access-Control-Allow-Origin", "*");
        //_response.write(_request.url + "<br/>"); // Antwort URL ausgeben
        let actUrl = url.parse(_request.url, true);
        let query = actUrl.query;
        if (actUrl.pathname == "/html") {
            _response.setHeader("content-type", "text/html; charset=utf-8"); // Antwort als Text
            for (let key in query) {
                console.log(key + ":" + query[key]);
                _response.write(key + ":" + query[key] + "<br/>");
            }
        }
        else if (actUrl.pathname == "/json") {
            _response.setHeader("content-type", "application/json"); // Antwort als JSON
            _response.write(JSON.stringify(query));
        }
        else {
            _response.write("please open /html or /json");
        }
        _response.end(); // Antwort abschliessen
    }
})(P_3_2Server = exports.P_3_2Server || (exports.P_3_2Server = {}));
//# sourceMappingURL=bspServer.js.map