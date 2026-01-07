// DOM Elements
const apiKeyEl = document.getElementById("apiKey");
const toggleKeyVisibilityBtn = document.getElementById("toggleKeyVisibility");
const getProxyBtn = document.getElementById("getProxy");
const apiLogEl = document.getElementById("apiLog");

const proxyTypeEl = document.getElementById("proxyType");
const proxyHostEl = document.getElementById("proxyHost");
const proxyPortEl = document.getElementById("proxyPort");
const useAuthEl = document.getElementById("useAuth");
const authFieldsEl = document.getElementById("authFields");
const usernameEl = document.getElementById("username");
const passwordEl = document.getElementById("password");
const enableProxyBtn = document.getElementById("enableProxy");
const disableProxyBtn = document.getElementById("disableProxy");
const statusDotEl = document.getElementById("statusDot");
const statusTextEl = document.getElementById("statusText");
const apiResponseLogEl = document.getElementById("apiResponseLog");
const checkIpBtn = document.getElementById("checkIpBtn");

// Load saved data when popup opens
document.addEventListener("DOMContentLoaded", async () => {
  await loadApiKey();
  await loadSavedSettings();
  await updateStatus();
  await loadLastApiResponse();
  await loadStoredLogs();

  // Listen for storage changes (for logs)
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local") {
      if (changes.apiLogs) {
        displayStoredLogs(changes.apiLogs.newValue || []);
      }
      if (changes.lastApiResponse) {
        displayApiResponse(changes.lastApiResponse.newValue);
      }
      if (changes.currentProxy || changes.proxyEnabled) {
        updateStatus();
      }
    }
  });
});

// Check IP button - open whoer.net
checkIpBtn.addEventListener("click", async () => {
  try {
    await chrome.tabs.create({ url: "https://whoer.net/" });
  } catch (error) {
    showNotification("Không thể mở trang kiểm tra IP: " + error.message, "error");
  }
});

// Auto-save API key when input changes (debounced)
let saveApiKeyTimeout;
apiKeyEl.addEventListener("input", () => {
  clearTimeout(saveApiKeyTimeout);
  saveApiKeyTimeout = setTimeout(async () => {
    const apiKey = apiKeyEl.value.trim();
    if (apiKey) {
      await chrome.storage.local.set({ wwproxyApiKey: apiKey });
      addLog("💾 API key đã được lưu tự động", "success");
    }
  }, 1000); // Save after 1 second of no typing
});

// Also save when input loses focus
apiKeyEl.addEventListener("blur", async () => {
  const apiKey = apiKeyEl.value.trim();
  if (apiKey) {
    await chrome.storage.local.set({ wwproxyApiKey: apiKey });
  }
});

// Toggle API key visibility
toggleKeyVisibilityBtn.addEventListener("click", () => {
  if (apiKeyEl.type === "password") {
    apiKeyEl.type = "text";
    toggleKeyVisibilityBtn.textContent = "🙈";
  } else {
    apiKeyEl.type = "password";
    toggleKeyVisibilityBtn.textContent = "👁️";
  }
});

// Save API key

