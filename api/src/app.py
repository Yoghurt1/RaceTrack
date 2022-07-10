import asyncio
import nest_asyncio
from werkzeug.datastructures import ImmutableMultiDict
from concurrent.futures import ThreadPoolExecutor
from flask import Flask, request
from validators.stopAnalysisRequest import StopAnalysisRequest
from validators.analyseRequest import AnalyseRequest
from lib.analyse import analyse, run

nest_asyncio.apply()

app = Flask(__name__)

executor = ThreadPoolExecutor(2)

mainLoop = asyncio.get_event_loop()
loops = {}


@app.post("/analyse")
async def analyseRoute():
    form = AnalyseRequest(ImmutableMultiDict(request.json))

    if form.validate():
        try:
            loop = asyncio.new_event_loop()

            loop.create_task(analyse(form.uuid.data, form.query.data))
            loop.run_in_executor(executor, run, loop)

            loops[form.uuid.data] = loop
        except Exception as e:
            app.logger.error(e)
            return ("", 500)
    else:
        return (form.errors, 400)

    return ("", 200)


@app.post("/stop-analysis")
async def stopAnalysis():
    form = StopAnalysisRequest(ImmutableMultiDict(request.json))

    if form.validate():
        try:
            runningLoop = loops[form.uuid.data]
            runningLoop.stop()
        except Exception as e:
            app.logger.error(e)
            return ("", 500)
    else:
        return (form.errors, 400)

    return ("", 200)


app.run(host="0.0.0.0", port=3001, debug=True)
