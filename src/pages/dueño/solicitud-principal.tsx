import { useState } from "react";

import { IPuntoInteres } from "../../interfaces/pi";
import Solicitud from "./formulario-solicitud";
import FormularioSitio from "./formulario-lugar";

const PrincipalComponent = () => {
  const [responseValue, setResponseValue] = useState<IPuntoInteres | null>(null);
  const [showRequestSite, setShowRequestSite] = useState(true);

  const handleRequestComplete = (result: IPuntoInteres) => {
    setResponseValue(result);
    setShowRequestSite(false); // Ocultar RequestSite después de completar la solicitud
  };

  return (
    <>
      {showRequestSite ? (
        <FormularioSitio onRequestComplete={handleRequestComplete} />
      ) : (
        <Solicitud responseValue={responseValue} />
      )}
    </>
  );
};

export default PrincipalComponent;