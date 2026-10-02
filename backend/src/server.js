import { createApp } from "./app.js";
const port = process.env.PORT || 3000;
createApp().listen(port, () => console.log(`API Sprint 1 disponible en http://localhost:${port}`));
