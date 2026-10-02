import Stack from "@mui/material/Stack";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import ColorModeIconDropdown from "../../shared-theme/ColorModeIconDropdown";
import PropTypes from "prop-types";

export default function Header({ page }) {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs page={page} />
      <Stack direction="row" sx={{ gap: 1 }}>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}

Header.propTypes = { page: PropTypes.string.isRequired };
