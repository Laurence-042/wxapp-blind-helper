import hashlib
import secrets
import string
import requests
from urllib.parse import quote, urlencode


def get_request_sign(param, app_key):
    # 字典升序排序
    sorted_key = sorted(param)

    # 拼按URL键值对
    sorted_param_strs = []
    for key in sorted_key:
        value = param[key]
        if value:
            quoted = quote(value, 'utf-8')
            sorted_param_strs.append(key + "=" + quoted)

    # 拼接app_key
    sorted_param_strs.append("app_key=" + str(app_key))

    request_str = '&'.join(sorted_param_strs)
    request_str = request_str.encode("UTF8")

    # MD5运算 + 转换大写，得到请求签名
    m = hashlib.md5()
    m.update(request_str)

    sign = str(m.hexdigest()).upper()
    return sign


def get_rand_str(length):
    return ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(length))


def post(url, data):
    print("Posting {0} to {1}".format(data, url))
    r = requests.post(url, data=data)
    return r.text


def get(url, param):
    print("Getting {0} with {1}".format(url, param))
    r = requests.get(url, param)
    return r.text


def parse_query_str_to_dict(query_str):
    res = {}
    if not query_str:
        return res
    query_str = query_str.split('&')

    for p in query_str:
        k, v = p.split('=')[:2]
        res[k] = v
    return res
