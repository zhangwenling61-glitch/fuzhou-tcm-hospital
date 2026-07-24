import os
import urllib.request
import urllib.parse
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

dest_dir = "/Users/degu/Desktop/福州中医院/首页"
os.makedirs(dest_dir, exist_ok=True)

# The 4 shortcut icons to download:
names = [
    "院内制剂.png",
    "药膳茶饮.png",
    "外治良方.png",
    "健康商城.png"
]

base_url = "https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/"

for name in names:
    url = base_url + urllib.parse.quote(name)
    dest_path = os.path.join(dest_dir, name)
    print(f"Downloading {url} -> {dest_path}")
    try:
        urllib.request.urlretrieve(url, dest_path)
        print(f"Success: {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
