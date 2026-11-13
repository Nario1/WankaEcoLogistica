export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  // En desarrollo el SW envenena el caché de módulos de Vite (doble React / pantalla en blanco).
  if (import.meta.env.DEV) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // El registro fallido no bloquea la app en línea.
    });
  });
}
