import * as Http from "http";
import * as url from "url";

export namespace P_3_2Server {
    console.log("Starting server"); // Konsolenausgabe
    let port: number = Number(process.env.PORT); // Holt aktuellen Port
    if (!port)
        port = 8100; // Wenn kein Port, Port = 8100

    let server: Http.Server = Http.createServer(); // Erstellt neuen HTTPServer
    server.addListener("request", handleRequest); // Fuegt Listener hinzu
    server.addListener("listening", handleListen);
    server.listen(port); // Horcht auf definierten Port

    function handleListen(): void {
        console.log("Listening");
    }


    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
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
        } else if (actUrl.pathname == "/json") {
            _response.setHeader("content-type", "application/json"); // Antwort als JSON
            _response.write(JSON.stringify(query));
        } else {
            _response.write("please open /html or /json");
        }

        _response.end(); // Antwort abschliessen
    }
}
