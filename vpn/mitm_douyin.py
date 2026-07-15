"""
mitmproxy addon: 捕获抖音直播推流地址 (RTMP URL + Stream Key)
用法: mitmdump -s mitm_douyin.py
"""
import json
import re
import sys
from mitmproxy import http

RTMP_PATTERN = re.compile(r'https?://[^"\'<>]+\.(?:douyin|tiktok|byte)[^"\'<>]*')
STREAM_PATTERN = re.compile(r'(rtmp[s]?://[^"\'\s<>]+)')
PUSH_URLS = set()


def response(flow: http.HTTPFlow):
    url = flow.request.pretty_url

    # 只关注抖音相关请求
    if not any(k in url for k in ('douyin', 'tiktok', 'byte', 'snssdk')):
        return

    try:
        text = flow.response.get_text(strict=False)
    except Exception:
        return
    if not text:
        return

    # 方式1: 直接在响应文本中搜索 RTMP URL
    for m in STREAM_PATTERN.finditer(text):
        rtmp = m.group(1)
        if rtmp not in PUSH_URLS:
            PUSH_URLS.add(rtmp)
            print(f"\n{'='*60}")
            print(f"  RTMP 推流地址: {rtmp}")
            # 尝试分割出服务器和流密钥
            if '/stage/' in rtmp:
                parts = rtmp.split('/stage/')
                if len(parts) == 2:
                    server = parts[0] + '/stage/'
                    key = parts[1]
                    print(f"  服务器: {server}")
                    print(f"  串流密钥: {key}")
            print(f"{'='*60}\n")

    # 方式2: 解析 JSON 响应体递归查找
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        return

    def find_rtmp(obj, path=''):
        if isinstance(obj, dict):
            for k, v in obj.items():
                find_rtmp(v, f"{path}.{k}")
        elif isinstance(obj, list):
            for i, v in enumerate(obj):
                find_rtmp(v, f"{path}[{i}]")
        elif isinstance(obj, str) and obj.startswith('rtmp'):
            if obj not in PUSH_URLS:
                PUSH_URLS.add(obj)
                print(f"\n{'='*60}")
                print(f"  [JSON] {path}")
                print(f"  RTMP 推流地址: {obj}")
                if '/stage/' in obj:
                    parts = obj.split('/stage/')
                    if len(parts) == 2:
                        print(f"  服务器: {parts[0]}/stage/")
                        print(f"  串流密钥: {parts[1]}")
                print(f"{'='*60}\n")

    find_rtmp(data)
