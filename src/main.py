# aiohttpdemo_polls/main.py
from aiohttp import web
import ssl
from views import routes

if __name__ == '__main__':
    app = web.Application()
    app.add_routes(routes)

    # TODO switch the server to https mode with the code below when deploying.
    ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    ssl_context.load_cert_chain('../ssl/2_www.laurence042.com.crt', '../ssl/3_www.laurence042.com.key')
    web.run_app(app, host='localhost', port=9000,ssl_context=ssl_context)

    web.run_app(app)
