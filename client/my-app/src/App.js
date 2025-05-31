import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css"; // Importa los estilos globales
import Login from "./components/pages/login";
import Register from "./components/pages/sign-up.js";
import Home from "./components/pages/home.js";
import Adopcion from "./components/pages/adopcion.js";
import Denuncia from "./components/pages/reporteDenuncia";
import Perdida from "./components/pages/reportePerdida.js";
import RegistrarAnimal from "./components/pages/darAdopcion.js"
import Seguimiento from "./components/pages/seguimiento.js";
import Perfil from "./components/pages/perfil";
import Ramses from "./components/pages/ramses";
import VacunacionPage from "./components/pages/vacunacion.js";
import AdminDashboardPage from "./components/pages/adminDashboardPage.js";

function App() {
 return (
  <Routes>
   <Route path="/ramses" element={<Ramses />} />
   <Route path="/login" element={<Login />} />
   <Route path="/" element={<Home />} />
   <Route path="/register" element={<Register />} />
   <Route path="/home" element={<Home />} />
   <Route path="/mascotas" element={<Adopcion />} />
   <Route path="/registroAnimal" element={<RegistrarAnimal />} />
   <Route path="/reporteDenuncia" element={<Denuncia />} />
   <Route path="/reportePerdida" element={<Perdida />} />
   <Route path="/seguimiento" element={<Seguimiento />} />
   <Route path="/perfil" element={<Perfil />} />
   <Route path="/vacunacion" element={<VacunacionPage />} />
   <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
  </Routes>
 );
}

export default App;
