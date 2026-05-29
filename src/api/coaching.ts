import { APIError } from "../extends/api_errors.ts";
import { API_URL } from "./helpers.ts";

export type APICoach = {
  id: string
  name: string
  about_me: string | null
  is_active: boolean
}

export type APICoachCreationData = {
  name: string
  about_me?: string | null
  is_active?: boolean
}

export type APICoachUpdateData = Partial<Omit<APICoach, "id">>

export type APICoachSocial = {
  id: string
  /** The ID of the coach this social network belongs to */
  coach_id: string
  /** The url to the profile of the coach for this social network */
  profile_url: string
}

export type APISocialCreationData = {
  coach_id: string
  profile_url: string
}

export type APIStudent = {
  /** Discord ID or unique identifier for this student. */
  id: string
  name: string
}

export type APIStudentCreationData = APIStudent

export type APICoachingTicket = {
  id: number,
  hash: string
  student_id: string
  coach_id: string | null
  ingame_name: string
  preferred_games: string[]
  target_skills: string[]
  comment: string | null
  is_open: boolean
  is_claimed: boolean
  is_deleted: boolean
  created_at: string
  discord_channel: string | null
  discord_message: string | null
}

export type APICoachingTicketCreationData = Partial<Omit<APICoachingTicket, "id">> & {
  student_id: string
  ingame_name: string
}

export type APICoachingTicketPatchData = Partial<Omit<APICoachingTicket, "id">>

const Routes = {
  Coach: {
    getAll: `${API_URL}/api/coaching/coach` as const,
    get: (id: string) => `${API_URL}/api/coaching/coach/${id}` as const,
    getTickets: (coach_id: string) => `${API_URL}/api/coaching/coach/${coach_id}/tickets` as const,
    /** This endpoint needs authentication */
    create: `${API_URL}/api/coaching/coach` as const,
    /** This endpoint needs authentication */
    update: (id: string) => `${API_URL}/api/coaching/coach/${id}` as const,
    /** This endpoint needs authentication */
    delete: (id: string) => `${API_URL}/api/coaching/coach/${id}` as const,
  },
  Student: {
    get: (id: string) => `${API_URL}/api/coaching/students/${id}` as const,
    tickets: (id: string) => `${API_URL}/api/coaching/students/${id}/tickets` as const,
    /** This endpoint needs authentication */
    create: `${API_URL}/api/coaching/students` as const,
  },
  Tickets: {
    get: (id: string) => `${API_URL}/api/coaching/tickets/${id}` as const,
    /** This endpoint needs authentication */
    create: `${API_URL}/api/coaching/tickets` as const,
    /** This endpoint needs authentication */
    update: (id: string) => `${API_URL}/api/coaching/tickets/${id}` as const,
    /** This endpoint needs authentication */
    claim: (id: string, coach_id: string) => `${API_URL}/api/coaching/tickets/${id}/claim?coachId=${coach_id}` as const,
    /** This endpoint needs authentication */
    delete: (id: string) => `${API_URL}/api/coaching/tickets/${id}` as const,
  },
}

