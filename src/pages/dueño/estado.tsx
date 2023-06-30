

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useStore from '../../store';
import { useEffect, useState } from 'react';
import { authApi } from '../../api/authApi';

const Solicitudes = () => {
    const store = useStore();
  const user = store.authUser;
  const [data, setData] = useState<IEstados[]>([]);

  useEffect(() => {
    // Verificar si hay un usuario almacenado en el almacenamiento local
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      store.setAuthUser(JSON.parse(storedUser));
    }

    if (user?.per_id) {
      obtenernerEstados();
    }
  }, [user?.per_id]);

  interface IEstados {
    pi_nombre: string;
    pi_direccion: string;
    pi_soli_descripcion: string;
    pi_soli_fecha: string;
    pi_estado: string;
  }

  const obtenernerEstados = async () => {
    try {
      const res = await authApi.get<IEstados[]>(`/api/estadoSoli/${user?.per_id}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user?.per_id) {
    return null; // Renderizar algo diferente o simplemente no renderizar nada mientras se espera el valor de user?.per_id
  }
  
    return (
      <>
        <div>
          <h1>.</h1>
        </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="left">Direccion</TableCell>
                <TableCell align="left">Motivo</TableCell>
                <TableCell align="right">Fecha</TableCell>
                <TableCell align="right">Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.pi_nombre}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.pi_nombre}
                  </TableCell>
                  <TableCell align="left">{row.pi_direccion}</TableCell>
                  <TableCell align="left">{row.pi_soli_descripcion}</TableCell>
                  <TableCell align="right">{row.pi_soli_fecha}</TableCell>
                  <TableCell align="right">
                  {row.pi_estado === "I" ? "Pendiente" : row.pi_estado === "A" ? "Aceptado" : ""}
                </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };
  
  export default Solicitudes;