import { lazy, Suspense, useState } from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import { useAuth } from "../auth/AuthContext";
import AppTheme from "../shared-theme/AppTheme";

const OverviewPage = lazy(() => import("../features/overview/OverviewPage"));
const OrdersPage = lazy(() => import("../features/orders/OrdersPage"));
const VehiclesPage = lazy(() => import("../features/vehicles/VehiclesPage"));
const DriversPage = lazy(() => import("../features/drivers/DriversPage"));
const RoutesPage = lazy(() => import("../features/routes/RoutesPage"));

export default function Dashboard(props) {
  const [page, setPage] = useState("overview");
  const { session, logout } = useAuth();
  const pages = {
    overview: { label: "Inicio", component: <OverviewPage /> },
    orders: { label: "Pedidos", component: <OrdersPage /> },
    vehicles: { label: "Vehículos", component: <VehiclesPage /> },
    drivers: { label: "Conductores", component: <DriversPage /> },
    routes: { label: "Asignaciones", component: <RoutesPage /> },
  };
  const activePage = pages[page] ?? pages.overview;
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu
          selected={page}
          onSelect={setPage}
          user={session.user}
          onLogout={logout}
        />
        <AppNavbar
          selected={page}
          onSelect={setPage}
          user={session.user}
          onLogout={logout}
        />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            minWidth: 0,
            minHeight: "100dvh",
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              width: "100%",
              mx: { xs: 2, sm: 3 },
              pb: 5,
              mt: { xs: "72px", md: 0 },
            }}
          >
            <Header page={activePage.label} />
            <Suspense
              fallback={<CircularProgress aria-label="Cargando módulo" />}
            >
              {activePage.component}
            </Suspense>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
