import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserSession } from "../../functions/userSession";
import '../../styles/Veterinarios.css';
import Footer from '../footer';
import Navbar from '../navbar';

const Vacunacion = () => {
 const navigate = useNavigate()
 const user = getUserSession()
 useEffect(() => {
  if (user === null) {
   navigate("/login")
  }
 }, []);
 return (
  <>
   <Navbar/>
  <div className="container">
      <h1>VACUNACIÓN</h1>
      <div className="box">
        <h2>Veterinarios Confiables</h2>
        <div className="vet">
          <p>Dr. John Carlos Sanchez Garcia</p>
          <p>Calle Erizo de mar elconchalito y cangrejo #8976 Col. Esperanza 1</p>
          <p>Teléfono: 6131589643</p>
          <p>Veterinaria johnS</p>
        </div>
        
      </div>
    </div>
   <Footer/>
  </>
 )
}

export default Vacunacion;
