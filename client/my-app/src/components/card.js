import React from "react";
import "../styles/Card.css";
import { FaDog, FaCat, FaSyringe, FaCut } from "react-icons/fa";

const Card = (props) => {
  const { 
    nombre, 
    especie, 
    edad, 
    raza, 
    vacunado, 
    esterilizado, 
    descripcion, 
    foto, 
    adoptHandler 
  } = props;

  return (
    <div className="pet-card">
      <div className="pet-image-container">
        {foto ? (
          <img 
            src={`data:image/jpeg;base64,${foto}`} 
            alt={nombre} 
            className="pet-image"
          />
        ) : (
          <div className="pet-image-placeholder">
            {especie === 'Perro' ? <FaDog size={50} /> : <FaCat size={50} />}
          </div>
        )}
      </div>
      
      <div className="pet-details">
        <h3 className="pet-name">{nombre}</h3>
        <div className="pet-basic-info">
          <span className="pet-breed">{raza}</span>
          <span className="pet-age">{edad} años</span>
        </div>
        
        <div className="pet-medical-info">
          <div className={`medical-tag ${vacunado === 'si' ? 'vaccinated' : 'not-vaccinated'}`}>
            <FaSyringe /> {vacunado === 'si' ? 'Vacunado' : 'No vacunado'}
          </div>
          <div className={`medical-tag ${esterilizado === 'si' ? 'sterilized' : 'not-sterilized'}`}>
            <FaCut /> {esterilizado === 'si' ? 'Esterilizado' : 'No esterilizado'}
          </div>
        </div>
        
        <p className="pet-description">{descripcion}</p>
        
        <button 
          className="adopt-button"
          onClick={adoptHandler}
        >
          Adoptar a {nombre}
        </button>
      </div>
    </div>
  );
};

export default Card;