import CrisisAlert  from '@mui/icons-material/CrisisAlert';
import MedicalServices from '@mui/icons-material/MedicalServices';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import BarChartIcon from '@mui/icons-material/BarChart';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';


export interface Props {
  title: string
  iconText: string
  distance: number
  severity: number
  restDays: number
  probability: number
  color: string
}

const getLabel = (severity: number): string => {
  const labels: { [key: string]: string } = {
    "1": "Baja",
    "2": "Media",
    "3": "Alta"
  }
  return labels[String(severity)] ?? labels["1"]
}


function toFixed(numero: number) {
  return parseFloat(numero.toFixed(2));
}

function getDangerLabel(probability: number): JSX.Element{
  const label = "Peligro de accidente:"
  switch (true) {
    case (probability > 1):
      return <Chip label={`${label} Alto`} size="small" color="error"/>
    case (probability > 2):
      return <Chip label={`${label} Medio`} size="small" color="warning"/>
    default:
      return <Chip label={`${label} Bajo`} size="small" color="info"/>
  }
}


const StatsCard = ({title, color, iconText, distance, severity, restDays, probability}: Props) => {
  return (
    <Card className="basis-1/2">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: color }} aria-label="recipe">
              {iconText}
            </Avatar>
          }
          title={title}
          subheader={distance + " km"}
          style={{ paddingBottom: "1px" }}
        />
      </Box>
      <CardContent style={{paddingTop:"2px"}}>
        <List>
          <ListItem>
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary={"Probalidad: " + toFixed(probability * 100) + "%"} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MedicalServices/>
            </ListItemIcon>
            <ListItemText primary={`Incapacidad: ${restDays} días`}/>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CrisisAlert />
            </ListItemIcon>
            <ListItemText primary={"Severidad: " + getLabel(severity)} />
          </ListItem>
        </List>
        <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
          {getDangerLabel(probability)}
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatsCard;