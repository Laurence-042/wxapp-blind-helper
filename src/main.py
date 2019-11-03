# aiohttpdemo_polls/main.py
from aiohttp import web

from views import routes

app = web.Application()
app.add_routes(routes)
web.run_app(app)