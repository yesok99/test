#!/bin/bash
set -e

SERVER_IP="${1:-$(curl -s ifconfig.me)}"
XRAY_PORT="${2:-443}"
UUID="${3:-$(xray uuid)}"

echo "=== 安装 Xray ==="
bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install

echo "=== 生成自签名证书 ==="
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
  -keyout /usr/local/etc/xray/key.pem \
  -out /usr/local/etc/xray/cert.pem \
  -subj "/CN=$SERVER_IP" \
  -addext "subjectAltName=IP:$SERVER_IP"
chmod 644 /usr/local/etc/xray/key.pem /usr/local/etc/xray/cert.pem

echo "=== 写入 Xray 配置 (TCP+XTLS Vision + WebSocket 双 inbound) ==="
cat > /usr/local/etc/xray/config.json << EOF
{
  "log": { "loglevel": "warning" },
  "inbounds": [
    {
      "port": $XRAY_PORT,
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "$UUID",
            "flow": "xtls-rprx-vision"
          }
        ],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "tcp",
        "security": "tls",
        "tlsSettings": {
          "certificates": [
            {
              "certificateFile": "/usr/local/etc/xray/cert.pem",
              "keyFile": "/usr/local/etc/xray/key.pem"
            }
          ]
        }
      },
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls"]
      }
    },
    {
      "port": $XRAY_PORT,
      "protocol": "vless",
      "settings": {
        "clients": [{ "id": "$UUID" }],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "ws",
        "security": "tls",
        "tlsSettings": {
          "certificates": [
            {
              "certificateFile": "/usr/local/etc/xray/cert.pem",
              "keyFile": "/usr/local/etc/xray/key.pem"
            }
          ]
        },
        "wsSettings": { "path": "/ws" }
      },
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls"]
      }
    }
  ],
  "outbounds": [
    { "protocol": "freedom", "tag": "direct" }
  ]
}
EOF

echo "=== 放行防火墙 ==="
ufw allow ${XRAY_PORT}/tcp
systemctl restart xray

echo ""
echo "=== 安装完成 ==="
echo "地址: $SERVER_IP"
echo "端口: $XRAY_PORT"
echo "UUID: $UUID"
echo ""
echo "客户端一键导入链接:"
echo ""
echo "XTLS Vision (推荐, 速度最快):"
echo "vless://$UUID@$SERVER_IP:$XRAY_PORT?encryption=none&security=tls&type=tcp&flow=xtls-rprx-vision#VPN-XTLS"
echo ""
echo "WebSocket (备用):"
echo "vless://$UUID@$SERVER_IP:$XRAY_PORT?encryption=none&security=tls&type=ws&path=%2Fws#VPN-WS"
