# VPN 服务器搭建记录

## 环境
- 服务器: Vultr VPS, Ubuntu 26.04, IP: 45.32.29.167
- 面板: 3X-UI v3.5.0 (Web 管理后台)
- Xray: 26.7.11
- 客户端: Mac / 小米 Pad, 中国网络环境

---

## 一、现状

| 服务 | 端口 | 状态 |
|------|------|------|
| 3X-UI 管理面板 | 51821 | ✅ 运行中 |
| VLESS+WS+TLS (Mac) | 443 | ✅ 正常 |
| VLESS+WS 无TLS (平板) | 443 | ✅ 正常 |

---

## 二、管理面板

地址: `http://45.32.29.167:51821/`
账号: `akMRWwe8sm`
密码: `zI2iEAJS5S`

### 常用操作

| 操作 | 方法 |
|------|------|
| 查看节点 | 左侧菜单 → 入站列表 |
| 添加节点 | 右上角 + 添加入站 → 填备注/端口/协议/传输 → 确定 |
| 复制链接 | 节点行右侧点 📋 复制 或 二维码 |
| 改密码 | 左侧菜单 → 面板设置 |
| 看流量 | 左侧菜单 → 统计 |
| 看日志 | 左侧菜单 → 日志 |

---

## 三、客户端配置

| 客户端 | 链接 |
|--------|------|
| **Mac (WS+TLS)** | `vless://a1b2c3d4-e5f6-7890-abcd-ef1234567890@45.32.29.167:443?encryption=none&security=tls&type=ws&path=%2Fws&allowInsecure=1#WS+TLS` |
| **平板 (WS 无TLS)** | `vless://a1b2c3d4-e5f6-7890-abcd-ef1234567890@45.32.29.167:443?encryption=none&security=none&type=ws&path=%2Fws#WS-NoTLS` |

---

## 四、安装步骤

### 4.1 一键安装 3X-UI

```bash
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/main/install.sh)
```

安装时按提示设置用户名、密码、面板端口（需在 VPS 防火墙放行）。

### 4.2 在面板添加节点

面板登录后 → 入站列表 → 右上角 + 添加入站:

**Mac 节点 (WS+TLS):**
- 协议: VLESS
- 端口: 443
- 传输: ws (WebSocket)
- TLS: 打开，选择证书文件 `/etc/x-ui/cert.pem`、`/etc/x-ui/key.pem`
- 路径: `/ws`

**平板节点 (WS 无TLS):**
- 协议: VLESS
- 端口: 443
- 传输: ws (WebSocket)
- TLS: 关闭
- 路径: `/ws`

### 4.3 VPS 防火墙放行端口

Vultr 安全组需放行：22, 443, 51821

服务器内 ufw:
```bash
ufw allow 51821/tcp
ufw allow 443/tcp
```

---

## 五、常用命令

```bash
# 3X-UI
x-ui settings              # 查看/修改面板设置
systemctl restart x-ui     # 重启
journalctl -u x-ui -n 50   # 查看日志

# Xray
systemctl restart x-ui      # 重启会同时重启 Xray
```
