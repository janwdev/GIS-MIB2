"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P_3_1Server = void 0;
const Http = require("http");
var P_3_1Server;
(function (P_3_1Server) {
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
        _response.setHeader("content-type", "text/html; charset=utf-8"); // Antwort als HTML
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.write(_request.url); // Antwort URL ausgeben
        console.log(_request.url); // URL auf Konsole ausgeben
        _response.end(); // Antwort abschliessen
    }
})(P_3_1Server = exports.P_3_1Server || (exports.P_3_1Server = {}));
//# sourceMappingURL=bspServer.js.map