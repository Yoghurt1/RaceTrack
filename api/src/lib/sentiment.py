import os
import datetime
import pandas as pd


def sentiment(uuid):
    filePath = "{dataDir}/{uuid}/sentiment.csv".format(
        dataDir=os.environ["DATA_DIR"], uuid=uuid
    )

    sentiment = pd.read_csv(filePath, header=None)

    response = []

    for _, row in sentiment.iterrows():
        date = datetime.datetime.utcfromtimestamp(row[1])
        response.append({"sentiment": row[0], "time": date.isoformat()})

    return response
