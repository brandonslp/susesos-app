
import axios from "axios";

export class StaticService {

  private URL = "https://nostradamusapp-1599c3bbbbe2.herokuapp.com/api/probability"

  async request(origin: string, destination: string, vehicle_type: string, age: number, gender: string): Promise<number> {

    try {
      const params = {
        comuna_origen: origin,
        comuna_destino: destination,
        vehiculo_paciente: vehicle_type,
        rango_edad: this.getInterval(age),
        genero: gender,
        dow: 0,
      }
      const response = await axios.get(this.URL, {
        params
      })
      if(response.data.probability && response.data.probability){
        return response.data.probability / 100
      }
      return 0;
    } catch (error) {
      return 0;
    }

  }

  private getInterval(number: number) {
    const intervals = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95]
    return intervals.find(interval => interval > number)
  }


}