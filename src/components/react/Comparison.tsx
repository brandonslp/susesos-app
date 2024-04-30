import { useState } from "react";
import StatsCard from "./StatsCard"
import { $predictInput } from "../../store/PrecitInputStore";
import { $predictOutputComplete } from "../../store/PredictOutputStore";
import { $isOpenStatsContainer } from "../../store/StatsStore";
import type { PredictOutput } from "../../types/PredictOutput";
import { $probability } from "../../store/Probability";
import Chip from '@mui/material/Chip';
import { Box } from "@mui/material";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { StaticService } from "../../services/StaticService";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Typography } from '@mui/material';


const table = {
	'vehiculo_paciente': {
		'referencia': 'Automóvil/Camioneta',
		'opciones': [
			['Bicicleta/Scooter', 8.528486051251873],
			['Microbus/Bus/Furgón', -3.837094499745899],
			['Motocicleta', 22.961188437474902]
		]
	},
  'pcnt_genero': {
		'referencia': 'F',
		'opciones': [
			['M', 8.419732480953455]
		]
	},
  'day_of_week': {
		'referencia': '0',
		'opciones': [
      ['1', -3.902933989848453],
      ['2', -0.672657003548202],
      ['3', -1.7974610895401486],
      ['4', 0.4217398771915276],
      ['5', 5.114303027455866],
      ['6', 2.5455591078350555]
		]
	},
  'day_period': {
		'referencia': 'valley',
		'opciones': [
      ['afternoon_peak', 2.157020355776456],
      ['lunch', -2.364330897904337],
      ['morning_peak', -5.150678434903698],
      ['night', 2.7598878110291274]
		]
	},
  'month': {
		'referencia': 'February',
		'opciones': [
      ['April', 0.2984456011465923],
      ['August', -1.643084916602704],
      ['December', -1.103688976088094],
      ['January', -0.0873810463967442],
      ['July', 0.3046822707481564],
      ['June', -1.442907547670856],
      ['March', 1.0410350476111336],
      ['May', -3.238733392981147],
      ['November', -0.7863906412601995],
      ['October', -0.2321180439919014],
      ['September', -0.2343368161590843]
		]
	},
  'DistManhattan': {
		'referencia': '0',
		'opciones': [
      ['0', -0.0280096890066809]
		]
	},
  'pcnt_edad': {
		'referencia': '0',
		'opciones': [
      ['0', 0.4855772296968603]
		]
	},
}

const maps = {
  'dia_semana': {
    0: 'Lunes',
    1: 'Martes',
    2: 'Miércoles',
    3: 'Jueves',
    4: 'Viernes',
    5: 'Sábado',
    6: 'Domingo'
  },
  'periodo': {
    'morning_peak': '06:00 - 10:00',
    'valley': '10:00 - 13:00 / 15:00 - 18:00',
    'lunch': '13:00 - 15:00',
    'afternoon_peak': '18:00 - 21:00',
    'night': '21:00 - 06:00'
  }
}


function delta_gravedad(categoria, column){
  if (column === null) {
    return [];
  }
  if (['DistManhattan', 'pcnt_edad'].includes(categoria)) {
    const delta = table[categoria].opciones[0][1];
    return [-10, -1, 1, 10].map(x => [parseInt(column) + x, delta * x]);
  }

	const rows = table[categoria]
	let delta = 0
  const referencia = rows.referencia
	if(referencia != column){
		delta = rows.opciones.find(o => o[0] == column)
    if(delta)
      delta = delta[1]
    else return [];
  }

	return rows.opciones.map(row => {
        const x = row[0];
        const y = row[1] - delta;
        return [x === column ? referencia : x, x === column ? -delta : y];
    });
}
//console.log(table)
 
