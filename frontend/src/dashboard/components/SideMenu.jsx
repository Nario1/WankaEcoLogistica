import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SelectContent from "./SelectContent";
import MenuContent from "./MenuContent";
import Button from "@mui/material/Button";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PropTypes from "prop-types";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu({ selected, onSelect, user, onLogout }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
        }}
      >
        <SelectContent />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent selected={selected} onSelect={onSelect} role={user.role} />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar sizes="small" alt={user.name} sx={{ width: 36, height: 36 }} />
        <Box sx={{ minWidth: 0, mr: "auto" }}>
          <Typography
            variant="body2"
            noWrap
            sx={{
              fontWeight: 500,
              lineHeight: "16px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.name}
          </Typography>
          <Typography
            variant="caption"
            noWrap
            sx={{
              color: "text.secondary",
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.email}
          </Typography>
        </Box>
        <Button size="small" onClick={onLogout} aria-label="Cerrar sesión">
          <LogoutRoundedIcon />
        </Button>
      </Stack>
    </Drawer>
  );
}

SideMenu.propTypes = {
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
};
