import axios from "axios";
import type { PredictInput } from "../types/PredictInput";
import type { PredictOutput } from "../types/PredictOutput";

export class PredictService {

  async predict(input: PredictInput[]): Promise<PredictOutput[]>  {
    try {
      const serviceInput: any[] = [];
      input.forEach((item, index) => {
        const origin = this.extractNumbersFromString(item.origin);
        const destination = this.extractNumbersFromString(item.destination);
        serviceInput.push({
          "id": index+"",
          "timestamp": item.timestamp,
          "gender": item.gender,
          "age": item.age,
          "origin_longitude": origin[1],
          "origin_latitude": origin[0],
          "accident_longitude": destination[1], //TODO remove
          "accident_latitude": destination[0], // TODO remove
          "destination_longitude": destination[1],
          "destination_latitude": destination[0],
          "vehicle_type": "Bicicleta/Scooter" // TODO validate
        })
      })
      const response = await axios.post(
        "https://nostradamusapp-1599c3bbbbe2.herokuapp.com/predict",
        serviceInput
      );
      const result: PredictOutput[] = response.data;
      return result
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return [];
    }
  }

  private extractNumbersFromString(coordString: string): string[] {
    const regex = /\(([-+]?\d*\.\d+|\d+),\s*([-+]?\d*\.\d+|\d+)\)/;
    const match = coordString.match(regex);

    if (match) {
      const [, lat, lon] = match;
      return [lat, lon];
    } else {
      return ["", ""];
    }
  }

}