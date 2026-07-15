# VPN Setup Skill

在中国网络环境下搭建翻墙 VPN 的知识和配置。

## 适用场景
- 服务器在国外 (Vultr/AWS/Google Cloud 等)
- 客户端在中国大陆
- WireGuard UDP 被运营商封锁

## 核心原则

1. **WireGuard (UDP 51820)** 在中国基本会被 GFW 封锁, 不要作为主要方案
2. **Xray (VLESS + TCP + XTLS Vision)** 是最优方案, 性能接近 WireGuard
3. **Xray (VLESS + WebSocket + TLS)** 作为备用
4. 如果全被封, 尝试:
   - 更换 UUID / WebSocket 路径
   - 使用 CDN (Cloudflare) 中转
   - 更换端口 (如 8443)

## 配置文件位置

- Xray 服务端: `/usr/local/etc/xray/config.json`
- Xray 证书: `/usr/local/etc/xray/cert.pem`, `/usr/local/etc/xray/key.pem`
- WireGuard (wg-easy): `~/.wg-easy/wg0.conf`

## 快速检查步骤

```bash
# 1. 检查 Xray 是否运行
systemctl is-active xray

# 2. 检查端口
ss -tlnp | grep -E "443|51820"

# 3. 查看 Xray 日志
journalctl -u xray --no-pager -n 20

# 4. 检查 WireGuard 连接
wg show
```

## 客户端配置

### XTLS Vision (推荐)
```
vless://<UUID>@<服务器IP>:443?encryption=none&security=tls&type=tcp&flow=xtls-rprx-vision#VPN-XTLS
```

### WebSocket (备用)
```
vless://<UUID>@<服务器IP>:443?encryption=none&security=tls&type=ws&path=%2Fws#VPN-WS
```

## 常用客户端

| 平台 | 推荐客户端 |
|------|-----------|
| macOS | V2rayU (免费), Shadowrocket (付费) |
| iOS | Shadowrocket, Quantumult X |
| Android | v2rayNG (免费) |
| Windows | v2rayN (免费), Clash Verge |
