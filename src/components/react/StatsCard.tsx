// import { CrisisAlert, MedicalServices } from '@mui/icons-material';
// import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
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


const StatsCard = ({title, color, iconText, distance, severity, restDays, probability}: Props) => {
  return (
    <Card className="basis-1/4">
      <CardHeader avatar={
        <Avatar sx={{ bgcolor: color }} aria-label="recipe">
          {iconText}
        </Avatar>
      } title={title} subheader={distance + " km"} style={{ paddingBottom: "1px" }} />
      <CardContent style={{paddingTop:"2px"}}>
        <List>
          <ListItem>
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary={"Probalidad: " + (probability * 100) + "%"} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MedicalServices/>
            </ListItemIcon>
            <ListItemText primary={"Incapacidad: "+restDays}/>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CrisisAlert />
            </ListItemIcon>
            <ListItemText primary={"Severidad: " + getLabel(severity)} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  )
}

export default StatsCard;