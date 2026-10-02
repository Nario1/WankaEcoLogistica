import PropTypes from "prop-types";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function ResourcePage({
  title,
  description,
  error,
  loading,
  actionLabel,
  onAction,
  children,
}) {
  return (
    <Box sx={{ width: "100%", maxWidth: 1700 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        gap={2}
        mb={2}
      >
        <Box>
          <Typography component="h1" variant="h5" fontWeight={700}>
            {title}
          </Typography>
          <Typography color="text.secondary">{description}</Typography>
        </Box>
        {actionLabel && (
          <Button variant="contained" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Stack>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Card sx={{ p: 2, overflowX: "auto" }}>
        {loading ? (
          <Stack alignItems="center" p={4}>
            <CircularProgress aria-label="Cargando" />
          </Stack>
        ) : (
          children
        )}
      </Card>
    </Box>
  );
}

ResourcePage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  children: PropTypes.node.isRequired,
};
