import urllib.request
import urllib.parse
import ssl

context = ssl._create_unverified_context()

# We want to check different variations of "药膳茶饮" in URL encoding
variations = [
    "药膳茶饮.png",
    "药膳茶饮",
]

base_url = "https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/"

for var in variations:
    url = base_url + urllib.parse.quote(var)
    try:
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req, context=context) as resp:
            print(f"Variation '{var}': {url} -> {resp.status}")
    except Exception as e:
        print(f"Variation '{var}': {url} -> {e}")
