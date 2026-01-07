// DOM Elements
const apiKeyEl = document.getElementById("apiKey");
const toggleKeyVisibilityBtn = document.getElementById("toggleKeyVisibility");
const getProxyBtn = document.getElementById("getProxy");
const getCurrentIpBtn = document.getElementById("getCurrentIp");
const apiLogEl = document.getElementById("apiLog");
const provinceSelectEl = document.getElementById("provinceSelect");

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

// Modal elements - Current IP
const currentIpModal = document.getElementById("currentIpModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalCancelBtn = document.getElementById("modalCancelBtn");
const modalApplyBtn = document.getElementById("modalApplyBtn");
const modalIpAddress = document.getElementById("modalIpAddress");
const modalPort = document.getElementById("modalPort");
const modalProvince = document.getElementById("modalProvince");
const modalExpiry = document.getElementById("modalExpiry");

// Modal elements - API Log
const apiLogModal = document.getElementById("apiLogModal");
const apiLogModalCloseBtn = document.getElementById("apiLogModalCloseBtn");
const apiLogModalCloseBtn2 = document.getElementById("apiLogModalCloseBtn2");
const viewLogsBtn = document.getElementById("viewLogsBtn");
const clearLogsBtn = document.getElementById("clearLogsBtn");

// Store current IP data for modal
let currentIpData = null;

// Danh sách tỉnh thành Việt Nam
const PROVINCES = [
  { id: -1, name: "🎲 Random (Tất cả)", level: "" },
  { id: 1, name: "Thành phố Hà Nội", level: "Thành phố Trung ương" },
  { id: 2, name: "Tỉnh Hà Giang", level: "Tỉnh" },
  { id: 3, name: "Tỉnh Cao Bằng", level: "Tỉnh" },
  { id: 4, name: "Tỉnh Bắc Kạn", level: "Tỉnh" },
  { id: 5, name: "Tỉnh Tuyên Quang", level: "Tỉnh" },
  { id: 6, name: "Tỉnh Lào Cai", level: "Tỉnh" },
  { id: 7, name: "Tỉnh Điện Biên", level: "Tỉnh" },
  { id: 8, name: "Tỉnh Lai Châu", level: "Tỉnh" },
  { id: 9, name: "Tỉnh Sơn La", level: "Tỉnh" },
  { id: 10, name: "Tỉnh Yên Bái", level: "Tỉnh" },
  { id: 11, name: "Tỉnh Hoà Bình", level: "Tỉnh" },
  { id: 12, name: "Tỉnh Thái Nguyên", level: "Tỉnh" },
  { id: 13, name: "Tỉnh Lạng Sơn", level: "Tỉnh" },
  { id: 14, name: "Tỉnh Quảng Ninh", level: "Tỉnh" },
  { id: 15, name: "Tỉnh Bắc Giang", level: "Tỉnh" },
  { id: 16, name: "Tỉnh Phú Thọ", level: "Tỉnh" },
  { id: 17, name: "Tỉnh Vĩnh Phúc", level: "Tỉnh" },
  { id: 18, name: "Tỉnh Bắc Ninh", level: "Tỉnh" },
  { id: 19, name: "Tỉnh Hải Dương", level: "Tỉnh" },
  { id: 20, name: "Thành phố Hải Phòng", level: "Thành phố Trung ương" },
  { id: 21, name: "Tỉnh Hưng Yên", level: "Tỉnh" },
  { id: 22, name: "Tỉnh Thái Bình", level: "Tỉnh" },
  { id: 23, name: "Tỉnh Hà Nam", level: "Tỉnh" },
  { id: 24, name: "Tỉnh Nam Định", level: "Tỉnh" },
  { id: 25, name: "Tỉnh Ninh Bình", level: "Tỉnh" },
  { id: 26, name: "Tỉnh Thanh Hóa", level: "Tỉnh" },
  { id: 27, name: "Tỉnh Nghệ An", level: "Tỉnh" },
  { id: 28, name: "Tỉnh Hà Tĩnh", level: "Tỉnh" },
  { id: 29, name: "Tỉnh Quảng Bình", level: "Tỉnh" },
  { id: 30, name: "Tỉnh Quảng Trị", level: "Tỉnh" },
  { id: 31, name: "Tỉnh Thừa Thiên Huế", level: "Tỉnh" },
  { id: 32, name: "Thành phố Đà Nẵng", level: "Thành phố Trung ương" },
  { id: 33, name: "Tỉnh Quảng Nam", level: "Tỉnh" },
  { id: 34, name: "Tỉnh Quảng Ngãi", level: "Tỉnh" },
  { id: 35, name: "Tỉnh Bình Định", level: "Tỉnh" },
  { id: 36, name: "Tỉnh Phú Yên", level: "Tỉnh" },
  { id: 37, name: "Tỉnh Khánh Hòa", level: "Tỉnh" },
  { id: 38, name: "Tỉnh Ninh Thuận", level: "Tỉnh" },
  { id: 39, name: "Tỉnh Bình Thuận", level: "Tỉnh" },
  { id: 40, name: "Tỉnh Kon Tum", level: "Tỉnh" },
  { id: 41, name: "Tỉnh Gia Lai", level: "Tỉnh" },
  { id: 42, name: "Tỉnh Đắk Lắk", level: "Tỉnh" },
  { id: 43, name: "Tỉnh Đắk Nông", level: "Tỉnh" },
  { id: 44, name: "Tỉnh Lâm Đồng", level: "Tỉnh" },
  { id: 45, name: "Tỉnh Bình Phước", level: "Tỉnh" },
  { id: 46, name: "Tỉnh Tây Ninh", level: "Tỉnh" },
  { id: 47, name: "Tỉnh Bình Dương", level: "Tỉnh" },
  { id: 48, name: "Tỉnh Đồng Nai", level: "Tỉnh" },
  { id: 49, name: "Tỉnh Bà Rịa - Vũng Tàu", level: "Tỉnh" },
  { id: 50, name: "Thành phố Hồ Chí Minh", level: "Thành phố Trung ương" },
  { id: 51, name: "Tỉnh Long An", level: "Tỉnh" },
  { id: 52, name: "Tỉnh Tiền Giang", level: "Tỉnh" },
  { id: 53, name: "Tỉnh Bến Tre", level: "Tỉnh" },
  { id: 54, name: "Tỉnh Trà Vinh", level: "Tỉnh" },
  { id: 55, name: "Tỉnh Vĩnh Long", level: "Tỉnh" },
  { id: 56, name: "Tỉnh Đồng Tháp", level: "Tỉnh" },
  { id: 57, name: "Tỉnh An Giang", level: "Tỉnh" },
  { id: 58, name: "Tỉnh Kiên Giang", level: "Tỉnh" },
  { id: 59, name: "Thành phố Cần Thơ", level: "Thành phố Trung ương" },
  { id: 60, name: "Tỉnh Hậu Giang", level: "Tỉnh" },
  { id: 61, name: "Tỉnh Sóc Trăng", level: "Tỉnh" },
  { id: 62, name: "Tỉnh Bạc Liêu", level: "Tỉnh" },
  { id: 63, name: "Tỉnh Cà Mau", level: "Tỉnh" },
];

// Load saved data when popup opens
document.addEventListener("DOMContentLoaded", async () => {
  populateProvinceSelect();
  await loadApiKey();
  await loadProvinceSelection();
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

// Populate province select dropdown
function populateProvinceSelect() {
  provinceSelectEl.innerHTML = "";
  PROVINCES.forEach((province) => {
    const option = document.createElement("option");
    option.value = province.id;
    option.textContent = province.name;
    provinceSelectEl.appendChild(option);
  });
}

// Load province selection
async function loadProvinceSelection() {
  const data = await chrome.storage.local.get(["selectedProvinceId"]);
  if (data.selectedProvinceId !== undefined) {
    provinceSelectEl.value = data.selectedProvinceId;
  } else {
    provinceSelectEl.value = "-1"; // Default to random
  }
}

// Save province selection when changed
provinceSelectEl.addEventListener("change", async () => {
  const selectedProvinceId = parseInt(provinceSelectEl.value);
  await chrome.storage.local.set({ selectedProvinceId });

  const provinceName =
    PROVINCES.find((p) => p.id === selectedProvinceId)?.name || "Random";
  addLog(`📍 Đã chọn: ${provinceName}`, "info");
});

// Check IP button - open whoer.net
checkIpBtn.addEventListener("click", async () => {
  try {
    await chrome.tabs.create({ url: "https://whoer.net/" });
  } catch (error) {
    showNotification(
      "Không thể mở trang kiểm tra IP: " + error.message,
      "error"
    );
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
async function callWWProxyAPI(apiKey, provinceId = -1, showLogs = true) {
  console.log(
    "callWWProxyAPI called with apiKey:",
    apiKey ? "***" : "empty",
    "provinceId:",
    provinceId,
    "showLogs:",
    showLogs
  );

  if (!apiKey) {
    console.error("callWWProxyAPI: No API key provided");
    throw new Error("API key is required");
  }

  // Call WWProxy API with selected provinceId
  const apiUrl = `https://wwproxy.com/api/client/proxy/available?key=${apiKey}&provinceId=${provinceId}`;
  console.log(
    "callWWProxyAPI: Calling API:",
    apiUrl.replace(/key=[^&]+/, "key=***")
  );

  const startTime = Date.now();

  if (showLogs) {
    console.log("callWWProxyAPI: Adding log - Đang gọi API");
    const provinceName =
      PROVINCES.find((p) => p.id === provinceId)?.name || "Random";
    addLog(`🔄 Đang gọi API (${provinceName})...`, "info");
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
    console.log(
      "callWWProxyAPI: Fetch completed, duration:",
      duration,
      "status:",
      response.status
    );

    if (showLogs) {
      addLog(`⏱️ Response nhận sau ${duration}s`, "info");
    }

    // Parse JSON response (both success and error cases)
    console.log("callWWProxyAPI: Parsing JSON response...");
    let data;
    try {
      data = await response.json();
      console.log("callWWProxyAPI: Response data:", data);
    } catch (parseError) {
      console.error("callWWProxyAPI: Failed to parse JSON:", parseError);
      throw new Error(`Failed to parse response: ${parseError.message}`);
    }

    if (!response.ok) {
      // Log detailed error information
      console.error("callWWProxyAPI: HTTP Error Response:");
      console.error("  Status:", response.status, response.statusText);
      console.error("  Response body:", JSON.stringify(data, null, 2));

      if (showLogs) {
        addLog(`❌ HTTP ${response.status}: ${JSON.stringify(data)}`, "error");
      }

      // Create detailed error with response data
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.responseData = data;
      error.statusCode = response.status;
      throw error;
    }

    console.log("callWWProxyAPI: Success, data:", data);
    return data;
  } catch (error) {
    console.error("callWWProxyAPI: Error occurred:", error);
    throw error;
  }
}

// Call WWProxy Current IP API
async function callWWProxyCurrentAPI(apiKey, showLogs = true) {
  console.log(
    "callWWProxyCurrentAPI called with apiKey:",
    apiKey ? "***" : "empty"
  );

  if (!apiKey) {
    console.error("callWWProxyCurrentAPI: No API key provided");
    throw new Error("API key is required");
  }

  // Call WWProxy Current API
  const apiUrl = `https://wwproxy.com/api/client/proxy/current?key=${apiKey}`;
  console.log(
    "callWWProxyCurrentAPI: Calling API:",
    apiUrl.replace(/key=[^&]+/, "key=***")
  );

  const startTime = Date.now();

  if (showLogs) {
    addLog(`🔍 Đang lấy thông tin IP hiện tại...`, "info");
  }

  try {
    // Add timeout to fetch (15 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

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
    console.log(
      "callWWProxyCurrentAPI: Fetch completed, duration:",
      duration,
      "status:",
      response.status
    );

    if (showLogs) {
      addLog(`⏱️ Response nhận sau ${duration}s`, "info");
    }

    // Parse JSON response
    let data;
    try {
      data = await response.json();
      console.log("callWWProxyCurrentAPI: Response data:", data);
    } catch (parseError) {
      console.error("callWWProxyCurrentAPI: Failed to parse JSON:", parseError);
      throw new Error(`Failed to parse response: ${parseError.message}`);
    }

    if (!response.ok) {
      // Log detailed error information
      console.error("callWWProxyCurrentAPI: HTTP Error Response:");
      console.error("  Status:", response.status, response.statusText);
      console.error("  Response body:", JSON.stringify(data, null, 2));

      if (showLogs) {
        addLog(`❌ HTTP ${response.status}: ${JSON.stringify(data)}`, "error");
      }

      // Create detailed error with response data
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.responseData = data;
      error.statusCode = response.status;
      throw error;
    }

    console.log("callWWProxyCurrentAPI: Success, data:", data);
    return data;
  } catch (error) {
    console.error("callWWProxyCurrentAPI: Error occurred:", error);
    throw error;
  }
}

// Get proxy from WWProxy API and auto change IP
getProxyBtn.addEventListener("click", async () => {
  const apiKey = apiKeyEl.value.trim();
  const provinceId = parseInt(provinceSelectEl.value);

  if (!apiKey) {
    showNotification("Vui lòng nhập API key!", "error");
    addLog("❌ Chưa có API key", "error");
    return;
  }

  try {
    getProxyBtn.disabled = true;
    getProxyBtn.textContent = "⏳ Đang xử lý...";

    const data = await callWWProxyAPI(apiKey, provinceId, true);

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
    let errorResponse;

    // Check if error has response data from API (HTTP errors like 400, 401, etc.)
    if (error.responseData) {
      console.log("📋 Chi tiết lỗi từ API:");
      console.log("  Status Code:", error.statusCode);
      console.log(
        "  Response Data:",
        JSON.stringify(error.responseData, null, 2)
      );

      // Display the actual API error response
      errorResponse = {
        statusCode: error.statusCode,
        apiResponse: error.responseData,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      };

      // More specific error message
      const apiMessage =
        error.responseData.message ||
        error.responseData.error ||
        "Lỗi không xác định";
      errorMessage = `HTTP ${error.statusCode}: ${apiMessage}`;
      addLog(`❌ ${errorMessage}`, "error");
    }
    // Handle specific error types
    else if (error.name === "AbortError") {
      errorMessage = "Timeout! API không phản hồi sau 15 giây";
      addLog(`⏱️ ${errorMessage}`, "error");
      errorResponse = {
        error: errorMessage,
        type: error.name,
        timestamp: new Date().toISOString(),
      };
    } else if (error.message.includes("Failed to fetch")) {
      errorMessage =
        "Không thể kết nối đến API. Kiểm tra:\n• Internet connection\n• Firewall/VPN\n• API có bị chặn không";
      addLog(`🚫 ${errorMessage}`, "error");
      errorResponse = {
        error: errorMessage,
        type: "NetworkError",
        timestamp: new Date().toISOString(),
      };
    } else {
      addLog(`❌ Lỗi: ${errorMessage}`, "error");
      errorResponse = {
        error: errorMessage,
        type: error.name,
        timestamp: new Date().toISOString(),
      };
    }

    displayApiResponse(errorResponse);
    console.error("API Error:", error);
    showNotification("❌ " + errorMessage.split("\n")[0], "error");
  } finally {
    getProxyBtn.disabled = false;
    getProxyBtn.textContent = "🔄 Lấy Proxy & Đổi IP";
  }
});

// Get current IP from WWProxy API
getCurrentIpBtn.addEventListener("click", async () => {
  const apiKey = apiKeyEl.value.trim();

  if (!apiKey) {
    showNotification("Vui lòng nhập API key!", "error");
    addLog("❌ Chưa có API key", "error");
    return;
  }

  try {
    getCurrentIpBtn.disabled = true;
    getCurrentIpBtn.textContent = "⏳ Đang lấy...";

    const data = await callWWProxyCurrentAPI(apiKey, true);

    // Display full response in log section
    displayApiResponse(data);

    if (data.status === "OK" && data.data) {
      const currentProxy = data.data;

      // Create detailed log message
      let logMessage = `✅ IP hiện tại: ${currentProxy.ipAddress}:${currentProxy.port}`;
      if (currentProxy.provinceName) {
        logMessage += ` (${currentProxy.provinceName})`;
      }

      addLog(logMessage, "success");

      // Save current IP response
      await chrome.storage.local.set({
        lastCurrentIpResponse: data,
        lastApiResponse: data,
      });

      // Show modal with IP information
      showCurrentIpModal(currentProxy);
    } else {
      // Handle error response
      const errorMessage = data.message || "Không lấy được thông tin IP";
      addLog(`❌ ${data.status}: ${errorMessage}`, "error");
      showNotification(`❌ ${errorMessage}`, "error");

      // Save error response
      await chrome.storage.local.set({ lastApiResponse: data });
    }
  } catch (error) {
    let errorMessage = error.message;
    let errorResponse;

    // Check if error has response data from API
    if (error.responseData) {
      console.log("📋 Chi tiết lỗi từ API (Current IP):");
      console.log("  Status Code:", error.statusCode);
      console.log(
        "  Response Data:",
        JSON.stringify(error.responseData, null, 2)
      );

      errorResponse = {
        statusCode: error.statusCode,
        apiResponse: error.responseData,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      };

      const apiMessage =
        error.responseData.message ||
        error.responseData.error ||
        "Lỗi không xác định";
      errorMessage = `HTTP ${error.statusCode}: ${apiMessage}`;
      addLog(`❌ ${errorMessage}`, "error");
    } else if (error.name === "AbortError") {
      errorMessage = "Timeout! API không phản hồi sau 15 giây";
      addLog(`⏱️ ${errorMessage}`, "error");
      errorResponse = {
        error: errorMessage,
        type: error.name,
        timestamp: new Date().toISOString(),
      };
    } else if (error.message.includes("Failed to fetch")) {
      errorMessage =
        "Không thể kết nối đến API. Kiểm tra:\n• Internet connection\n• Firewall/VPN\n• API có bị chặn không";
      addLog(`🚫 ${errorMessage}`, "error");
      errorResponse = {
        error: errorMessage,
        type: "NetworkError",
        timestamp: new Date().toISOString(),
      };
    } else {
      addLog(`❌ Lỗi: ${errorMessage}`, "error");
      errorResponse = {
        error: errorMessage,
        type: error.name,
        timestamp: new Date().toISOString(),
      };
    }

    displayApiResponse(errorResponse);
    console.error("Current IP API Error:", error);
    showNotification("❌ " + errorMessage.split("\n")[0], "error");
  } finally {
    getCurrentIpBtn.disabled = false;
    getCurrentIpBtn.textContent = "📍 Xem IP hiện tại";
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

// Modal functions
function showCurrentIpModal(proxyData) {
  // Store data for later use
  currentIpData = proxyData;

  // Update modal content
  modalIpAddress.textContent = proxyData.ipAddress || "-";
  modalPort.textContent = proxyData.port || "-";
  modalProvince.textContent = proxyData.provinceName || "Không xác định";

  // Format expiry date if available
  if (proxyData.expiry) {
    try {
      const expiryDate = new Date(proxyData.expiry);
      modalExpiry.textContent = expiryDate.toLocaleString("vi-VN");
    } catch (e) {
      modalExpiry.textContent = proxyData.expiry;
    }
  } else {
    modalExpiry.textContent = "Không có thông tin";
  }

  // Show modal
  currentIpModal.classList.add("show");
}

function closeCurrentIpModal() {
  currentIpModal.classList.remove("show");
  currentIpData = null;
}

// Modal event listeners
modalCloseBtn.addEventListener("click", closeCurrentIpModal);
modalCancelBtn.addEventListener("click", closeCurrentIpModal);

// Close modal when clicking outside
currentIpModal.addEventListener("click", (e) => {
  if (e.target === currentIpModal) {
    closeCurrentIpModal();
  }
});

// Apply current IP to proxy settings
modalApplyBtn.addEventListener("click", async () => {
  if (!currentIpData) {
    showNotification("Không có dữ liệu IP để áp dụng", "error");
    return;
  }

  try {
    // Auto fill proxy info
    proxyTypeEl.value = "http";
    proxyHostEl.value = currentIpData.ipAddress;
    proxyPortEl.value = currentIpData.port;
    useAuthEl.checked = false;
    authFieldsEl.style.display = "none";

    // Auto enable proxy
    const proxyConfig = {
      type: "http",
      host: currentIpData.ipAddress,
      port: parseInt(currentIpData.port),
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
      lastWWProxyData: currentIpData,
    });

    await updateStatus();

    showNotification(`✅ Đã áp dụng IP: ${currentIpData.ipAddress}`, "success");
    addLog(
      `✅ Đã áp dụng IP: ${currentIpData.ipAddress}:${currentIpData.port}`,
      "success"
    );

    // Close modal
    closeCurrentIpModal();
  } catch (error) {
    showNotification("Lỗi khi áp dụng proxy: " + error.message, "error");
    addLog(`❌ Lỗi áp dụng proxy: ${error.message}`, "error");
  }
});

// API Log Modal functions
function showApiLogModal() {
  apiLogModal.classList.add("show");
}

function closeApiLogModal() {
  apiLogModal.classList.remove("show");
}

// API Log Modal event listeners
viewLogsBtn.addEventListener("click", showApiLogModal);
apiLogModalCloseBtn.addEventListener("click", closeApiLogModal);
apiLogModalCloseBtn2.addEventListener("click", closeApiLogModal);

// Close modal when clicking outside
apiLogModal.addEventListener("click", (e) => {
  if (e.target === apiLogModal) {
    closeApiLogModal();
  }
});

// Clear logs button
clearLogsBtn.addEventListener("click", async () => {
  if (confirm("Bạn có chắc muốn xóa tất cả logs?")) {
    apiResponseLogEl.innerHTML = `
      <div class="log-placeholder">
        Chưa có dữ liệu. Click "Lấy Proxy & Đổi IP" để xem response từ API.
      </div>
    `;
    await chrome.storage.local.remove(["lastApiResponse"]);
    showNotification("✅ Đã xóa logs", "success");
  }
});

// ESC key to close modals
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCurrentIpModal();
    closeApiLogModal();
  }
});
