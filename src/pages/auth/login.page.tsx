import { object, string, TypeOf } from "zod";
import { useContext, useEffect } from "react";
import { useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import useStore from "../../store";
import Link from "@mui/material/Link";
import { authApi } from "../../api/authApi";

import { Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, Paper, TextField, Typography } from "@mui/material";
import AuthContext from "../../contexts/auth/authContext";
import { ILoginResponse } from "../../api/types";

const loginSchema = object({
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export type LoginInput = TypeOf<typeof loginSchema>;

const LoginPage = () => {
  const { setToken} = useContext(AuthContext);
  const store = useStore();
  const navigate = useNavigate();
  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const {
    reset,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const loginUser = async (data:any) => {
    console.log(
      data.get("email")
           ,data.get("password")
          );
    try {
      
      const email = data.get("email");
      const password = data.get("password")

      store.setRequestLoading(true);
      const res = await authApi.post<ILoginResponse>("/api/auth/login", {
        usu_email: email,
        usu_contra:password,
      });
      setToken(res.data.token);
      store.setRequestLoading(false);
      switch (res.data.usuario.rol_id) {
        case 1:
          navigate("/perfil/profile-admin");
          break;
        case 2:
          navigate("/perfil/profile-duenio");
          break;
        case 3:
          navigate("/perfil/profile-turista");
          break;
        default:
          break;
      }
    } catch (error: any) {
      store.setRequestLoading(false);
      const resMessage = error.response?.data?.msg || "Usuario / Password no son correctos";
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };
  const handleSubmit = (event:any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    loginUser(data);
  };

  return (
    <Container component="main" maxWidth="lg">
    <Box
        sx={{
          marginTop: 8,
        }}
      >

        <Grid container>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: "url(https://i.ibb.co/5jYyd8R/imagen.jpg)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square>
            <Box
             sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            >
             <Typography component="h1" variant="h5">
             Iniciar sesión
              </Typography>

              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Recordarme"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Iniciar sesión
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="/restablecer" variant="body2">
                        ¿Has olvidado tu contraseña?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2">
                      {"¿Necesita una cuenta? Registrate aquí"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
 
          </Grid>
        </Grid>

    </Box>
    </Container>
  );
};

export default LoginPage;
