
import axios from "axios";
import * as levenshtein from "fastest-levenshtein"

export class StaticService {

  private URL = "https://nostradamusapp-1599c3bbbbe2.herokuapp.com/api/probability"
  private communes = [
    "Vitacura",
    "Til Til",
    "Santiago",
    "San Ramón",
    "San Pedro",
    "San Miguel",
    "San José de Maipo",
    "San Joaquín",
    "San Bernardo",
    "Renca",
    "Recoleta",
    "Quinta Normal",
    "Quilicura",
    "Puente Alto",
    "Pudahuel",
    "Providencia",
    "Pirque",
    "Peñalolén",
    "Peñaflor y Talagante",
    "Pedro Aguirre Cerda",
    "Paine",
    "Padre Hurtado",
    "Ñuñoa",
    "Melipilla",
    "María Pinto",
    "Maipú",
    "Macul",
    "Lo Prado",
    "Lo Espejo",
    "Lo Barnechea",
    "Las Condes",
    "Lampa",
    "La Reina",
    "La Pintana",
    "La Granja",
    "La Florida",
    "La Cisterna",
    "Isla de Maipo",
    "Independencia",
    "Huechuraba",
    "Estación Central",
    "El Monte",
    "El Bosque",
    "Curacaví",
    "Conchalí",
    "Colina",
    "Cerro Navia",
    "Cerrillos",
    "Calera de Tango",
    "Buin",
    "Alhué",
  ];

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
      return response.data.probability;
    } catch (error) {
      return -1;
    }

  }

  private getInterval(number: number) {
    const intervals = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95]
    return intervals.find(interval => interval > number)
  }

  getCommune(address: string): string {
    return levenshtein.closest(address, this.communes)
  }

}