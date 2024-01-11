import axios from "axios";
import type { MapPlace } from "../types/MapPlace"

export class MapServices {
  
  private API_KEY = "AIzaSyABxxSf2TvidfZeoAhf_Tl9NC700J9UNI4"

  getApiKey(): string {
    return this.API_KEY
  }

  async getMapPredictions(input: string): Promise<MapPlace[]>  {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=geocode&key=${this.getApiKey()}`
      );
      const result = response.data;
      if (result.status !== "OK") {
        throw new Error("Request result was: " + result.status);
      }
      const mapPlaces: MapPlace[] = [];
      result?.predictions.forEach((prediction: any) => {
        mapPlaces.push({
          description: prediction.description,
          address: prediction.structured_formatting.main_text,
          type: prediction.types[0]
        });
      })
      return mapPlaces;
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return [];
    }
  }

}