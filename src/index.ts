import { EventsAPI } from "./api/events"
import { StatusEndpoints } from "./api/status"

export const TMLAPI = {
  status: StatusEndpoints,
  events: EventsAPI,
}