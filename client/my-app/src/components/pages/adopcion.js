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
  const user = getUserSession(); // user es ahora el objeto { id_usuario, role, ..., token }

  useEffect(() => {
    // Si la sesión del usuario es null o no tiene un id_usuario válido, redirige al login
    if (!user || !user.id_usuario) {
      navigate("/login");
    }
  }, [navigate, user]);

  const [mascotas, setMascotas] = useState([]); // Inicializado como array vacío

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await verAdopciones();
        // CORRECCIÓN AQUÍ: result ya contiene el array de datos, no necesitas .data
        setMascotas(result); 
      } catch (error) {
        console.error("Error fetching pets:", error);
        // Opcional: Mostrar un mensaje al usuario si hay un error al cargar
        // setMessage("Error al cargar las mascotas disponibles.");
      }
    };
    fetchData();
  }, []);

  const handleAdoptar = async (id_usuario, id_mascota) => {
    try {
      await adoptarMascota(id_usuario, id_mascota);
      alert("¡Mascota adoptada con éxito!");
      // Después de adoptar, recarga la lista de mascotas
      const result = await verAdopciones();
      // CORRECCIÓN AQUÍ: result ya contiene el array de datos
      setMascotas(result); 
    } catch (error) {
      console.error("Error al adoptar:", error);
      alert("Error al procesar la adopción. Por favor, inténtalo de nuevo.");
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

          {/* Solo mostrar el botón de registro de animal si el usuario es un refugio o admin,
              o si quieres que cualquier usuario pueda registrar */}
          <Link to="/registroAnimal" className="register-pet-btn">
            <FaPlus /> Registrar animal para adopción
          </Link>
        </div>

        {/* Verificación más robusta: Comprobar si 'mascotas' es un array y tiene elementos */}
        {Array.isArray(mascotas) && mascotas.length > 0 ? (
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
                // CORRECCIÓN AQUÍ: Pasa user.id_usuario, no el objeto user completo
                adoptHandler={() => handleAdoptar(user.id_usuario, mascota.id_mascota)} 
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