// Call WWProxy API function (reusable)
async function callWWProxyAPI(apiKey, showLogs = true) {
  console.log("callWWProxyAPI called with apiKey:", apiKey ? "***" : "empty", "showLogs:", showLogs);

  if (!apiKey) {
    console.error("callWWProxyAPI: No API key provided");
    throw new Error("API key is required");
  }

  // Call WWProxy API (provinceId = -1 for all provinces)
  const apiUrl = `https://wwproxy.com/api/client/proxy/available?key=${apiKey}&provinceId=-1`;
  console.log("callWWProxyAPI: Calling API:", apiUrl.replace(/key=[^&]+/, "key=***"));

  const startTime = Date.now();

  if (showLogs) {
    console.log("callWWProxyAPI: Adding log - Đang gọi API");
    addLog(`🔄 Đang gọi API...`, "info");
  }

  try {
    // Add timeout to fetch (15 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    console.log("callWWProxyAPI: Starting fetch...");
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      mode: "cors",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("callWWProxyAPI: Fetch completed, duration:", duration, "status:", response.status);

    if (showLogs) {
      addLog(`⏱️ Response nhận sau ${duration}s`, "info");
    }

    if (!response.ok) {
      console.error("callWWProxyAPI: Response not OK:", response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("callWWProxyAPI: Parsing JSON response...");
    const data = await response.json();
    console.log("callWWProxyAPI: Success, data:", data);
    return data;
  } catch (error) {
    console.error("callWWProxyAPI: Error occurred:", error);
    throw error;
  }
}

// Get proxy from WWProxy API and auto change IP
getProxyBtn.addEventListener("click", async () => {
  const apiKey = apiKeyEl.value.trim();

  if (!apiKey) {
    showNotification("Vui lòng nhập API key!", "error");
    addLog("❌ Chưa có API key", "error");
    return;
  }

  try {
    getProxyBtn.disabled = true;
    getProxyBtn.textContent = "⏳ Đang xử lý...";

    const data = await callWWProxyAPI(apiKey, true);

    // Display full response in log section
    displayApiResponse(data);

    if (data.status === "OK" && data.data) {
      const proxyData = data.data;
      addLog(
        `✅ Thành công! IP: ${proxyData.ipAddress}:${proxyData.port}`,
        "success"
      );

      // Auto fill proxy info
      proxyTypeEl.value = "http";
      proxyHostEl.value = proxyData.ipAddress;
      proxyPortEl.value = proxyData.port;
      useAuthEl.checked = false;
      authFieldsEl.style.display = "none";

      // Auto enable proxy
      const proxyConfig = {
        type: "http",
        host: proxyData.ipAddress,
        port: parseInt(proxyData.port),
        useAuth: false,
        username: "",
        password: "",
      };

      await chrome.runtime.sendMessage({
        action: "enableProxy",
        config: proxyConfig,
      });

      await chrome.storage.local.set({
        currentProxy: proxyConfig,
        proxyEnabled: true,
        lastWWProxyData: proxyData,
        lastApiResponse: data,
      });

      await updateStatus();

      showNotification(
        `✅ Đổi IP thành công: ${proxyData.ipAddress}`,
        "success"
      );
    } else {
      // Handle error response - response already displayed above
      const errorMessage = data.message || "Không lấy được proxy";
      addLog(`❌ ${data.status}: ${errorMessage}`, "error");
      showNotification(`❌ ${errorMessage}`, "error");

      // Save error response
      await chrome.storage.local.set({ lastApiResponse: data });
    }
  } catch (error) {
    let errorMessage = error.message;

    // Handle specific error types
    if (error.name === "AbortError") {
      errorMessage = "Timeout! API không phản hồi sau 15 giây";
      addLog(`⏱️ ${errorMessage}`, "error");
    } else if (error.message.includes("Failed to fetch")) {
      errorMessage =
        "Không thể kết nối đến API. Kiểm tra:\n• Internet connection\n• Firewall/VPN\n• API có bị chặn không";
      addLog(`🚫 ${errorMessage}`, "error");
    } else {
      addLog(`❌ Lỗi: ${errorMessage}`, "error");
    }

    const errorResponse = {
      error: errorMessage,
      type: error.name,
      timestamp: new Date().toISOString(),
    };
    displayApiResponse(errorResponse);
    console.error("API Error:", error);
    showNotification("❌ " + errorMessage.split("\n")[0], "error");
  } finally {
    getProxyBtn.disabled = false;
    getProxyBtn.textContent = "🔄 Lấy Proxy & Đổi IP";
  }
});

// Toggle auth fields
useAuthEl.addEventListener("change", () => {
  authFieldsEl.style.display = useAuthEl.checked ? "block" : "none";
});

// Enable proxy
enableProxyBtn.addEventListener("click", async () => {
  const proxyConfig = {
    type: proxyTypeEl.value,
    host: proxyHostEl.value.trim(),
    port: parseInt(proxyPortEl.value),
    useAuth: useAuthEl.checked,
    username: usernameEl.value.trim(),
    password: passwordEl.value.trim(),
  };

  // Validation
  if (!proxyConfig.host || !proxyConfig.port) {
    showNotification("Vui lòng nhập đầy đủ Server và Port!", "error");
    return;
  }

  if (proxyConfig.useAuth && (!proxyConfig.username || !proxyConfig.password)) {
    showNotification("Vui lòng nhập Username và Password!", "error");
    return;
  }

  try {
    // Send to background script
    await chrome.runtime.sendMessage({
      action: "enableProxy",
      config: proxyConfig,
    });

    // Save settings
    await chrome.storage.local.set({
      currentProxy: proxyConfig,
      proxyEnabled: true,
    });

    await updateStatus();
    showNotification("Proxy đã được bật!", "success");
  } catch (error) {
    showNotification("Lỗi: " + error.message, "error");
  }
});

// Disable proxy
disableProxyBtn.addEventListener("click", async () => {
  try {
    await chrome.runtime.sendMessage({ action: "disableProxy" });
    await chrome.storage.local.set({ proxyEnabled: false });
    await updateStatus();
    showNotification("Proxy đã được tắt!", "success");
  } catch (error) {
    showNotification("Lỗi: " + error.message, "error");
  }
});

// Load saved settings
async function loadSavedSettings() {
  const data = await chrome.storage.local.get(["currentProxy"]);
  if (data.currentProxy) {
    const config = data.currentProxy;
    proxyTypeEl.value = config.type || "http";
    proxyHostEl.value = config.host || "";
    proxyPortEl.value = config.port || "";
    useAuthEl.checked = config.useAuth || false;
    usernameEl.value = config.username || "";
    passwordEl.value = config.password || "";
    authFieldsEl.style.display = config.useAuth ? "block" : "none";
  }
}

// Display API response
function displayApiResponse(data) {
  const timestamp = new Date().toLocaleString("vi-VN");

  apiResponseLogEl.innerHTML = `
    <div class="response-header">
      <strong>⏰ ${timestamp}</strong>
    </div>
    <pre class="response-content">${JSON.stringify(data, null, 2)}</pre>
  `;

  apiResponseLogEl.classList.add("has-data");
}

// Load last API response
async function loadLastApiResponse() {
  const data = await chrome.storage.local.get(["lastApiResponse"]);
  if (data.lastApiResponse) {
    displayApiResponse(data.lastApiResponse);
  }
}

// Update status display
async function updateStatus() {
  const data = await chrome.storage.local.get(["proxyEnabled", "currentProxy"]);
  if (data.proxyEnabled && data.currentProxy) {
    statusDotEl.className = "status-dot active";
    statusTextEl.textContent = `Đang hoạt động: ${data.currentProxy.host}:${data.currentProxy.port}`;
  } else {
    statusDotEl.className = "status-dot";
    statusTextEl.textContent = "Không hoạt động";
  }
}

// Show notification
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Load API key
async function loadApiKey() {
  const data = await chrome.storage.local.get(["wwproxyApiKey"]);
  if (data.wwproxyApiKey) {
    apiKeyEl.value = data.wwproxyApiKey;
  }
}

// Add log entry
function addLog(message, type = "info") {
  const time = new Date().toLocaleTimeString("vi-VN");
  const logEntry = document.createElement("div");
  logEntry.className = "log-entry";

  let logClass = "log-info";
  if (type === "success") logClass = "log-success";
  if (type === "error") logClass = "log-error";

  logEntry.innerHTML = `<span class="log-time">[${time}]</span><span class="${logClass}">${message}</span>`;

  apiLogEl.classList.add("show");
  apiLogEl.appendChild(logEntry);

  // Auto scroll to bottom
  apiLogEl.scrollTop = apiLogEl.scrollHeight;

  // Keep only last 50 logs
  while (apiLogEl.children.length > 50) {
    apiLogEl.removeChild(apiLogEl.firstChild);
  }

  // Also save to storage for background script logs
  saveLogToStorage(message, type);
}

// Save log to storage
async function saveLogToStorage(message, type = "info") {
  const time = new Date().toLocaleTimeString("vi-VN");
  const logEntry = {
    time: time,
    message: message,
    type: type,
    timestamp: Date.now(),
  };

  const result = await chrome.storage.local.get(["apiLogs"]);
  const logs = result.apiLogs || [];
  logs.push(logEntry);
  const trimmedLogs = logs.slice(-50);
  await chrome.storage.local.set({ apiLogs: trimmedLogs });
}

// Load stored logs
async function loadStoredLogs() {
  const result = await chrome.storage.local.get(["apiLogs"]);
  if (result.apiLogs && result.apiLogs.length > 0) {
    displayStoredLogs(result.apiLogs);
  }
}

// Display stored logs
function displayStoredLogs(logs) {
  // Clear existing logs
  apiLogEl.innerHTML = "";

  // Display all logs
  logs.forEach((logEntry) => {
    const logDiv = document.createElement("div");
    logDiv.className = "log-entry";

    let logClass = "log-info";
    if (logEntry.type === "success") logClass = "log-success";
    if (logEntry.type === "error") logClass = "log-error";

    logDiv.innerHTML = `<span class="log-time">[${logEntry.time}]</span><span class="${logClass}">${logEntry.message}</span>`;
    apiLogEl.appendChild(logDiv);
  });

  if (logs.length > 0) {
    apiLogEl.classList.add("show");
    apiLogEl.scrollTop = apiLogEl.scrollHeight;
  }
}


