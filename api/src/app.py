import asyncio
import json
import nest_asyncio
import traceback
from werkzeug.datastructures import ImmutableMultiDict
from concurrent.futures import ThreadPoolExecutor
from flask import Flask, jsonify, request
from validators.chartDataRequest import ChartDataRequest
from validators.stopAnalysisRequest import StopAnalysisRequest
from validators.analyseRequest import AnalyseRequest
from lib.analyse import analyse, run
from lib.messages import messages
from lib.sentiment import sentiment
from lib.chartData import generateChartData, getEventData

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


@app.get("/messages/<uuid>")
async def getMessages(uuid):
    try:
        return (json.dumps(messages(uuid)), 200)
    except Exception as e:
        app.logger.error(e)
        return ("", 500)


@app.get("/sentiment/<uuid>")
async def getSentiment(uuid):
    try:
        return (json.dumps(sentiment(uuid)), 200)
    except Exception as e:
        app.logger.error(e)
        return ("", 500)


@app.get("/classes/<uuid>")
async def getClasses(uuid):
    try:
        return (jsonify(sorted(getEventData(uuid, "Class", True, str))), 200)
    except Exception as e:
        app.logger.error(e)
        return ("", 500)


@app.get("/car-numbers/<uuid>")
async def getCarNums(uuid):
    try:
        return (jsonify(sorted(getEventData(uuid, "Num", True, str))), 200)
    except Exception as e:
        app.logger.error(e)
        return ("", 500)


@app.post("/chart")
async def getChartData():
    form = ChartDataRequest(ImmutableMultiDict(request.json))

    if form.validate():
        try:
            return (jsonify(generateChartData(form)), 200)
        except Exception as e:
            app.logger.error(e)
            app.logger.error(traceback.format_exc())
            return ("", 500)
    else:
        return (form.errors, 400)


app.run(host="0.0.0.0", port=3001, debug=True)
