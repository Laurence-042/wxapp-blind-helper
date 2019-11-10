# aiohttpdemo_polls/main.py
import pathlib

from aiohttp import web
import ssl
from views import routes
import sys

BASE_PATH = pathlib.Path(__file__).parent.parent
sys.path.append(BASE_PATH / "src")
if __name__ == '__main__':
    app = web.Application()
    app.add_routes(routes)

    host = sys.argv[1]
    port = sys.argv[2]
    # TODO switch the server to https mode with the code below when deploying.
    ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    ssl_context.load_cert_chain(BASE_PATH / 'ssl/2_www.laurence042.com.crt',
                                BASE_PATH / 'ssl/3_www.laurence042.com.key')
    web.run_app(app, host=host, port=port, ssl_context=ssl_context)

    web.run_app(app)
