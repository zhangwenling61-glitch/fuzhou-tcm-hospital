import os
import urllib.request
import urllib.parse
import ssl

# Globally disable SSL certificate verification
ssl._create_default_https_context = ssl._create_unverified_context

dest_dir = "/Users/degu/Desktop/福州中医院/首页"
os.makedirs(dest_dir, exist_ok=True)

# The 3 icons to download:
icons_to_download = [
    ("在线问诊.png", "https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/%E5%9C%A8%E7%BA%BF%E9%97%AE%E8%AF%8A.png"),
    ("续方申请.png", "https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/%E7%BB%AD%E6%96%B9%E7%94%B3%E8%AF%B7.png"),
    ("预约挂号.png", "https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/%E9%A2%84%E7%BA%A6%E6%8C%82%E5%8F%B7.png")
]

for name, url in icons_to_download:
    dest_path = os.path.join(dest_dir, name)
    print(f"Downloading {url} -> {dest_path}")
    try:
        urllib.request.urlretrieve(url, dest_path)
        print(f"Success: {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
