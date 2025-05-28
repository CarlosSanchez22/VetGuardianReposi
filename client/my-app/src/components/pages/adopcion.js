import React, { useState, useEffect } from "react";
import "../../styles/Adopcion.css";
import { Link, useNavigate } from "react-router-dom";
import Card from "../card.js";
import Navbar from "../navbar.js";
import Footer from "../footer.js";
import { verAdopciones, adoptarMascota } from "../../api/adopcion.api.js";
import { getUserSession } from "../../functions/userSession";
import { FaPaw, FaPlus } from "react-icons/fa";

const Adopcion = () => {
  const navigate = useNavigate();
  const user = getUserSession();
  
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [navigate, user]);

  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await verAdopciones();
        setMascotas(result.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    fetchData();
  }, []);

  const handleAdoptar = async (id_usuario, id_mascota) => {
    try {
      await adoptarMascota(id_usuario, id_mascota);
      alert("¡Mascota adoptada con éxito!");
      const result = await verAdopciones();
      setMascotas(result.data);
    } catch (error) {
      console.error("Error al adoptar:", error);
      alert("Error al procesar la adopción");
    }
  };

  return (
    <div className="adopcion-page">
      <Navbar />
      <main className="adopcion-container">
        <div className="adopcion-header">
          <h1>
            <FaPaw className="paw-icon" /> Adopta una mascota
          </h1>
          <p className="subtitle">¡No te arrepentirás del amor que te dan!</p>
          
          <Link to="/registroAnimal" className="register-pet-btn">
            <FaPlus /> Registrar animal para adopción
          </Link>
        </div>

        {mascotas.length > 0 ? (
          <div className="mascotas-grid">
            {mascotas.map((mascota) => (
              <Card
                key={mascota.id_mascota}
                id_mascota={mascota.id_mascota}
                nombre={mascota.nombre}
                especie={mascota.especie}
                edad={mascota.edad}
                raza={mascota.raza}
                vacunado={mascota.esta_vacunado}
                esterilizado={mascota.esta_esterilizado}
                descripcion={mascota.descripcion}
                foto={mascota.foto_mascota} 
                adoptHandler={() => handleAdoptar(user, mascota.id_mascota)}
            />
            ))}
          </div>
        ) : (
          <div className="no-pets-message">
            <img 
              src={`${process.env.PUBLIC_URL}/assets/no-pets.png`} 
              alt="No hay mascotas disponibles" 
              className="no-pets-image"
            />
            <h2>Actualmente no hay mascotas disponibles para adopción</h2>
            <p>Pero puedes registrar un animal que necesite un hogar</p>
            <Link to="/registroAnimal" className="register-pet-btn secondary">
              <FaPlus /> Registrar animal
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Adopcion;