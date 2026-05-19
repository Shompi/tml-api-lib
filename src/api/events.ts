import { APIError } from "../extends/api_errors.ts"
import { API_URL, buildUrl } from "./helpers.ts"

type APIErrorBase = {
  message: string
}

type APIEvent = {
  /** UUIDV4 string */
  readonly id: string,
  /** El nombre del evento */
  name: string
  /** El lugar del evento */
  location: string | null
  /** El tipo de lugar del evento (online, discord, irl) */
  location_type: string | null
  /** El juego principal del evento */
  game: string | null
  /**URL del post en la página */
  post_url: string | null
  /** Si el evento es externo */
  external: boolean
  /** URL externa del evento */
  external_url: string | null
  /** La fecha del evento */
  date: string
}

type EventGetQueryParams = {
  limit?: number
  offset?: number
}

type EventCreationData = {
  /** String between 1 and 100 characters. */
  name: string

  /**
   * Location of this event.
   * The api defaults this value to null if no location is provided
   * @default null
   */
  location?: string | null

  /**
   * Location type of this event.
   * The api defaults this value to null if no location type is provided
   * @default null
   */
  location_type?: "online" | "discord" | "irl" | null

  /**
   * Date of this event, has to be ISO 8601.
   * @required
   */
  date: string

  /**
   * Game of this event.
   * The api defaults this value to null if no game is provided
   * @default null
   */
  game: "tec" | "tetrio" | "classictetris" | "cultris" | "irl" | "cultris2" | "ppt" | "ppt2" | "tgm1" | "tgm2" | "tgm3" | "tgm4"

  /**
   * Post URL of this event.
   * The api defaults this value to null if no post url is provided
   * @default null
   */
  post_url?: string | null

  /**
   * External event.
   * The api defaults this value to false if no external is provided
   * @default false
   */
  external: boolean

  /**
   * External URL of this event.
   * The api defaults this value to null if no external url is provided
   * @default null
   */
  external_url?: string | null
}

type EventPatchData = Partial<EventCreationData>

const EventsEndpoints = {
  getAll: (params?: EventGetQueryParams) => `${API_URL}/api/events${buildUrl("", params)}` as const,
  getOne: (eventId: string) => `${API_URL}/api/events/${eventId}` as const,
  create: `${API_URL}/api/events` as const,
  patch: (eventId: string) => `${API_URL}/api/events/${eventId}` as const,
  delete: (eventId: string) => `${API_URL}/api/events/${eventId}` as const
}

export const EventsAPI = {
  /** Status endpoint of the API, it should always return a **418** response code */
  getAll: async (params?: EventGetQueryParams) => {
    return await fetch(EventsEndpoints.getAll(params), { method: "GET" }).then(res => res.json()) as Promise<APIEvent[]>
  },

  getOne: async (eventId: string) => {
    return await fetch(EventsEndpoints.getOne(eventId), { method: "GET" }).then(res => res.json()) as Promise<APIEvent>
  },

  create: async (token: string, data: EventCreationData): Promise<APIEvent> => {

    const path = EventsEndpoints.create

    if (!token) throw new Error("You must provide an authorization token to this function.")

    const response = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(data)
    })

    if (response.status !== 201) {
      const data = await response.json().catch(() => ({ message: "Unknown error" })) as APIErrorBase

      throw new APIError({
        code: response.status,
        api_message: data.message ?? "Unknown error",
        path: EventsEndpoints.create,
        method: "POST"
      }, "The API responded with an error.")
    }

    return await response.json() as Promise<APIEvent>
  },
  edit: async (token: string, eventId: string, data: EventPatchData): Promise<APIEvent> => {

    if (!token) throw new Error("You must provide an authorization token to this function.")
    if (!eventId) throw new Error("You must provide an event id to this function.")

    const response = await fetch(`${EventsEndpoints.patch(eventId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(data)
    })

    return await response.json() as Promise<APIEvent>
  },
  /** This function returns the deleted event */
  delete: async (token: string, eventId: string) => {

    if (!token) throw new Error("You must provide an authorization token to this function.")
    if (!eventId) throw new Error("You must provide an event id to this function.")

    const response = await fetch(`${EventsEndpoints.delete(eventId)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })

    return await response.json() as Promise<APIEvent>
  }
}