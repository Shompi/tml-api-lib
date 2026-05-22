import { CoachingAPI } from "./api/coaching.ts"
import { EventsAPI } from "./api/events.ts"
import { RankingsAPI } from "./api/rankings.ts"
import { StatusAPI } from "./api/status.ts"
import { WebpagePostsAPI } from "./api/webposts.ts"

export const TMLAPI = {
  status: StatusAPI,
  events: EventsAPI,
  webposts: WebpagePostsAPI,
  ranking: RankingsAPI,
  coaching: CoachingAPI,
}