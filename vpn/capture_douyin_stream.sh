#!/usr/bin/env bash
# ============================================================
# 抖音直播推流地址捕获工具 (macOS + mitmproxy)
# 依赖: brew install mitmproxy
# ============================================================

set -e

# 获取本机局域网 IP (用于平板设置代理)
get_local_ip() {
    if command -v ipconfig &>/dev/null; then
        ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1"
    else
        ifconfig | grep -E 'inet ' | grep -v 127.0.0.1 | awk '{print $2}' | head -1
    fi
}

LOCAL_IP=$(get_local_ip)
PORT=8080

echo "============================================"
echo "  抖音推流地址捕获工具"
echo "============================================"
echo ""
echo "  步骤:"
echo "  1. 平板设置 WiFi 代理 -> $LOCAL_IP:$PORT"
echo "  2. 平板浏览器访问 http://mitm.it 安装证书"
echo "  3. 打开抖音直播伴侣, 点击开播"
echo "  4. 脚本会自动捕获推流地址"
echo "  5. 捕获后关闭平板直播, 用 OBS 推流"
echo ""
echo "  按 Ctrl+C 停止"
echo "============================================"
echo ""

# 检查 mitmproxy 是否安装
if ! command -v mitmdump &>/dev/null; then
    echo "[!] 未安装 mitmproxy, 安装中..."
    brew install mitmproxy
fi

# 启动 mitmdump
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
mitmdump -s "$SCRIPT_DIR/mitm_douyin.py" --listen-port $PORT --set block_global=false
