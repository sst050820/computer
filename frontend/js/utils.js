// 工具函数
function showToast(message, type) {
  type = type || "info";
  var colors = { success: "#10b981", error: "#ef4444", info: "#3b82f6" };
  var toast = document.getElementById("dynamic-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "dynamic-toast";
    Object.assign(toast.style, {
      position: "fixed", bottom: "24px", right: "24px", zIndex: "9999",
      background: "rgba(30,41,59,0.95)", backdropFilter: "blur(12px)",
      borderRadius: "48px", padding: "12px 24px", color: "white",
      fontWeight: "500", fontSize: "0.9rem",
      boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
      opacity: "0", transition: "opacity 0.2s ease",
      borderLeft: "4px solid " + (colors[type] || "#3b82f6"),
    });
    document.body.appendChild(toast);
  }
  toast.style.borderLeftColor = colors[type] || "#3b82f6";
  toast.textContent = message;
  toast.style.opacity = "1";
  clearTimeout(toast._tid);
  toast._tid = setTimeout(function() { toast.style.opacity = "0"; }, 2500);
}
