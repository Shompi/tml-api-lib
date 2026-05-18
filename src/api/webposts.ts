import { APIError } from "../extends/api_errors"
import { API_URL, buildUrl } from "./helpers"

type PostLanguages = "es" | "en" | "fr" | "de" | "it" | "pt" | "ru" | "zh" | "ja" | "ko"
type TetoPiece = "T" | "O" | "L" | "J" | "Z" | "S" | "I"
type APIWebpagePost = {
  /** UUID V7 */
  readonly id: string
  slug: string | null
  /**
   * The title of the post
   * @maxlength 255 characters
   */
  title: string | null
  /**
   * @maxlength 1000 characters
   */
  text: string

  image_id: string | null
  category: string | null
  published_at: string
  date_label: string
  banner_principal: boolean
  piece: TetoPiece
  /**
   * @maxlength 16.000 characters
   */
  markdown_content: string
  lateral_noticias: boolean
  /**
   * API defaults this to "es"
   * @default "es"
   */
  language: PostLanguages
}

type APIWebpagePostCreationData = {
  text: string
  /** Date formatted string */
  published_at: string
  markdown_content: string
  date_label: string
  slug?: string | null
  title?: string | null
  image_id?: string | null
  category?: string | null
  banner_principal?: boolean
  piece?: TetoPiece
  lateral_noticias?: boolean
  /**
   * API defaults this to "es"
   * @default "es"
   */
  language?: PostLanguages
}

type APIWebpageEditData = Partial<Omit<APIWebpagePostCreationData, "id">>
type QueryParams = {
  limit?: number
  offset?: number
  postId?: string

}

const Routes = {
  getAll: (params?: QueryParams) => `${API_URL}/api/posts${buildUrl("", params)}` as const,
  create: `${API_URL}/api/posts` as const,
  edit: (id: string) => `${API_URL}/api/posts/${id}` as const,
  delete: (id: string) => `${API_URL}/api/posts/${id}` as const
}

export const WebpagePosts = {
  get: async (params?: QueryParams) => await fetch(Routes.getAll(params), { method: "GET" }).then(res => res.json()) as Promise<APIWebpagePost[]>,
  create: async (token: string, data: APIWebpagePostCreationData) =>
  {

    if (!token) throw new Error("You must provide an authorization token to this function.")

    const response = await fetch(Routes.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(data)
    })

    if (response.status !== 201) {
      const data = await response.json().catch(() => ({ message: "Unknown error" })) as { message: string }

      throw new APIError({
        code: response.status,
        api_message: data.message ?? "Unknown error",
        path: Routes.create,
        method: "POST"
      }, "The API responded with an error.")
    }

    return await response.json() as Promise<APIWebpagePost>
  },
  edit: async (token: string, id: string, data: APIWebpageEditData) =>
  {

    if (!token) throw new Error("You must provide an authorization token to this function.")
    if (!id) throw new Error("You must provide a post id to this function.")

    const response = await fetch(Routes.edit(id), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(data)
    })

    if (response.status !== 200) {
      const data = await response.json().catch(() => ({ message: "Unknown error" })) as { message: string }

      throw new APIError({
        code: response.status,
        api_message: data.message ?? "Unknown error",
        path: Routes.edit(id),
        method: "PATCH"
      }, "The API responded with an error.")
    }

    return await response.json() as Promise<APIWebpagePost>
  },
  delete: async (token: string, id: string) =>
  {

    if (!token) throw new Error("You must provide an authorization token to this function.")
    if (!id) throw new Error("You must provide a post id to this function.")

    const response = await fetch(Routes.delete(id), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": token
      }
    })

    if (response.status !== 200) {
      const data = await response.json().catch(() => ({ message: "Unknown error" })) as { message: string }

      throw new APIError({
        code: response.status,
        api_message: data.message ?? "Unknown error",
        path: Routes.delete(id),
        method: "DELETE"
      }, "The API responded with an error.")
    }

    return await response.json() as Promise<APIWebpagePost>
  }
}