import json
import os
import logging
from numpy import convolve, nanmax, nanmean, nanmedian, nanmin, ones
import pandas as pd
from collections import defaultdict


def getEventData(uuid: str, col: str, unique: bool, dtype):
    eventDir = "{data}/{uuid}/".format(data=os.environ["DATA_DIR"], uuid=uuid)

    columnIndex = 0

    with open(eventDir + "manifest.json", "r") as file:
        manifest = json.loads(file.readlines()[0])
        for idx, column in enumerate(manifest["colSpec"]):
            if col == column[0]:
                columnIndex = idx

    response = []

    with os.scandir(eventDir) as it:
        for entry in it:
            if "i" not in entry.name:
                file = open(eventDir + entry.name, "r")

                try:
                    jsonCarMessages = json.loads(file.readlines()[0])["cars"]
                    for message in jsonCarMessages:
                        if ("change" not in message) and isinstance(
                            message[columnIndex], dtype
                        ):
                            response.append(message[columnIndex])
                except KeyError:
                    continue
                finally:
                    file.close()

    return list(set(response)) if unique else response


def getChartData(
    eventDir: str,
    col: str,
    dtype,
    dataFunc,
    group,
    groupDtype,
    classCompare=None,
    car1=None,
    car2=None,
):
    columnIndex = 0
    groupIndex = 0
    classIndex = 0
    carNumIndex = 0

    with open(eventDir + "manifest.json", "r") as file:
        manifest = json.loads(file.readlines()[0])
        for idx, column in enumerate(manifest["colSpec"]):
            if col == column[0]:
                columnIndex = idx
            if group == column[0]:
                groupIndex = idx
            if "Class" == column[0]:
                classIndex = idx
            if "Num" == column[0]:
                carNumIndex = idx

    response = []

    with os.scandir(eventDir) as it:
        for entry in sorted(it, key=lambda x: x.name):
            if "i" not in entry.name:
                file = open(eventDir + entry.name, "r")

                try:
                    jsonCarMessages = json.loads(file.readlines()[0])["cars"]
                    for message in jsonCarMessages:
                        if classCompare == None and car1 == None and car2 == None:
                            if shouldUseMessage(
                                message, dtype, columnIndex, groupIndex
                            ):
                                response.append(
                                    {message[columnIndex]: message[groupIndex]}
                                )

                        if classCompare != None:
                            if (
                                shouldUseMessage(
                                    message, dtype, columnIndex, groupIndex
                                )
                                and message[classIndex] == classCompare
                            ):
                                response.append(
                                    {
                                        message[carNumIndex]: {
                                            message[columnIndex]: message[groupIndex]
                                        }
                                    }
                                )

                        if car1 != None:
                            if (
                                shouldUseMessage(
                                    message, dtype, columnIndex, groupIndex
                                )
                                and message[carNumIndex] == car1
                            ):
                                response.append(
                                    {
                                        message[carNumIndex]: {
                                            message[columnIndex]: message[groupIndex]
                                        }
                                    }
                                )

                        if car2 != None:
                            if (
                                shouldUseMessage(
                                    message, dtype, columnIndex, groupIndex
                                )
                                and message[carNumIndex] == car2
                            ):
                                response.append(
                                    {
                                        message[carNumIndex]: {
                                            message[columnIndex]: message[groupIndex]
                                        }
                                    }
                                )

                except KeyError:
                    continue
                finally:
                    file.close()

    responseDict = defaultdict(list)

    for dictionary in response:
        for key, value in dictionary.items():
            responseDict[key].append(value)

    formattedResponse = {}

    for dictionary in {k: v for k, v in sorted(responseDict.items())}.items():
        if isinstance(dictionary[1], list):
            if isinstance(dictionary[1][0], dict):
                values = [
                    {"x": k, "y": v if not isinstance(v, list) else v[0]}
                    for d in dictionary[1]
                    for k, v in d.items()
                ]

                df = pd.DataFrame.from_dict(values)

                if groupDtype == "delta" or groupDtype == "time":
                    df["y"] = df["y"].apply(pd.to_timedelta, unit="ms", errors="coerce")
                else:
                    df["y"] = df["y"].apply(pd.to_numeric, errors="coerce")

                df.dropna()

                formattedResponse[dictionary[0]] = [
                    {"x": x, "y": y} for x, y in dataFunc(df).items()
                ]
            else:
                values = []
                try:
                    values = [
                        time[0] if isinstance(time[0], float) else 0
                        for time in dictionary[1]
                    ]
                except Exception:
                    values = [
                        time if isinstance(time, float) else 0 for time in dictionary[1]
                    ]
                formattedResponse[dictionary[0]] = dataFunc(values)
        else:
            formattedResponse[dictionary[0]] = dataFunc(dictionary[1])

    return formattedResponse


