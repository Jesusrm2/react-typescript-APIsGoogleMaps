import { object, string, TypeOf } from "zod";
import { useContext, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../../components/FormInput";
import { LoadingButton } from "../../components/LoadingButton";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import useStore from "../../store";

import { authApi } from "../../api/authApi";

import { Box, Container, CssBaseline, Grid, Paper, Typography } from "@mui/material";
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
  const { setToken } = useContext(AuthContext);
  const store = useStore();
  const navigate = useNavigate();

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const loginUser = async (data: LoginInput) => {
    try {
      store.setRequestLoading(true);
      const res = await authApi.post<ILoginResponse>("/api/auth/login", {
        usu_email: data.email,
        usu_contra: data.password,
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

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    console.log("hola "+values)
    loginUser(values);
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
              backgroundImage: "url(https://source.unsplash.com/random)",
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
                Sign in
              </Typography>

              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      
                      <FormInput
                        label="Correo"
                        
                        name="email"
                        type="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormInput
                        label="Contraseña"
                        name="password"
                        type="password"
                      />
                    </Grid>
                    <Grid item xs={12} textAlign="right">
                      <Link to="/forgotpassword">Has olvidado tu contraseña?</Link>
                    </Grid>
                    <Grid item xs={12}>
                      <LoadingButton
                        
                        loading={store.requestLoading}
                      >
                        Acceso
                      </LoadingButton>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" align="center">
                        Necesita una cuenta?{" "}
                        <Link to="/register" className="text-ct-blue-600">
                          Registrate aquí
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
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
