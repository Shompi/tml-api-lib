import { EventsAPI } from "./api/events.ts"
import { StatusEndpoints } from "./api/status.ts"
import { WebpagePosts } from "./api/webposts.ts"

export const TMLAPI = {
  status: StatusEndpoints,
  events: EventsAPI,
  webposts: WebpagePosts
}