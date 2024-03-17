import React, { useCallback, useState } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Button, MenuItem } from '@mui/material';
import dayjs from 'dayjs';
import { Autocomplete } from '@react-google-maps/api';
import { $predictInput } from '../../store/PrecitInputStore';


const genders = ["M", "F"];
const vehicle_types = ["Bicicleta/Scooter",
  "Automóvil/Camioneta",
  "Microbus/Bus/Furgón",
  "Motocicleta",
  "No identificado",
  "Taxi/Colectivo",
  "Camión",
  "Vehiculo no identificado",
  "Tren/Metro/Metrotren"];

const Form: React.FC = () => {
  const [showSecondRow, setShowSecondRow] = useState(false);

  const toggleSecondRow = () => {
    setShowSecondRow(!showSecondRow);
  };

  const [formValues, setFormValues] = useState<any>({
    origin: {
      value: "",
      error: false,
      errorMessage: "Ingrese origen"
    },
    destination: {
      value: "",
      error: false,
      errorMessage: "Ingrese destino"
    },
    datetime: {
      value: "",
      error: false,
      errorMessage: "Ingrese fecha y hora"
    },
    age: {
      value: "",
      error: false,
      errorMessage: "Ingrese edad"
    },
    gender: {
      value: "",
      error: false,
      errorMessage: 'Ingrese genero'
    },
    vehicleType: {
      value: "",
      error: false,
      errorMessage: 'Ingrese tipo de vehiculo'
    }
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newFormValues = { ...formValues };
    const formFields = Object.keys(formValues)
    let flag = true;
    for (let index = 0; index < formFields.length; index++) {
      const currentField: string = formFields[index];
      const currentValue = formValues[currentField].value
      if (currentValue === "") {
        flag = false;
        newFormValues = {
          ...newFormValues,
          [currentField]: {
            ...newFormValues[currentField],
            error: true,
          }
        }
        setShowSecondRow(true);
      }
    }
    setFormValues(newFormValues);
    if (flag) 
      setToPredict(newFormValues);
  };

  const handleOnChange = (e: any) => {
    const { name, value } = (e.target) ? e.target : { name: "datetime", value: dayjs(e.$d).format("YYYY-MM-DD HH:mm:ss") };
    setFormValues({
      ...formValues,
      [name]: {
        ...formValues[name],
        value,
        error: (value.toString().length == 0)
      }
    })
  }

  const handlePlaceSelect = useCallback(
    (address: string | undefined, name: string) => {
      const newFormValues = { ...formValues };
      newFormValues[name].value = address;
      setFormValues(newFormValues);
    },
    []
  );

  const setToPredict = (values: any) => {
    $predictInput.set({
      age: Number(values.age.value),
      destination: values.destination.value,
      gender: values.gender.value,
      origin: values.origin.value,
      timestamp: values.datetime.value,
      vehicle_type: values.vehicleType.value
    });
  }


  return (
    <div className="container mx-auto mt-8">
      <form noValidate onSubmit={handleSubmit} onChange={handleOnChange} className="max-w-screen-lg mx-auto  rounded-lg flex flex-col">
        <div className="grid sm:grid-cols-1 lg:grid-cols-3 md:gap-20 justify-center m-auto">
          <div className="mb-4">
            <Autocomplete
              onLoad={(autocomplete) => {
                autocomplete.addListener('place_changed', () => {
                  const place = autocomplete.getPlace();
                  handlePlaceSelect(place.formatted_address, 'origin');
                });
              }}
            >
              <TextField size="small"
                className="w-56"
                name="origin"
                label="Origen"
                type="text"
                required
                value={formValues.origin.value}
                error={formValues.origin.error}
                helperText={formValues.origin.error && formValues.origin.errorMessage}
              />
            </Autocomplete>
          </div>
          <div className="mb-4">
            <Autocomplete
              onLoad={(autocomplete) => {
                autocomplete.addListener('place_changed', () => {
                  const place = autocomplete.getPlace();
                  handlePlaceSelect(place.formatted_address, 'destination');
                });
              }}
            >
              <TextField size="small"
                className="w-56"
                name="destination"
                label="Destino"
                type="text"
                required
                value={formValues.destination.value}
                error={formValues.destination.error}
                helperText={formValues.destination.error && formValues.destination.errorMessage}
              />
            </Autocomplete>
          </div>
          <div className="mb-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                name="datetime"
                label="Fecha y hora"
                ampm={false}
                disablePast
                slotProps={{ textField: { size: "small", className: "w-56", required: true, error: formValues.datetime.error, helperText: formValues.datetime.error && formValues.datetime.errorMessage } }}
                value={(formValues.datetime.value !== "") ? formValues.datetime.value : null }
                onChange={handleOnChange}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className={`grid sm:grid-cols-1 lg:grid-cols-3 md:gap-20 justify-center m-auto transition-all duration-300 ${showSecondRow ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'
          }`}>
          <div className="mb-4">
            <TextField size="small"
              name="age"
              label="Edad"
              type="number"
              inputProps={{ min: 1, max: 100 }}
              value={(formValues.age.value !== "") ? Number(formValues.age.value) : ""}
              error={formValues.age.error}
              helperText={formValues.age.error && formValues.age.errorMessage}
            />
          </div>
          <div className="mb-4">
            <TextField select size="small" className="w-56" name="gender" label="Genero" defaultValue={"M"}
              error={formValues.gender.error} onChange={handleOnChange}
              required value={formValues.gender.value} helperText={formValues.gender.error && formValues.gender.errorMessage}
            >
              {genders.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="mb-4">
            <TextField select size="small" className="w-56" name="vehicleType" label="Tipo de Vehiculo" defaultValue={vehicle_types[0]}
              value={formValues.vehicleType.value} onChange={handleOnChange}
              error={formValues.vehicleType.error}
              helperText={formValues.vehicleType.error && formValues.vehicleType.errorMessage}
            >
              {vehicle_types.map((vehicle) => (
                <MenuItem key={vehicle} value={vehicle}>
                  {vehicle}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>
        <div className="flex justify-center items-center md:gap-36 sm:gap-4">
          <Button className="md:w-1/4" variant="outlined" onClick={toggleSecondRow}>
            {showSecondRow ? 'Menos datos' : 'Más datos'}
          </Button>
          <Button className="md:w-1/4" type="submit" variant="contained">
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
