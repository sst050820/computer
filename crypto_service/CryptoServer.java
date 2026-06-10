import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// 引入你整理好的 ABE 算法组件
import main.java.compositeOrderPairingGroups;
import main.java.MAFASACAR.MAFASACAR;
import main.java.utils.TiSt;

public class CryptoServer {
    private static final compositeOrderPairingGroups PG;
    private static final Map<String, MAFASACAR> sessions = new ConcurrentHashMap<>();

    static {
        try {
            System.out.println("⏳ 正在初始化复合阶双线性群与 ABE 系统...");
            PG = new compositeOrderPairingGroups();
            System.out.println("✅ ABE 系统初始化成功，Type A1 曲线已成功加载！");
        } catch (Exception e) {
            throw new RuntimeException("初始化失败，请检查 params/ 路径下的属性文件！", e);
        }
    }

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8081), 0);

        server.createContext("/api/encrypt", exchange -> {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            String plainText = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            try {
                MAFASACAR p4 = new MAFASACAR();
                p4.GlobalSetup();
                p4.AuthSetup(4);
                p4.KeyGen(p4.GPP, 0, 3);
                p4.setM(p4.GPP, plainText);
                p4.Enc(p4.GPP, 3, 3);

                String id = UUID.randomUUID().toString();
                sessions.put(id, p4);

                String response = "{\"id\":\"" + id + "\",\"status\":\"encrypted\"}";
                byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, bytes.length);
                OutputStream os = exchange.getResponseBody();
                os.write(bytes);
                os.close();
            } catch (Exception e) {
                String err = "ABE Encryption Error: " + e.getMessage();
                byte[] bytes = err.getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(500, bytes.length);
                exchange.getResponseBody().write(bytes);
                exchange.getResponseBody().close();
            }
        });

        server.createContext("/api/decrypt", exchange -> {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            String query = exchange.getRequestURI().getQuery();
            String id = getQueryValue(query, "id");
            if (id == null || id.isEmpty()) {
                String err = "Missing id parameter";
                byte[] bytes = err.getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(400, bytes.length);
                exchange.getResponseBody().write(bytes);
                exchange.getResponseBody().close();
                return;
            }

            MAFASACAR p4 = sessions.get(id);
            if (p4 == null) {
                String err = "Session not found";
                byte[] bytes = err.getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(404, bytes.length);
                exchange.getResponseBody().write(bytes);
                exchange.getResponseBody().close();
                return;
            }

            try {
                p4.Dec(p4.GPP);
                boolean ok = p4.validDec();
                String plain = p4.getPlainText();
                String response = "{\"id\":\"" + id + "\",\"decrypted\":" + ok + ",\"plaintext\":\"" + escapeJson(plain) + "\"}";
                byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, bytes.length);
                OutputStream os = exchange.getResponseBody();
                os.write(bytes);
                os.close();
            } catch (Exception e) {
                String err = "ABE Decryption Error: " + e.getMessage();
                byte[] bytes = err.getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(500, bytes.length);
                exchange.getResponseBody().write(bytes);
                exchange.getResponseBody().close();
            }
        });

        System.out.println("🚀 Java ABE 服务已挂起，正在监听：http://localhost:8081/api/encrypt 和 /api/decrypt?id=<id>");
        server.start();
    }

    private static String getQueryValue(String query, String key) {
        if (query == null) return null;
        for (String part : query.split("&")) {
            String[] pair = part.split("=", 2);
            if (pair.length == 2 && pair[0].equals(key)) {
                return pair[1];
            }
        }
        return null;
    }

    private static String escapeJson(String text) {
        if (text == null) return "";
        return text.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
}
