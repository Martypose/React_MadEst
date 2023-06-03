import TablasDetectadasChart from '../utils/TablasDetectadasChart.js';
import React from 'react';

function AnalisisProduccion() {
    return (
        <div className="analisis-produccion-container">
            <h1>Analisis de Producción</h1>

            <TablasDetectadasChart />

            {/* Otros componentes o contenido pueden ir aquí */}
        </div>
    );
}

export default AnalisisProduccion;