# Local Development Setup

## API Configuration

### 1. Create API Config File

Copy the template and update with your API URL:

```bash
cp src/app/config/api.config.template.ts src/app/config/api.config.ts
```

### 2. Get Your Local IP

```bash
# Linux/Mac
hostname -I | awk '{print $1}'

# Windows
ipconfig | findstr "IPv4"
```

### 3. Update API Config

Edit `src/app/config/api.config.ts` and replace `YOUR_IP_HERE` with your actual IP address.

Example:
```typescript
export const API_BASE_URL = 'http://192.168.0.106:8080/api/1.0.0';
```

### 4. Backend Configuration

Make sure your backend server accepts connections from your network IP:

```bash
# Backend should listen on 0.0.0.0:8080 instead of localhost:8080
```

## API URL Options

- **For localhost only**: `http://localhost:8080/api/1.0.0`
- **For mobile access**: `http://YOUR_IP:8080/api/1.0.0` (use your network IP)

## Notes

- `api.config.ts` is ignored by git (developer-specific)
- `api.config.template.ts` is committed (shows structure)
- All services automatically use this single API base URL