def generateChartData(form):
    eventDir = "{data}/{uuid}/".format(data=os.environ["DATA_DIR"], uuid=form.uuid.data)

    with open(eventDir + "manifest.json", "r") as file:
        manifest = json.loads(file.readlines()[0])

        xType = getAxisDType(manifest["colSpec"], form.xAxis.data)
        yType = getAxisDType(manifest["colSpec"], form.yAxis.data)

        data = pd.DataFrame()

        if not any(
            [
                form.classCompare.data != None,
                form.carCompare1.data != None,
                form.carCompare2.data != None,
            ]
        ):
            data = pd.DataFrame(
                list(
                    getChartData(
                        eventDir,
                        form.xAxis.data,
                        xType,
                        getNpDataFunc(form.yFunction.data),
                        form.yAxis.data,
                        yType,
                        form.classCompare.data,
                        form.carCompare1.data,
                        form.carCompare2.data,
                    ).items()
                ),
                columns=["x", "y"],
            )

            response = [{"y": row["y"], "x": row["x"]} for _, row in data.iterrows()]

            return response
        else:
            return getChartData(
                eventDir,
                form.xAxis.data,
                xType,
                getPdDataFunc(form.yFunction.data),
                form.yAxis.data,
                yType,
                form.classCompare.data,
                form.carCompare1.data,
                form.carCompare2.data,
            )


def getNpDataFunc(function):
    if function == "Average":
        return nanmean
    elif function == "Rolling average":
        return rollingAverage
    elif function == "Max":
        return nanmax
    elif function == "Median":
        return nanmedian
    elif function == "Min":
        return nanmin
    elif not function:
        return noneFunc


def getPdDataFunc(function):
    if function == "Average":
        return mean
    elif function == "Rolling average":
        return pdRollingAvg
    elif function == "Max":
        return pdMax
    elif function == "Median":
        return median
    elif function == "Min":
        return pdMin
    elif not function:
        return noneFunc


def mean(df: pd.DataFrame):
    return df.groupby("x")["y"].mean(numeric_only=False).dropna()


def pdMax(df: pd.DataFrame):
    return df.groupby("x")["y"].max(numeric_only=False).dropna()


def median(df: pd.DataFrame):
    return df.groupby("x")["y"].median(numeric_only=False).dropna()


def pdMin(df: pd.DataFrame):
    return df.groupby("x")["y"].min(numeric_only=False).dropna()


def pdRollingAvg(df: pd.DataFrame):
    return df.groupby("x")["y"].rolling(3).dropna()


def noneFunc(values):
    return values


def rollingAverage(values):
    return nanmean(convolve(values, ones(3), "same") / values)


def getAxisDType(colSpec, column):
    for col in colSpec:
        if column == col[0]:
            if col[1] == "numeric":
                return int
            elif col[1] == "text":
                return str
            elif col[1] == "delta":
                return float
            elif col[1] == "time":
                return list


def shouldUseMessage(message, dtype, columnIndex, groupIndex):
    if (
        ("change" not in message)
        and isinstance(message[columnIndex], dtype)
        and not isinstance(message[groupIndex], dict)
    ):
        return True

    return False
