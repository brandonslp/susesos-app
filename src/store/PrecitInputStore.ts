import { map } from "nanostores"
import type { PredictInput } from "../types/PredictInput"


export const $predictInput = map<PredictInput>({
  age: 0,
  destination: "",
  origin: "",
  gender: "",
  timestamp: "",
  vehicle_type: ""
})