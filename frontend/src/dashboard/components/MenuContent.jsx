import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import PropTypes from "prop-types";

const mainListItems = [
  {
    id: "overview",
    text: "Inicio",
    icon: <HomeRoundedIcon />,
    roles: ["ADMIN", "OPERATOR", "DRIVER", "AUDITOR"],
  },
  {
    id: "orders",
    text: "Pedidos",
    icon: <AssignmentRoundedIcon />,
    roles: ["ADMIN", "OPERATOR", "AUDITOR"],
  },
  {
    id: "vehicles",
    text: "Vehículos",
    icon: <LocalShippingRoundedIcon />,
    roles: ["ADMIN", "OPERATOR", "AUDITOR"],
  },
  {
    id: "drivers",
    text: "Conductores",
    icon: <PeopleRoundedIcon />,
    roles: ["ADMIN", "OPERATOR"],
  },
  {
    id: "routes",
    text: "Asignaciones",
    icon: <RouteRoundedIcon />,
    roles: ["ADMIN", "OPERATOR"],
  },
];

export default function MenuContent({ selected, onSelect, role }) {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems
          .filter((item) => item.roles.includes(role))
          .map((item) => (
            <ListItem key={item.id} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                selected={selected === item.id}
                onClick={() => onSelect(item.id)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Stack>
  );
}

MenuContent.propTypes = {
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
};
