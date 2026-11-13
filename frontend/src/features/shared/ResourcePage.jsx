import PropTypes from "prop-types";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function ResourcePage({
  title,
  description,
  error,
  loading,
  actionLabel,
  onAction,
  pagination,
  onPageChange,
  setPage,
  children,
}) {
  const totalPages = pagination?.totalPages ?? 0;
  const changePage = onPageChange ?? setPage;
  return (
    <Box sx={{ width: "100%", maxWidth: 1700 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={2}
        mb={2}
        sx={{ justifyContent: "space-between" }}
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
          <Stack sx={{ alignItems: "center", p: 4 }}>
            <CircularProgress aria-label="Cargando" />
          </Stack>
        ) : (
          children
        )}
        {totalPages > 1 && changePage ? (
          <Stack alignItems="center" mt={2}>
            <Pagination
              color="primary"
              page={pagination.page}
              count={totalPages}
              onChange={(_event, value) => changePage(value)}
              aria-label="Paginación de resultados"
            />
            <Typography variant="caption" color="text.secondary" mt={1}>
              {pagination.total} registros · {pagination.limit} por página
            </Typography>
          </Stack>
        ) : null}
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
  pagination: PropTypes.shape({
    total: PropTypes.number,
    page: PropTypes.number,
    limit: PropTypes.number,
    totalPages: PropTypes.number,
  }),
  onPageChange: PropTypes.func,
  setPage: PropTypes.func,
  children: PropTypes.node.isRequired,
};
