import Box from "@mui/material/Box";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import Typography from "@mui/material/Typography";

export default function SelectContent() {
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 32,
          height: 32,
          borderRadius: 1.5,
          bgcolor: "success.main",
          color: "success.contrastText",
        }}
      >
        <LocalShippingRoundedIcon fontSize="small" />
      </Box>
      <Box>
        <Typography variant="subtitle2" fontWeight={700}>
          WankaEcoLogística
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Operación sostenible
        </Typography>
      </Box>
    </Box>
  );
}
