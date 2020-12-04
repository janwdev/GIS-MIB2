import * as Http from "http";

export namespace P_3_1Server {
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
        _response.setHeader("content-type", "text/html; charset=utf-8"); // Antwort als HTML
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.write(_request.url); // Antwort URL ausgeben
        console.log(_request.url); // URL auf Konsole ausgeben
        _response.end(); // Antwort abschliessen
    }
}
