import { useEffect, useContext } from "react";
import useStore from "../../store";
import AuthContext from "../../contexts/auth/authContext";
import RequestSite from "./solicitar-lugar";

const Solicitud = () => {
  const store = useStore();
  const user = store.authUser;
  const { decodedToken, setDecodedToken } = useContext(AuthContext);
  const handleRequestComplete = (result:any) => {
    // Aquí puedes utilizar el resultado de la petición
    console.log(result);
    // Realiza las acciones necesarias con el resultado
  };
  useEffect(() => {
    // Verificar si hay un usuario almacenado en el almacenamiento local
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      store.setAuthUser(JSON.parse(storedUser));
    }
    // Verificar si hay un token decodificado almacenado en el almacenamiento local
    const storedDecodedToken = localStorage.getItem("decodedToken");
    if (storedDecodedToken) {
      const decodedToken = JSON.parse(storedDecodedToken);
      setDecodedToken(decodedToken); // Establecer el valor de decodedToken en el contexto
    }
  }, []);

  return (
    <div>
      <h1>Aquí generare la solicitud</h1>
      <p>ID: {user?.per_id}</p>
      <p>Nombre: {user?.per_nombres}</p>
      <p>Token: {JSON.stringify(decodedToken)}</p>
      <RequestSite onRequestComplete={handleRequestComplete} />
      {/* Otros elementos de la página */}
    </div>
  );
};

export default Solicitud;