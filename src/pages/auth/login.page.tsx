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

import { Box, Container, Grid, Typography } from "@mui/material";
import AuthContext from "../../contexts/auth/authContext";
import { ILoginResponse } from "../../api/types";
import imagen from "../../assets/auth.png";

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
    loginUser(values);
  };
  return (
    <Box
    sx={{
      backgroundColor: "ct-blue.600",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "ct-dark.200",
              borderRadius: "xl",
              padding: "40px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
 
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              align="center"
              fontWeight={600}
              color="ct-yellow.600"
              mb={4}
            >     
Bienvenido 
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="ct-dark.200"
              mb={4}
            >
              Inicia sesión para tener acceso
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
          <Box
            sx={{
              width:"80vh",
              backgroundImage: `url(../../../assets/auth.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100%",
            }}
            
          ><img src={imagen} alt='logo' width='200px'></img></Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
  );
};

export default LoginPage;