export const CoachingAPI = {
  coaches: {
    getAll: async () => {
      const response = await fetch(Routes.Coach.getAll, { method: "GET" })

      const data = await response.json() as APICoach[]

      return data
    },
    get: async (id: string) => {

      if (!id) throw new Error("You must provide a coach id to this function.")

      const response = await fetch(Routes.Coach.get(id), { method: "GET" })

      const data = await response.json() as APICoach

      return data
    },
    getTickets: async (coach_id: string) => {

      if (!coach_id) throw new Error("You must provide a coach id to this function.")

      const response = await fetch(Routes.Coach.getTickets(coach_id), { method: "GET" })

      const data = await response.json() as APICoachingTicket[]

      return data
    },
    create: async (token: string, data: APICoachCreationData) => {

      if (!token) throw new Error("You must provide an authorization token to this function.")

      const response = await fetch(Routes.Coach.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(data)
      })

      if (response.status !== 201) {
        const data = await response.json().catch(() => ({ message: "Unknown error" })) as { message: string }

        throw new APIError({
          code: response.status,
          api_message: data.message ?? "Unknown error",
          path: Routes.Coach.create,
          method: "POST"
        }, "The API responded with an error.")
      }

      return await response.json() as Promise<APICoach>
    },
    update: async (token: string, id: string, data: APICoachUpdateData) => {

      if (!token) throw new Error("You must provide an authorization token to this function.")
      if (!id) throw new Error("You must provide a coach id to this function.")

      const response = await fetch(Routes.Coach.update(id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(data)
      })

      if (response.status !== 200) {
        const data = await response.json().catch(() => ({ message: "Unknown error" })) as { message: string }

        throw new APIError({
          code: response.status,
          api_message: data.message ?? "Unknown error",
          path: Routes.Coach.update(id),
          method: "PATCH"
        }, "The API responded with an error.")
      }

      return await response.json() as Promise<APICoach>
    },
    /** This function will return either a boolean<true> result or throw an error. */
    delete: async (token: string, id: string) => {

      if (!token) throw new Error("You must provide an authorization token to this function.")
      if (!id) throw new Error("You must provide a coach id to this function.")

      const response = await fetch(Routes.Coach.delete(id), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      })

      if (response.status !== 200) {
        const data = await response.json().catch(() => ({ message: "Unknown error" })) as { message: string }

        throw new APIError({
          code: response.status,
          api_message: data.message ?? "Unknown error",
          path: Routes.Coach.delete(id),
          method: "DELETE"
        }, "The API responded with an error.")
      }

      return true
    },
  },
  students: {
    get: async (id: string) => {

      if (!id) throw new Error("You must provide a student id to this function.")

      const response = await fetch(Routes.Student.get(id), { method: "GET" })

      return await response.json() as Promise<APIStudent>
    },
    create: async (token: string, data: APIStudentCreationData) => {

      if (!token) throw new Error("You must provide an authorization token to this function.")

      const response = await fetch(Routes.Student.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(data)
      })

      if (response.status !== 201) {
        const data = await response.json().catch(() => ({ message: "Unknown error" })) as { message: string }

        throw new APIError({
          code: response.status,
          api_message: data.message ?? "Unknown error",
          path: Routes.Student.create,
          method: "POST"
        }, "The API responded with an error.")
      }

      return await response.json() as Promise<APIStudent>
    },
    tickets: async (id: string) => {

      if (!id) throw new Error("You must provide a student id to this function.")

      const response = await fetch(Routes.Student.tickets(id), { method: "GET" })

      return await response.json() as Promise<{
        student: APIStudent,
        tickets: APICoachingTicket[]
      }>
    }
  },
  tickets: {
    get: async (id: string) => {

      if (!id) throw new Error("You must provide a ticket id to this function.")

      const response = await fetch(Routes.Tickets.get(id), { method: "GET" })

      return await response.json() as Promise<APICoachingTicket>
    },
    create: async (token: string, data: APICoachingTicketCreationData) => {

      if (!token) throw new Error("You must provide an authorization token to this function.")

      const response = await fetch(Routes.Tickets.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(data)
      })

      if (response.status !== 201) {
        const data = await response.json().catch(() => ({ message: "Unknown error" })) as { message: string }

        throw new APIError({
          code: response.status,
          api_message: data.message ?? "Unknown error",
          path: Routes.Tickets.create,
          method: "POST"
        }, "The API responded with an error.")
      }

      return await response.json() as Promise<APICoachingTicket>
    },
    update: async (token: string, id: string, data: APICoachingTicketPatchData) => {

      if (!token) throw new Error("You must provide an authorization token to this function.")
      if (!id) throw new Error("You must provide a ticket id to this function.")

      const response = await fetch(Routes.Tickets.update(id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(data)
      })

      if (response.status !== 200) {
        const data = await response.json().catch(() => ({ message: "Unknown error" })) as { message: string }

        throw new APIError({
          code: response.status,
          api_message: data.message ?? "Unknown error",
          path: Routes.Tickets.update(id),
          method: "PATCH"
        }, "The API responded with an error.")
      }

      return await response.json() as Promise<APICoachingTicket>
    },
    delete: async (token: string, id: string) => {

      if (!token) throw new Error("You must provide an authorization token to this function.")
      if (!id) throw new Error("You must provide a ticket id to this function.")

      const response = await fetch(Routes.Tickets.delete(id), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      })

      if (response.status !== 200) {
        const data = await response.json().catch(() => ({ message: "Unknown error" })) as { message: string }

        throw new APIError({
          code: response.status,
          api_message: data.message ?? "Unknown error",
          path: Routes.Tickets.delete(id),
          method: "DELETE"
        }, "The API responded with an error.")
      }

      return await response.json() as Promise<APICoachingTicket>
    },
    claim: async (token: string, id: string, coach_id: string) => {

      if (!token) throw new Error("You must provide an authorization token to this function.")
      if (!id) throw new Error("You must provide a ticket id to this function.")
      if (!coach_id) throw new Error("You must provide a coach id to this function.")

      const response = await fetch(Routes.Tickets.claim(id, coach_id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      })

      if (response.status !== 200) {
        const data = await response.json().catch(() => ({ message: "Unknown error" })) as { message: string }

        throw new APIError({
          code: response.status,
          api_message: data.message ?? "Unknown error",
          path: Routes.Tickets.claim(id, coach_id),
          method: "POST"
        }, "The API responded with an error.")
      }
      return await response.json() as Promise<APICoachingTicket>
    }
  }
}
