import { EventsAPI } from "./api/events"
import { StatusEndpoints } from "./api/status"
import { WebpagePosts } from "./api/webposts"

export const TMLAPI = {
  status: StatusEndpoints,
  events: EventsAPI,
  webposts: WebpagePosts
}