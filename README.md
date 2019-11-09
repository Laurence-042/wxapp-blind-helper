src目录为服务器代码，使用Python3编写，第三方库为aiohttp，用于处理http请求的
blind-helper目录为微信小程序代码，未和前端组合并

微信小程序的部分课上有讲，主要说明下服务端的代码 

| 文件名 | 作用 |
| ---- | ---- |
| main.py | 包含启动代码，不用过于在意 |
| views.py | 对request的处理函数，主要逻辑在这里 |
| util.py | 一些通用函数，比如生成腾讯AI的API的鉴权字段的函数之类的 |

```python
@routes.get('/test/{name}')
async def index(request):
    print(parse_query_str_to_dict(request.query_string))
    name = request.match_info['name']
    return web.Response(text='Hello Aiohttp!' + name)


@routes.post('/i2t')
async def img_to_text(request):
    data = await request.post()
    image = data['image'].file.read()
    with open("test", "wb") as f:
        f.write(image)
    image = base64.b64encode(image)
    app_id = data['app_id']
    app_key = data['app_key']

    time_stamp = str(int(time.time()))
    nonce_str = get_rand_str(12)
    session_id = str(int(time.time()))

    upper_req_params = {"app_id": app_id, "time_stamp": time_stamp, "nonce_str": nonce_str, "sign": "", "image": image,
                        "session_id": session_id}

    upper_req_params["sign"] = get_request_sign(upper_req_params, app_key)

    res = json.loads(post("https://api.ai.qq.com/fcgi-bin/vision/vision_imgtotext", upper_req_params))
    print(res)
    return web.json_response(res)
```

如果服务器运行于localhost:8000

访问localhost:8000/test/hello的请求会由index处理，`request.match_info['name']`会返回hello

访问localhost:8000/i2t的请求会由img_to_text处理，`await request.post()`会返回POST的data段