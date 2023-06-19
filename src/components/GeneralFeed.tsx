import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'
import PostFeed from './PostFeed'

const GeneralFeed = async () => {
  const posts = await db.post.findMany({
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  })

  return <PostFeed initialPosts={posts} />
}

export default GeneralFeed
