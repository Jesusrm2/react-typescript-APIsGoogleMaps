import { useEffect, useContext } from "react";
import useStore from "../../store";
import AuthContext from "../../contexts/auth/authContext";

const RegisterSite = () => {
  const store = useStore();
  const user = store.authUser;
  const { decodedToken, setDecodedToken } = useContext(AuthContext);

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
      <h1>Aquí registrare lugares</h1>
      <p>ID: {user?.per_id}</p>
      <p>Nombre: {user?.per_nombres}</p>
      <p>Token: {JSON.stringify(decodedToken)}</p>
      {/* Otros elementos de la página */}
    </div>
  );
};

export default RegisterSite;