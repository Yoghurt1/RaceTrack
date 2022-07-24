import { inject, injectable } from 'inversify'
import { TweetSearchRecentV2Paginator, TwitterApiReadOnly, TwitterV2IncludesHelper } from 'twitter-api-v2'
import { Tweet } from '../interfaces/tweet'
import { TYPES } from '../types'

@injectable()
export class TwitterService {

  public constructor(
    @inject(TYPES.TwitterClient) private twitterClient: TwitterApiReadOnly
  ) { }

  public async getTimeline(query: string): Promise<Tweet[]> {
    const searchResponse: TweetSearchRecentV2Paginator = await this.twitterClient.v2.search(query, { expansions: 'author_id' })

    return this.mapToTweetList(searchResponse)
  }

  private mapToTweetList(searchResponse: TweetSearchRecentV2Paginator): Tweet[] {
    const helper: TwitterV2IncludesHelper = new TwitterV2IncludesHelper(searchResponse)

    return searchResponse.tweets.map((tweet) => {
      return {
        tweet: tweet,
        author: helper.author(tweet)
      }
    })
  }
}
