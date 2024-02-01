import { map } from "nanostores"
import type { PredictOutput } from "../types/PredictOutput"

export interface PredictCompleteOutput {
  segment1: PredictOutput,
  segment2: PredictOutput,
  segment3: PredictOutput,
}

export const $predictOutputComplete = map<PredictCompleteOutput>({
  segment1: {
    "id": "",
    "probability": 0,
    "restdays": 0,
    "severity": 0,
    "type": "none",
    "distance": 0
  },
  segment2: {
    "id": "",
    "probability": 0,
    "restdays": 0,
    "severity": 0,
    "type": "none",
    "distance": 0
  },
  segment3: {
    "id": "",
    "probability": 0,
    "restdays": 0,
    "severity": 0,
    "type": "none",
    "distance": 0
  },
})