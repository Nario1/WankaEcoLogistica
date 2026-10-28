import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Eliminar",
  confirming = false,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog
      open={open}
      onClose={confirming ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose} disabled={confirming}>
          Cancelar
        </Button>
        <Button
          type="button"
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={confirming}
        >
          {confirming ? "Eliminando…" : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  confirming: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
