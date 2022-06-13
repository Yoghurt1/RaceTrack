import { TweetV2, UserV2 } from 'twitter-api-v2'

export interface Tweet {
  tweet: TweetV2,
  author?: UserV2
}
