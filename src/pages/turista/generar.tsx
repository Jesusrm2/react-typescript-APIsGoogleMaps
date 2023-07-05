import { useState } from "react";

import { IDetalleItinerario } from "../../interfaces/tipos-lugares";
import FormularioGuia from "./formulario";
import Itinerario from "./itinerario";

const GenerarItinerario = () => {
  const [responseValue, setResponseValue] = useState<IDetalleItinerario | null>(null);
  const [showRequestSite, setShowRequestSite] = useState(true);

  const handleRequestComplete = (result: IDetalleItinerario[]) => {
    setResponseValue(result[0]); // Obtén el primer elemento del arreglo si solo se espera un elemento
    setShowRequestSite(false); // Ocultar RequestSite después de completar la solicitud
  };

  return (
    <>
      {showRequestSite ? (
        <FormularioGuia onRequestComplete={handleRequestComplete} />
      ) : (
        <Itinerario responseValue={responseValue} />
      )}
    </>
  );
};

export default GenerarItinerario;