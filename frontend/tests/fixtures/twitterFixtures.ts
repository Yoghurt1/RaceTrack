import * as sinon from 'sinon'
import { TweetV2, TwitterApiReadOnly, UserV2 } from 'twitter-api-v2'
import { Tweet } from '../../src/interfaces/tweet'

export function generateTweetV2(): TweetV2 {
  return {
    id: '1',
    text: 'some tweet text',
    author_id: '1'
  }
}

export function generateUserV2(): UserV2 {
  return {
    id: '1',
    name: 'name',
    username: 'username'
  }
}

export function generateTweet(): Tweet {
  return {
    tweet: generateTweetV2(),
    author: generateUserV2()
  }
}

export function generateTwitterClient(): TwitterApiReadOnly {
  return <any> {
    v2: {
      search: sinon.stub().callsFake(() => { return { tweets: [generateTweetV2()] } })
    }
  }
}
