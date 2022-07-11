import nltk
import os
import time
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from tweepy.asynchronous import AsyncStreamingClient
from tweepy import StreamRule, Tweet


nltk.download("vader_lexicon")
analyser = SentimentIntensityAnalyzer()


class AnalysisStream(AsyncStreamingClient):
    def __init__(self, *args, uuid, **kwargs):
        super().__init__(*args, **kwargs)
        self.uuid = uuid

    async def on_tweet(self, tweet: Tweet):
        if tweet.lang != "en":
            return

        scores = analyser.polarity_scores(tweet.text)
        score = scores["compound"]

        eventDataPath = "{dir}/{uuid}".format(
            dir=os.environ["DATA_DIR"], uuid=self.uuid
        )

        if not os.path.exists(eventDataPath):
            os.mkdir(eventDataPath)

        sentimentTracker = os.path.abspath(
            "{dir}/sentiment.csv".format(dir=eventDataPath)
        )
        fileMethod = "a" if sentimentTracker else "w"

        with open(sentimentTracker, fileMethod) as file:
            timestamp = time.time()
            file.write("\n{score},{timestamp}".format(score=score, timestamp=timestamp))

        return await super().on_tweet(tweet)


async def analyse(uuid, query):
    client = AnalysisStream(os.environ["TWITTER_API_TOKEN"], uuid=uuid)

    await client.add_rules(
        StreamRule(
            value="{query} lang:en".format(query=query),
            tag="{uuid} - {query}".format(uuid=uuid, query=query),
        )
    )

    await client.filter(tweet_fields="lang")


def run(loop):
    loop.run_forever()
