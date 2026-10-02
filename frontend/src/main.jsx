import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const nav = ["Resumen", "Pedidos", "Flota", "Conductores"];
const stats = [{ label: "Pedidos pendientes", value: "24", tone: "orange" }, { label: "Flota disponible", value: "8/10", tone: "green" }, { label: "Conductores activos", value: "12", tone: "blue" }];
function App() {
  const [active, setActive] = useState("Resumen");
  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><span>W</span><div>Wanka<strong>Eco</strong><small>LOGÍSTICA SOSTENIBLE</small></div></div><nav>{nav.map((item) => <button key={item} className={active === item ? "active" : ""} onClick={() => setActive(item)}>{item}</button>)}</nav><div className="sidebar-foot">Sprint 1 · Operaciones</div></aside>
    <main><header><div><p className="eyebrow">OPERACIÓN · HUANCAYO</p><h1>{active}</h1><p className="subtitle">Controla la operación diaria de última milla.</p></div><div className="profile"><span>AW</span><div>Administradora Wanka<small>Administrador</small></div></div></header>
    <section className="stats">{stats.map((stat) => <article key={stat.label} className="stat-card"><p>{stat.label}</p><strong className={stat.tone}>{stat.value}</strong><small>Actualizado hace un momento</small></article>)}</section>
    <section className="content-grid"><article className="panel"><div className="panel-heading"><div><p className="eyebrow">PRIORIDAD OPERATIVA</p><h2>Pedidos por atender</h2></div><button className="primary">+ Nuevo pedido</button></div><div className="table"><div className="table-head"><span>Pedido</span><span>Destino</span><span>Ventana</span><span>Estado</span></div><div><span>#PED-024</span><span>El Tambo</span><span>09:00–11:00</span><b>Alta</b></div><div><span>#PED-023</span><span>Huancayo Centro</span><span>10:00–12:00</span><b className="normal">Normal</b></div><div><span>#PED-022</span><span>Chilca</span><span>11:00–13:00</span><b>Alta</b></div></div></article><article className="panel route-card"><p className="eyebrow">JORNADA ACTUAL</p><h2>Preparar despacho</h2><p>Registra pedidos, verifica la flota y asigna conductores disponibles antes de planificar rutas.</p><div className="progress"><span /></div><strong>3 de 4 pasos completados</strong><button className="secondary">Ver operación</button></article></section>
  </main></div>;
}
createRoot(document.getElementById("root")).render(<App />);
