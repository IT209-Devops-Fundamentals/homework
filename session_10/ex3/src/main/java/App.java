import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public final class App {
    private static final String DB_HOST = env("DB_HOST", "localhost");
    private static final String DB_PORT = env("DB_PORT", "5432");
    private static final String DB_NAME = env("DB_NAME", "appdb");
    private static final String DB_USER = env("DB_USER", "appuser");
    private static final String DB_PASSWORD = env("DB_PASSWORD", "");

    private App() {
    }

    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(env("PORT", "3000"));
        HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", port), 0);
        server.createContext("/api/health", exchange -> respond(exchange, 200, "{\"status\":\"UP\"}"));
        server.createContext("/api/records", App::handleRecords);
        server.start();
        System.out.printf("API listening on port %d%n", port);
    }

    private static void handleRecords(HttpExchange exchange) throws IOException {
        try {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String content = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                if (content.isBlank()) {
                    respond(exchange, 400, "{\"error\":\"record content is required\"}");
                    return;
                }
                try (Connection connection = connect()) {
                    createTable(connection);
                    try (PreparedStatement statement = connection.prepareStatement(
                            "INSERT INTO app_records(content) VALUES (?) RETURNING id")) {
                        statement.setString(1, content);
                        try (ResultSet result = statement.executeQuery()) {
                            result.next();
                            respond(exchange, 201, "{\"id\":" + result.getLong(1) + "}");
                        }
                    }
                }
                return;
            }

            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                List<String> records = new ArrayList<>();
                try (Connection connection = connect()) {
                    createTable(connection);
                    try (Statement statement = connection.createStatement();
                         ResultSet result = statement.executeQuery("SELECT content FROM app_records ORDER BY id")) {
                        while (result.next()) {
                            records.add("\"" + jsonEscape(result.getString(1)) + "\"");
                        }
                    }
                }
                respond(exchange, 200, "[" + String.join(",", records) + "]");
                return;
            }

            exchange.getResponseHeaders().set("Allow", "GET, POST");
            respond(exchange, 405, "{\"error\":\"method not allowed\"}");
        } catch (Exception exception) {
            respond(exchange, 503, "{\"error\":\"database unavailable\"}");
        }
    }

    private static Connection connect() throws Exception {
        String url = "jdbc:postgresql://" + DB_HOST + ":" + DB_PORT + "/" + DB_NAME + "?sslmode=disable";
        return DriverManager.getConnection(url, DB_USER, DB_PASSWORD);
    }

    private static void createTable(Connection connection) throws Exception {
        try (Statement statement = connection.createStatement()) {
            statement.execute("CREATE TABLE IF NOT EXISTS app_records (id BIGSERIAL PRIMARY KEY, content TEXT NOT NULL)");
        }
    }

    private static String env(String key, String fallback) {
        String value = System.getenv(key);
        return value == null || value.isBlank() ? fallback : value;
    }

    private static String jsonEscape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\r", "\\r");
    }

    private static void respond(HttpExchange exchange, int status, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (var output = exchange.getResponseBody()) {
            output.write(bytes);
        }
    }
}
