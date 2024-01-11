import { Datepicker } from 'flowbite-react';
import React, { useCallback, useState } from 'react';
import dayjs from "dayjs";
import { Autocomplete, LoadScript } from '@react-google-maps/api';
import { $route } from '../../store/RouteStore';
import { $danger } from '../../store/DangerStore';

const optionsAge = ["0 - 15", "16 - 20", "> 21"];
const optionsVehicle = ["Auto", "Moto", "Bus", "Bicicleta"];
const optionsTime = ["00:00 - 05:00", "06:00 - 08:00", "09:00 - 12:00"];
const optionsGender = ["Femenino", "Masculino", "Otro"];

const FormComponent = () => {
  const [showExpandedInputs, setShowExpandedInputs] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    origen: '',
    destino: '',
    fecha: '',
    rangoEdad: '',
    vehiculo: '',
    hora: '',
    genero: '',
    ocupacion: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement> | Date) => {
    if(e instanceof Date){
      setSearchQuery({ ...searchQuery, fecha: dayjs(e).format("DD/MM/YYYY") })
    } else {
      setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate required fields
    if (searchQuery.origen && searchQuery.destino && searchQuery.fecha) {
      // Handle form data here
      $route.setKey("origin", searchQuery.origen)
      $route.setKey("destination", searchQuery.destino)
      setStats()
    } else {
      alert("Please fill out required fields.");
    }
  };


  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const setStats = () => {
    $danger.setKey("danger", getRandomNumber(5, 70))
  }

  const handlePlaceSelect = useCallback(
    (address: string|undefined, name: string) => {
      setSearchQuery((prevSearchQuery) => ({
        ...prevSearchQuery,
        [name]: address,
      }));
    },
    []
  );

  return (
    <div className="max-w-screen-lg mx-auto mt-8 p-4 bg-gray-200 rounded-lg">
        <form onSubmit={handleSubmit} >
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-3 gap-4 content-start">
              <Autocomplete
                onLoad={(autocomplete) => { 
                  autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    handlePlaceSelect(place.formatted_address, 'origen');
                  });
                }}
              >
                <input
                  type="text"
                  name="origen"
                  placeholder="Origen*"
                  value={searchQuery.origen}
                  onChange={handleInputChange}
                  required
                  className="p-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
                />
              </Autocomplete>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    handlePlaceSelect(place.formatted_address, 'destino');
                  });
                }}
              >
                <input
                  type="text"
                  name="destino"
                  placeholder="Destino*"
                  value={searchQuery.destino}
                  onChange={handleInputChange}
                  required
                  className="p-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
                />
              </Autocomplete>
              <Datepicker autoHide={true}
                name="fecha"
                placeholder="Fecha*"
                required
                title="Seleccionar fecha"
                language="es-CO"
                labelClearButton="Limpar"
                labelTodayButton="Hoy"
                value={searchQuery.fecha}
                onSelectedDateChanged={handleInputChange}
                theme={{
                  "root": {
                    "base": "relative",
                    input: {
                      field: {
                        input: {
                          base: " w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500",
                          sizes: {
                            md: "inherit"
                          }
                        },
                        icon: {
                          base: "hidden"
                        },
                      }
                    }
                  },
                  "popup": {
                    "root": {
                      "base": "absolute top-10 z-50 block pt-2",
                      "inline": "relative top-0 z-auto",
                      "inner": "inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-gray-700"
                    },
                    "header": {
                      "base": "",
                      "title": "px-2 py-3 text-center font-semibold text-gray-900 dark:text-white",
                      "selectors": {
                        "base": "flex justify-between mb-2",
                        "button": {
                          "base": "text-sm rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-semibold py-2.5 px-5 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 view-switch",
                          "prev": "",
                          "next": "",
                          "view": ""
                        }
                      }
                    },
                    "view": {
                      "base": "p-1"
                    },
                    "footer": {
                      "base": "flex mt-2 space-x-2",
                      "button": {
                        "base": "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-cyan-300",
                        "today": "bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700",
                        "clear": "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      }
                    }
                  },
                  "views": {
                    "days": {
                      "header": {
                        "base": "grid grid-cols-7 mb-1",
                        "title": "dow h-6 text-center text-sm font-medium leading-6 text-gray-500 dark:text-gray-400"
                      },
                      "items": {
                        "base": "grid w-64 grid-cols-7",
                        "item": {
                          "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 ",
                          "selected": "bg-cyan-700 text-white hover:bg-cyan-600",
                          "disabled": "text-gray-500"
                        }
                      }
                    },
                    "months": {
                      "items": {
                        "base": "grid w-64 grid-cols-4",
                        "item": {
                          "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                          "selected": "bg-cyan-700 text-white hover:bg-cyan-600",
                          "disabled": "text-gray-500"
                        }
                      }
                    },
                    "years": {
                      "items": {
                        "base": "grid w-64 grid-cols-4",
                        "item": {
                          "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 text-gray-900",
                          "selected": "bg-cyan-700 text-white hover:bg-cyan-600",
                          "disabled": "text-gray-500"
                        }
                      }
                    },
                    "decades": {
                      "items": {
                        "base": "grid w-64 grid-cols-4",
                        "item": {
                          "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9  hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 text-gray-900",
                          "selected": "bg-cyan-700 text-white hover:bg-cyan-600",
                          "disabled": "text-gray-500"
                        }
                      }
                    }
                  }
                }}
              />
            </div>


            <div className={`grid grid-cols-3 gap-4 content-start ${showExpandedInputs ? 'flex' : 'hidden'}`}>
              <select
                name="rangoEdad"
                value={searchQuery.rangoEdad}
                onChange={handleInputChange}
                className="p-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Rango de Edad</option>
                {optionsAge.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                name="vehiculo"
                value={searchQuery.vehiculo}
                onChange={handleInputChange}
                className="p-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Vehiculo</option>
                {optionsVehicle.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                name="hora"
                value={searchQuery.hora}
                onChange={handleInputChange}
                className="p-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Hora</option>
                {optionsTime.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                name="genero"
                value={searchQuery.genero}
                onChange={handleInputChange}
                className="p-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Genero</option>
                {optionsGender.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="ocupacion"
                placeholder="Ocupacion"
                value={searchQuery.ocupacion}
                onChange={handleInputChange}
                className="p-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              className="flex items-center justify-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
              onClick={() => setShowExpandedInputs(!showExpandedInputs)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-5a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {showExpandedInputs ? 'Hide Options' : 'Show Options'}
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded focus:outline-none"
            >
              Search
            </button>
          </div>
        </form>
    </div>
  );
};

export default FormComponent;
