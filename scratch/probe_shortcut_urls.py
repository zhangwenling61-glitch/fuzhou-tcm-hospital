import urllib.request
import urllib.parse
import ssl

context = ssl._create_unverified_context()

def check_url(url):
    try:
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req, context=context) as resp:
            return resp.status
    except Exception as e:
        return str(e)

# test 1: 福州中医院
name1 = "健康商城.png"
url1 = f"https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/{urllib.parse.quote(name1)}"
print("福州中医院:", url1, "->", check_url(url1))

# test 2: 福州中医医院
name2_utf8 = urllib.parse.quote("福州中医医院")
url2_correct = f"https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/{name2_utf8}/%E9%A6%96%E9%A1%B5/{urllib.parse.quote(name1)}"
print("福州中医医院:", url2_correct, "->", check_url(url2_correct))
