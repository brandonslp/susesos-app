
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

  async request(origin: string, destination: string, vehicle_type: string, age: number, gender: string, timestamp: string): Promise<number> {

    try {
      const params = {
        comuna_origen: origin,
        comuna_destino: destination,
        vehiculo_paciente: this.normalizeVehiculoPaciente(vehicle_type),
        rango_edad: this.getInterval(age),
        genero: gender,
        //dow: this.getDayOfWeek(timestamp),
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

  normalizeVehiculoPaciente(vehicle: string): string {
    if(vehicle == "Automóvil/Camioneta" || 
      vehicle == "Bicicleta/Scooter" || 
      vehicle == "Motocicleta" || 
      vehicle == "Taxi/Colectivo") return vehicle;
    if(vehicle == 'Microbus/Bus/Furgón')
      return "Microbus/Bus/Furgón/Tren/Metro/Metrotren";
    return "Otros";
  }

  getDayOfWeek(timestamp: string){
    if(timestamp){
      const date = new Date(timestamp);
      const day = date.getDay();
      return day === 0 ? 6: day - 1;
    } else{
      return null;
    }
  }
  getDayPeriod(timestamp: string){
    if(timestamp){
      const date = new Date(timestamp);
      const hour = date.getHours();
      if (hour > 0 && hour < 6) {
          return "night";
      } else if (hour < 10) {
          return "morning_peak";
      } else if (hour < 13) {
          return "valley";
      } else if (hour < 15) {
          return "lunch";
      } else if (hour < 18) {
          return "valley";
      } else if (hour < 21) {
          return "afternoon_peak";
      }
      return "night";
    } else{
      return null;
    }
  }
  private getInterval(number: number) {
    return Math.floor(number/5)*5
    const intervals = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95]
    return intervals.find(interval => interval > number+5)
  }

  getCommune(address: string): string {
    let commune = address.split(",")[1].trim()
    let second = commune.split(" ")
    if ( second.length > 1) {
      if(!Number.isNaN(Number(second[0]))){
        commune = commune.split(" ").slice(1).join(" ")
      }
    }
    if(this.communes.includes(commune.trim()))
      return commune.trim();
    else
      return address.split(",")[0].trim();
  }

}