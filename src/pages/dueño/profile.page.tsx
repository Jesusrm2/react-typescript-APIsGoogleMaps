import { useContext, useEffect} from "react";
import { toast } from "react-toastify";
import { authApi } from "../../api/authApi";
import useStore from "../../store";
import AuthContext from "../../contexts/auth/authContext";
import jwtDecode from "jwt-decode";

const ProfilePageDuenio = () => {
  const store = useStore();
  const { token, setToken} = useContext(AuthContext);
  //const [decodedToken, setDecodedToken] = useState<any>(null);
  const { decodedToken, setDecodedToken } = useContext(AuthContext);

  const getUser = async (decoded: any) => {
    try {
      store.setRequestLoading(true);
      const response = await authApi.get<Ipersona>(`api/personas/${decoded?.per_id}`);
      store.setRequestLoading(false);
      store.setAuthUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("decodedToken", JSON.stringify(decoded));
    } catch (error: any) {
      store.setRequestLoading(false);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    // Verificar si hay un token almacenado en el almacenamiento local
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    // Guardar el token en el almacenamiento local cuando cambie
    localStorage.setItem("token", token || "");
    
    // Decodificar el token JWT para obtener la información
    let decodedToken: any = null;
    if (token) {
      try {
        decodedToken = jwtDecode(token);
        setDecodedToken(decodedToken);
      } catch (error) {
        // Manejar errores al decodificar el token
        console.error("Error al decodificar el token:", error);
      }
    }

    if (decodedToken) {

      getUser(decodedToken);
    }
  }, [token]);

  const user = store.authUser;

  return (
    <section className="bg-ct-blue-600 min-h-screen pt-20">
      <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
        <div>
          <p className="text-5xl font-semibold">Profile Page DUENIO</p>
          <div className="mt-8">
            <p className="mb-4">ID: {user?.per_id}</p>
            <p className="mb-4">Nombre: {user?.per_nombres}</p>
            <p className="mb-4">Apellido: {user?.per_apellidos}</p>
            <p className="mb-4">Estado: {user?.per_estado}</p>
            <p>Token: {token}</p>
            <p>Info token: {JSON.stringify(decodedToken)}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePageDuenio;
