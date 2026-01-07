// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "enableProxy") {
    enableProxy(request.config);
    sendResponse({ success: true });
  } else if (request.action === "disableProxy") {
    disableProxy();
    sendResponse({ success: true });
  }
  // Return true to indicate we'll respond asynchronously when needed
  return true;
});

// Enable proxy
function enableProxy(config) {
  const proxyConfig = {
    mode: "fixed_servers",
    rules: {
      singleProxy: {
        scheme: config.type,
        host: config.host,
        port: config.port,
      },
      bypassList: ["localhost", "127.0.0.1", "<local>"],
    },
  };

  chrome.proxy.settings.set({ value: proxyConfig, scope: "regular" }, () => {
    console.log("Proxy enabled:", config);
  });

  // Handle authentication if needed
  if (config.useAuth) {
    setupProxyAuth(config.username, config.password);
  } else {
    removeProxyAuth();
  }
}

// Disable proxy
function disableProxy() {
  chrome.proxy.settings.set(
    { value: { mode: "direct" }, scope: "regular" },
    () => {
      console.log("Proxy disabled");
    }
  );
  removeProxyAuth();
}

// Setup proxy authentication
let authListener = null;

function setupProxyAuth(username, password) {
  // Remove old listener if exists
  removeProxyAuth();

  // Create new auth listener
  authListener = (details) => {
    return {
      authCredentials: {
        username: username,
        password: password,
      },
    };
  };

  chrome.webRequest.onAuthRequired.addListener(
    authListener,
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
}

function removeProxyAuth() {
  if (authListener) {
    chrome.webRequest.onAuthRequired.removeListener(authListener);
    authListener = null;
  }
}


// Also restore on extension installation/update
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get([
    "proxyEnabled",
    "currentProxy",
  ]);
  if (data.proxyEnabled && data.currentProxy) {
    enableProxy(data.currentProxy);
  }
});

// Restore proxy settings on browser startup
chrome.runtime.onStartup.addListener(async () => {
  const data = await chrome.storage.local.get(["proxyEnabled", "currentProxy"]);
  if (data.proxyEnabled && data.currentProxy) {
    enableProxy(data.currentProxy);
  }
});

