import { useState } from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function RowMenu({ label = "Editar o eliminar", items }) {
  const [anchor, setAnchor] = useState(null);
  const visible = items.filter(Boolean);
  if (!visible.length) return null;

  return (
    <>
      <IconButton
        size="small"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={anchor ? "true" : undefined}
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {visible.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => {
              setAnchor(null);
              item.onClick();
            }}
            sx={item.danger ? { color: "error.main" } : undefined}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

RowMenu.propTypes = {
  label: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      danger: PropTypes.bool,
    }),
  ).isRequired,
};
