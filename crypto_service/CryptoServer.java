import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import main.java.compositeOrderPairingGroups;
import main.java.MAFASACAR.MAFASACAR;
import main.java.utils.TiSt;

public class CryptoServer {
    // ===== 全局共享 ABE 实例：所有会话共用同一个 GPP 和 AA =====
    private static final compositeOrderPairingGroups PG;
    private static final MAFASACAR globalP4;
    private static final Map<String, MAFASACAR> sessions = new ConcurrentHashMap<>();

    static {
        try {
            System.out.println("⏳ 初始化复合阶双线性群与 ABE 系统...");
            PG = new compositeOrderPairingGroups();
            globalP4 = new MAFASACAR();
            globalP4.GlobalSetup();
            globalP4.AuthSetup(5); // 5 个全局属性：Location, Capability, Quality, Grade, Organic
            System.out.println("✅ ABE 系统初始化成功，全局 GPP 和 5 个 AA 已就绪");
        } catch (Exception e) {
            throw new RuntimeException("初始化失败: " + e.getMessage(), e);
        }
    }

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8081), 0);

        // ===== 1. POST /api/encrypt =====
        server.createContext("/api/encrypt", exchange -> {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1); return;
            }
            // 从 URL 参数读取条件数量: /api/encrypt?n=3
            int n = 3;
            String query = exchange.getRequestURI().getQuery();
            if (query != null) {
                for (String p : query.split("&")) {
                    String[] kv = p.split("=", 2);
                    if (kv.length == 2 && kv[0].equals("n")) {
                        try { n = Integer.parseInt(kv[1]); } catch (NumberFormatException e) {}
                        if (n < 1) n = 1; if (n > 5) n = 5;
                    }
                }
            }
            String plainText = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            final int nn = n;
            try {
                // 创建会话级实例，共享全局 GPP 和 AA
                MAFASACAR p4 = new MAFASACAR();
                p4.GPP = globalP4.GPP;   // 共享全局参数
                p4.AA = globalP4.AA;     // 共享全局授权方

                // LSSS 矩阵大小 = 条件数量，用户密钥属性数 = 条件数量
                p4.KeyGen(p4.GPP, 0, nn);
                p4.setM(p4.GPP, plainText);
                p4.Enc(p4.GPP, nn, nn);

                String id = UUID.randomUUID().toString();
                sessions.put(id, p4);

                String resp = "{\"id\":\"" + id + "\",\"status\":\"encrypted\"}";
                send(exchange, 200, resp);
            } catch (Exception e) {
                send(exchange, 500, "Encrypt error: " + e.getMessage());
            }
        });

        // ===== 2. POST /api/decrypt =====
        server.createContext("/api/decrypt", exchange -> {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1); return;
            }
            try {
                String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                // 从密文中提取 session ID：{"id":"uuid","status":"encrypted"}
                String id = extractId(body);
                if (id == null || id.isEmpty()) {
                    send(exchange, 400, "{\"error\":\"missing session id\"}");
                    return;
                }

                MAFASACAR p4 = sessions.get(id);
                if (p4 == null) {
                    send(exchange, 404, "{\"error\":\"session not found\"}");
                    return;
                }

                // 从请求中读取解密用户属性数量，重新生成密钥
                int attrCount = countAttributes(body);
                if (attrCount > 0) { p4.KeyGen(p4.GPP, 0, attrCount); }
                // 用共享 GPP 解密（SysUpd 后 GPP.RP 已变，旧密钥会失败）
                p4.Dec(p4.GPP);
                boolean ok = p4.validDec();
                String plain = p4.getPlainText();

                if (ok) {
                    String resp = "{\"id\":\"" + id + "\",\"decrypted\":true,\"plaintext\":\"" + escapeJson(plain) + "\"}";
                    send(exchange, 200, resp);
                } else {
                    send(exchange, 403, "{\"error\":\"decrypt denied: attributes do not satisfy policy\"}");
                }
            } catch (Exception e) {
                send(exchange, 500, "Decrypt error: " + e.getMessage());
            }
        });

        // ===== 3. POST /api/revoke =====
        server.createContext("/api/revoke", exchange -> {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1); return;
            }
            try {
                // 更新全局系统参数 — 所有持有该属性密钥的用户解密能力失效
                globalP4.SysUpd();
                System.out.println("[ABE] SysUpd 完成——属性撤销生效，旧密钥已失效");
                send(exchange, 200, "{\"status\":\"ok\",\"message\":\"attribute revoked, system parameters updated\"}");
            } catch (Exception e) {
                send(exchange, 500, "Revoke error: " + e.getMessage());
            }
        });

        // ===== 4. POST /api/rekey =====
        server.createContext("/api/rekey", exchange -> {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1); return;
            }
            try {
                // 全局密钥轮换：生成新系统主密钥参数
                globalP4.SysUpd();
                System.out.println("[ABE] Rekey 完成——系统主密钥已更新");
                send(exchange, 200, "{\"status\":\"ok\",\"message\":\"system keys rotated\"}");
            } catch (Exception e) {
                send(exchange, 500, "Rekey error: " + e.getMessage());
            }
        });

        // ===== 5. POST /api/reencrypt =====
        server.createContext("/api/reencrypt", exchange -> {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1); return;
            }
            try {
                String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                String id = extractId(body);
                if (id == null) {
                    // 纯文本密文，直接返回（保持兼容）
                    send(exchange, 200, body);
                    return;
                }

                MAFASACAR p4 = sessions.get(id);
                if (p4 == null) {
                    send(exchange, 404, "{\"error\":\"session not found\"}");
                    return;
                }

                // 用更新后的 GPP 重新加密
                p4.CTUpd(p4.GPP);
                System.out.println("[ABE] CTUpd 完成——密文已用新密钥更新");
                send(exchange, 200, "{\"id\":\"" + id + "\",\"status\":\"reencrypted\"}");
            } catch (Exception e) {
                send(exchange, 500, "Reencrypt error: " + e.getMessage());
            }
        });

        System.out.println("🚀 ABE 密码学服务已启动: http://localhost:8081");
        System.out.println("   端点: /api/encrypt | /api/decrypt | /api/revoke | /api/rekey | /api/reencrypt");
        server.start();
    }

    // ===== 工具方法 =====
    private static void send(HttpExchange exchange, int code, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(code, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }

    private static String extractId(String body) {
        // 从请求体中提取 session ID
        // 格式: {"ciphertext":"{\"id\":\"uuid\",...}","attributes":{...}}
        // 先尝试直接找 "id":
        int idIdx = body.indexOf("\"id\"");
        if (idIdx < 0) return null;
        // 跳过 "id":" 或 "id":"
        int colonIdx = body.indexOf(":", idIdx);
        if (colonIdx < 0) return null;
        int valStart = colonIdx + 1;
        while (valStart < body.length() && (body.charAt(valStart) == ' ' || body.charAt(valStart) == '"' || body.charAt(valStart) == '\\')) {
            valStart++;
        }
        int valEnd = valStart;
        while (valEnd < body.length() && body.charAt(valEnd) != '"' && body.charAt(valEnd) != '\\' && body.charAt(valEnd) != ',' && body.charAt(valEnd) != '}') {
            valEnd++;
        }
        if (valEnd <= valStart) return null;
        return body.substring(valStart, valEnd);
    }

    private static int countAttributes(String body) {
        // 统计 "attributes":{...} 中的键值对数量
        int attrIdx = body.indexOf("\"attributes\"");
        if (attrIdx < 0) return 0;
        int braceIdx = body.indexOf("{", attrIdx);
        if (braceIdx < 0) return 0;
        // 简单统计：引号对数量 / 2 = 键值对数（近似）
        int count = 0;
        boolean inStr = false;
        for (int i = braceIdx; i < body.length() && body.charAt(i) != '}'; i++) {
            char c = body.charAt(i);
            if (c == '"' && (i == braceIdx || body.charAt(i-1) != '\\')) {
                inStr = !inStr;
                if (inStr) count++;
            }
        }
        return Math.max(1, count / 4); // 每对 key:value 有 4 个引号
    }

    private static String escapeJson(String text) {
        if (text == null) return "";
        return text.replace("\\", "\\\\").replace("\"", "\\\"")
                   .replace("\n", "\\n").replace("\r", "\\r");
    }
}