const Comparison = () => {

  function toFixed(numero: number) {
    return parseFloat(numero.toFixed(4));
  }
  function NumberWithArrow({ number }) {
    const isUp = number>0;
  
    return (
      <Typography component="span" sx={{ display: 'flex', alignItems: 'center', color: isUp ? 'red' : 'green' }}>
        {isUp ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        {number}
      </Typography>
    );
  }

  const staticService = new StaticService()
  const noDataLabel = "Para estos valores no hay data encontrada"
  let chipColor = "secondary"
  const [IsStatsOpen, setStatsOpen] = useState(false);
  const [probability, setProbability] = useState(NaN);
  const [severities, setSeverities] = useState({
    age: [],
    vehiculo: [],
    genero: [],
    dia_semana: [],
    periodo: []
  });

  $isOpenStatsContainer.listen((value)=>setStatsOpen(value))
  $probability.listen((value)=>{
    if (!value || Number.isNaN(value)) {
      chipColor = "error"
    }
    setProbability(value)
  })
  $predictInput.listen((r) => {    
    const gravedades = {
      age: delta_gravedad('pcnt_edad', r.age),
      vehiculo: delta_gravedad('vehiculo_paciente', r.vehicle_type),
      genero: delta_gravedad('pcnt_genero', r.gender),
      dia_semana: delta_gravedad('day_of_week', staticService.getDayOfWeek(r.timestamp)),
      periodo: delta_gravedad('day_period', staticService.getDayPeriod(r.timestamp)),
    }
    gravedades.age.sort((a, b) => a[1] - b[1])
    gravedades.vehiculo.sort((a, b) => a[1] - b[1])
    gravedades.dia_semana.sort((a, b) => a[1] - b[1])
    gravedades.periodo.sort((a, b) => a[1] - b[1])
    setSeverities(gravedades)
  })

  const [segment1, setSegment1] = useState<PredictOutput>()
  const [segment2, setSegment2] = useState<PredictOutput>()
  const [segment3, setSegment3] = useState<PredictOutput>()
  $predictOutputComplete.listen((value)=> {
    setSegment1(value.segment1)
    setSegment2(value.segment2)
    setSegment3(value.segment3)
  })
  return (
    <Box>
      <div className={`max-w-screen-lg mx-auto bg-gray-200 rounded-lg  transition-all duration-300 ${(!IsStatsOpen) ? "opacity-0 max-h-0 overflow-hidden m-0 p-0" : "opacity-100 max-h-96 mt-8 p-4"}`}>
        <div className="flex flex-row space-x-4 items-center justify-center">
          <h4 className="text-2xl text-gray-800 mb-2">Modelo teórico de análisis de probabilidad (regresión binomial negativa)</h4>
        </div>
        <div className="flex flex-row space-x-4 items-center justify-center mb-2">
          <Chip label={`Factor de accidentabilidad: ${(probability >= 0) ? toFixed(probability) : noDataLabel} `} size="small" color={(probability >= 0) ? "secondary" : "error"} />
        </div>
        <div>
        
        </div>
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Vehículo</TableCell>
                <TableCell>Género</TableCell>
                <TableCell>Día de la semana</TableCell>
                <TableCell>Período del día</TableCell>
                <TableCell>Edad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{verticalAlign: 'top'}}>
                  {severities.vehiculo?severities.vehiculo.map((x) => {
                    return <div style={{display: "flex"}}>
                        <div style={{flex: "0 0 60px"}}><NumberWithArrow number={x[1].toFixed(1)} /></div>
                        <div style={{flex: "1 1"}}>
                          <Typography component="span" sx={{ display: 'flex', alignItems: 'center' }}>{x[0]}</Typography>
                        </div>
                      </div>
                  }):null}
                </TableCell>
                <TableCell sx={{verticalAlign: 'top'}}>
                  {severities.vehiculo?severities.genero.map((x) => {
                    return <div style={{display: "flex"}}>
                        <div style={{flex: "0 0 60px"}}><NumberWithArrow number={x[1].toFixed(1)} /></div>
                        <div style={{flex: "1 1"}}>
                          <Typography component="span" sx={{ display: 'flex', alignItems: 'center' }}>{x[0]}</Typography>
                        </div>
                      </div>
                  }):null}
                </TableCell>
                <TableCell sx={{verticalAlign: 'top'}}>
                  {severities.vehiculo?severities.dia_semana.map((x) => {
                    return <div style={{display: "flex"}}>
                        <div style={{flex: "0 0 60px"}}><NumberWithArrow number={x[1].toFixed(1)} /></div>
                        <div style={{flex: "1 1"}}>
                          <Typography component="span" sx={{ display: 'flex', alignItems: 'center' }}>{maps.dia_semana[x[0]]}</Typography>
                        </div>
                      </div>
                  }):null}
                </TableCell>
                <TableCell sx={{verticalAlign: 'top'}}>
                  {severities.vehiculo?severities.periodo.map((x) => {
                    return <div style={{display: "flex"}}>
                        <div style={{flex: "0 0 60px"}}><NumberWithArrow number={x[1].toFixed(1)} /></div>
                        <div style={{flex: "1 1"}}>
                          <Typography component="span" sx={{ display: 'flex', alignItems: 'center' }}>{maps.periodo[x[0]]}</Typography>
                        </div>
                      </div>
                  }):null}
                </TableCell>
                <TableCell sx={{verticalAlign: 'top'}}>
                  {severities.vehiculo?severities.age.map((x) => {
                    return <div style={{display: "flex"}}>
                        <div style={{flex: "0 0 60px"}}><NumberWithArrow number={x[1].toFixed(1)} /></div>
                        <div style={{flex: "1 1"}}>
                          <Typography component="span" sx={{ display: 'flex', alignItems: 'center' }}>{x[0]}</Typography>
                        </div>
                      </div>
                  }):null}
                </TableCell>
              </TableRow>
            </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <div className={`max-w-screen-lg mx-auto bg-gray-200 rounded-lg  transition-all duration-300 ${(!IsStatsOpen) ? "opacity-0 max-h-0 overflow-hidden m-0 p-0" : "opacity-100 max-h-96 mt-8 p-4"}`}>
        <div className="flex flex-row space-x-4 items-center justify-center">
          <h4 className="text-2xl text-gray-800 mb-2">Modelo de probabilidad de accidente de trayecto (Random Forest)</h4>
        </div>
        <div className="flex flex-row space-x-4 items-center justify-center">
          <StatsCard
            title="Tramo 1"
            iconText=" A-B "
            color="#F34E2A"
            distance={segment1?.distance ?? 0}
            probability={segment1?.probability ?? 0}
            restDays={segment1?.restdays ?? 0}
            severity={segment1?.severity ?? 0}
          />

          <StatsCard
            title="Tramo 2"
            color="#2A5BF3"
            iconText=" B-C "
            distance={segment2?.distance ?? 0}
            probability={segment2?.probability ?? 0}
            restDays={segment2?.restdays ?? 0}
            severity={segment2?.severity ?? 0}
          />

          <StatsCard
            title="Tramo 3"
            color="#46183d"
            iconText=" C-D "
            distance={segment3?.distance ?? 0}
            probability={segment3?.probability ?? 0}
            restDays={segment3?.restdays ?? 0}
            severity={segment3?.severity ?? 0}
          />
        </div>

      </div>
    </Box>

  );
};

export default Comparison;
