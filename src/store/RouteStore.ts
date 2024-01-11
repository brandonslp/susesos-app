import { map } from "nanostores"

export interface Route {
  origin: string
  destination: string
}

export const $route = map<Route>({
  origin: "",
  destination: ""
})