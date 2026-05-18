import { API_URL } from "./helpers"

type APIStatusOKResponse = {
  /** Custom api message */
  message: string
  /** Should always be **418**, do not expect a 200 response */
  code: 418
  /** Date formated string */
  date: string

  data: {
    /** The uptime of the API in milliseconds */
    uptime: number
    node_version: string
    bun_version: string
    platform: string
    arch: string
    memory_usage: {
      /** rss in bytes */
      rss: number
      /** The amount of bytes of memory used */
      heapTotal: number
      /** The amount of bytes of memory used */
      heapUsed: number
      /** The amount of external memory used */
      external: number
      /** The amount of array buffers currently allocated */
      arrayBuffers: number
    }
  }
}

export const StatusEndpoints = {
  /** Status endpoint of the API, it should always return a **418** response code */
  get: async () => {
    const response = await fetch(`${API_URL}/api`, { method: "GET" })

    const data = await response.json()

    return data as APIStatusOKResponse
  }
}