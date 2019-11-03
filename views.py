import base64
import json
import time
from aiohttp import web
from util import get_rand_str, get_request_sign, post, parse_query_str_to_dict, get

routes = web.RouteTableDef()


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


@routes.get('/t2a')
async def text_to_audio(request):
    upper_req_params = parse_query_str_to_dict(request.query_string)

    upper_req_params["time_stamp"] = str(int(time.time()))
    upper_req_params["nonce_str"] =  get_rand_str(12)

    app_key = upper_req_params["app_key"]
    del upper_req_params["app_key"]

    upper_req_params["sign"] = get_request_sign(upper_req_params, app_key)

    res = json.loads(get("https://api.ai.qq.com/fcgi-bin/aai/aai_tts", upper_req_params))
    print(res)
    res["data"]["speech"] = base64.b64decode(res["data"]["speech"])
    return web.json_response(res)
