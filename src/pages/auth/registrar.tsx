
import {
  Box,
  Typography,
  Hidden,
  Container,
  Button,
  Grid,

  TextField,
  Avatar,
  Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { authApi } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


const currencies = [
    {
      value: 3,
      label: 'Turista'
    },
    {
      value: 2,
      label: 'Dueño Local'
    }
  ];

const GridWrapper = styled(Grid)(
  ({ theme }) => `
    background: ${theme.colors.gradients.black1};
`
);

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);


function FormRegistrar() {
    const [currency, setCurrency] = useState();
    const navigate = useNavigate();
    const registrar = async (data: FormData) => {
        

        const verificarCampo = (campo: string, mensaje: string) => {
          if (!data.get(campo)) {
            toast.warning(mensaje, {
              position: "top-right",
            });
            throw new Error("Falta campo");
          }
        };
      
        try {
          verificarCampo("nombre", "Advertencia - Falta el nombre");
          verificarCampo("apellido", "Advertencia - Falta el apellido");
          verificarCampo("numero", "Advertencia - Falta el número de celular");
          verificarCampo("email", "Advertencia - Falta el correo electrónico");
          verificarCampo("contraseña", "Advertencia - Falta contraseña");
          if (!currency) {
            const resMessage = "Advertencia - Seleccione su tipo decuenta";
            toast.warning(resMessage, {
              position: "top-right",
            });
            return;
        }
          const res = await authApi.post<IPersona>("/api/personas", {
            per_cel: data.get('numero'),
            per_nombres: data.get('nombre'),
            per_apellidos: data.get('apellido'),
            per_estado: "A",
          });
      
          const res2 = await authApi.post<IUsuario>("/api/usuarios", {
            per_id: res.data.per_id,
            rol_id: parseInt(currency, 10),
            usu_email: data.get('email'),
            usu_contra: data.get('contraseña'),
            usu_estado: "A"
          });
          
          console.log(res2);
          const resMessage = "Registrado correctamente";
          toast.success(resMessage, {
            position: "top-right",
          });
          navigate("/");
        } catch (error: any) {
          if (error.message !== "Falta campo") {
            const resMessage = error.response?.data?.msg || "Error - datos incorrectos";
            toast.error(resMessage, {
              position: "top-right",
            });
          }
        }
      };
      

    const handleChange = (event:any) => {
        setCurrency(event.target.value);
    };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
   
    registrar(data);
  };

  return (
    <>
      <MainContent>
        <Grid
          container
          sx={{ height: '100%' }}
          alignItems="stretch"
          spacing={0}
        >
          <Grid
            xs={12}
            md={6}
            alignItems="center"
            display="flex"
            justifyContent="center"
            item
          >
            <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
          Regístrate
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="nombre"
                  required
                  fullWidth
                  id="nombre"
                  label="Nombre"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="apellido"
                  label="Apellido"
                  name="apellido"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
              <TextField
                  required
                  fullWidth
                  id="numero"
                  label="Número de celular"
                  name="numero"
                  autoComplete="phone"
                />
            </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo Electronico"
                  name="email"
                  autoComplete="email"
                />
                 
              </Grid>
             
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="contraseña"
                  label="Contraseña"
                  type="password"
                  id="contraseña"
                  autoComplete="new-password"
                />
              </Grid>

              <Grid item xs={12}>
  <TextField
    fullWidth
    id="filled-select-currency-native"
    select

    value={currency}
    onChange={handleChange}
    SelectProps={{
      native: true
    }}
  >
    <option value="">Seleccione su tipo de cuenta</option>
    {currencies.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </TextField>
</Grid>



            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrar
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                ¿Ya tiene una cuenta? Iniciar sesión
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
          </Grid>
          <Hidden mdDown>
            <GridWrapper
              xs={12}
              md={6}
              alignItems="center"
              display="flex"
              justifyContent="center"
              item
            >
              {/* Aquí puedes agregar tu imagen */}
              <img
                alt="Hidden Image"
                src="https://www.turismodeobservacion.com/media/fotografias/observando-el-atardecer-75761-xl.jpg"
                height="100%"
                width="100%"
              />
            </GridWrapper>
          </Hidden>
        </Grid>
      </MainContent>
    </>
  );
}

export default FormRegistrar;
