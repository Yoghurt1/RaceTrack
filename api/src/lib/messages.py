import json
import os
import time


def messages(uuid):
    eventDir = "{data}/{uuid}/".format(data=os.environ["DATA_DIR"], uuid=uuid)

    ### Testing purposes
    startTime = 0
    with open(eventDir + "manifest.json", "r") as file:
        manifest = json.loads(file.readlines()[0])
        startTime = manifest["startTime"]
    earliestTimestamp = startTime + (24 * 3600) - 3600

    # currentTimestamp = time.time()
    # earliestTimestamp = currentTimestamp - 600

    response = []

    with os.scandir(eventDir) as it:
        for entry in it:
            if shouldReadFile(entry, earliestTimestamp):
                file = open(eventDir + entry.name, "r")

                jsonMessages = list(json.loads(file.readlines()[0])["messages"])
                response.append(jsonMessages)
                file.close()

    return [message for messages in response for message in messages]


def shouldReadFile(file, timeRange):
    timestamp = file.name[:11]
    if not (file.name.startswith("manifest") or file.name.startswith("sentiment")):
        if file.is_file() and int(timestamp) > timeRange:
            return True

    return False
