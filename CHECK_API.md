# 🔍 Hướng dẫn kiểm tra API chậm

## ❓ Tại sao API gọi lâu?

### 1️⃣ **Kiểm tra kết nối Internet**
```bash
# Test ping
ping wwproxy.com
```

### 2️⃣ **Test API trực tiếp trong trình duyệt**

Mở Console (F12) và chạy:

```javascript
const startTime = Date.now();
fetch('https://wwproxy.com/api/client/proxy/available?key=YOUR_KEY&provinceId=-1')
  .then(response => {
    console.log('Time:', (Date.now() - startTime) + 'ms');
    return response.json();
  })
  .then(data => console.log('Data:', data))
  .catch(error => console.error('Error:', error));
```

### 3️⃣ **Kiểm tra CORS**

Nếu thấy lỗi CORS trong Console:
- API wwproxy.com có thể chặn CORS từ extension
- Thử test bằng `test-api.html` (mở file trong browser)

### 4️⃣ **Kiểm tra Firewall/Antivirus**

- Tạm thời tắt Firewall/Antivirus
- Thử lại

### 5️⃣ **Kiểm tra VPN/Proxy hiện tại**

- Nếu đang dùng VPN → Tắt thử
- Nếu đang có proxy khác → Tắt thử

## 🔧 Đã thêm vào Extension:

### ⏱️ Timeout 15 giây
- Nếu API không trả lời sau 15s → Tự động báo lỗi
- Hiển thị: "Timeout! API không phản hồi sau 15 giây"

### 📊 Tracking thời gian
- Log thời gian response
- Ví dụ: `⏱️ Response nhận sau 2.34s`

### 🚫 Error messages rõ ràng
- **Timeout**: API quá chậm
- **Failed to fetch**: Không kết nối được (internet/firewall)
- **CORS**: API chặn từ extension

## 🧪 Test thủ công:

### Cách 1: Dùng test-api.html
```bash
# Mở file này trong browser
D:\code\proxychrome\test-api.html
```

### Cách 2: Dùng curl
```bash
curl -X GET "https://wwproxy.com/api/client/proxy/available?key=YOUR_KEY&provinceId=-1" \
  -H "Accept: application/json" \
  --max-time 15 \
  --verbose
```

### Cách 3: Dùng Postman
1. Mở Postman
2. GET request: `https://wwproxy.com/api/client/proxy/available`
3. Params:
   - key: YOUR_KEY
   - provinceId: -1

## 📈 Thời gian response bình thường:

- ✅ **< 2s**: Rất tốt
- ⚠️ **2-5s**: Chấp nhận được
- ❌ **> 5s**: Chậm (có vấn đề)
- 🚫 **> 15s**: Timeout

## 💡 Giải pháp:

### Nếu API thực sự chậm:
1. **Liên hệ support WWProxy**: Báo API chậm
2. **Chọn region khác**: Thử provinceId khác
3. **Dùng API key khác**: Test với key khác

### Nếu bị chặn:
1. **Tắt VPN/Proxy**: Test không VPN
2. **Đổi mạng**: Thử 4G/5G thay vì WiFi
3. **Kiểm tra IP**: IP của bạn có bị ban không

## 🔍 Debug trong Extension:

1. Vào `chrome://extensions/`
2. Tìm "Proxy Manager"
3. Click **"service worker"**
4. Xem Console logs
5. Chạy test:
   ```javascript
   // Trong Console
   fetch('https://wwproxy.com/api/client/proxy/available?key=YOUR_KEY&provinceId=-1')
     .then(r => r.json())
     .then(d => console.log(d));
   ```

## ⚡ Quick Fix:

Nếu vẫn lâu, thử giảm timeout xuống:

```javascript
// Trong popup.js, dòng ~84
const timeoutId = setTimeout(() => controller.abort(), 5000); // Đổi thành 5s
```

---

**Lưu ý**: Nếu API liên tục timeout/chậm → Vấn đề từ phía WWProxy.com hoặc mạng của bạn.

