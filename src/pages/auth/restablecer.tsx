
import {
  Box,
  Typography,
  Container,
  Divider,
  OutlinedInput,
  IconButton,
  Tooltip,
  FormControl,
  InputAdornment,
  Button,
  FormHelperText
} from '@mui/material';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import { authApi } from '../../api/authApi';

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


const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
`
);

const ButtonNotify = styled(Button)(
  ({ theme }) => `
    margin-right: -${theme.spacing(1)};
`
);
interface IRestablecer {
  msg: string;
}


const enviarEmail = async (data: any) => {
    console.log(data.get("email"));
     if (!data.get("email")) {
      const resMessage = "Error - Falta el correo electronico";
      toast.error(resMessage, {
        position: "top-right",
      });
      return;
    }
    try {
      const res = await authApi.post<IRestablecer>("/api/auth/reset", {
          usu_email: data.get("email"),
      });

      const resMessage = res.data.msg || "Error - datos incorrectos";
      toast.success(resMessage, {
        position: "top-right",
      });

    } catch (error:any) {
       const resMessage = error.response?.data?.msg || "Error - datos incorrectos";
      toast.error(resMessage, {
        position: "top-right",
      });
    }
}

const handleSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    enviarEmail(data);
  };


function StatusComingSoon() {

  return (
    <>
      <MainContent>
        <Container maxWidth="md">

          <Box textAlign="center" mb={3}>
            <Container maxWidth="xs">

              <Typography variant="h1" sx={{ mt: 15, mb: 2 }}>

                    Restablece tu contraseña
              </Typography>
              <Typography
                variant="h3"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 4 }}
              >
                Restablece tu contraseña enviando una nueva al correo electrónico del usuario.
              </Typography>
            </Container>
            <img
              alt="Coming Soon"
              height={200}
              src="https://pathwayport.com/saasland/images/reset_pass.png"
            />
          </Box>

          <Container maxWidth="sm">
            <Box component="form"
                  onSubmit={handleSubmit}
                   sx={{ textAlign: 'center', p: 4 }}>
              <FormControl variant="outlined" fullWidth>
                <OutlinedInputWrapper
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Introduzca aquí su dirección de correo..."
                  endAdornment={
                    <InputAdornment position="end">
                      <ButtonNotify type="submit" variant="contained" size="small">
                        Enviar
                      </ButtonNotify>
                    </InputAdornment>
                  }
                  startAdornment={
                    <InputAdornment position="start">
                      <MailTwoToneIcon />
                    </InputAdornment>
                  }
                />
                <FormHelperText>
                        Se enviará un correo electrónico cuando pulse el boton enviar. 
                </FormHelperText>
              </FormControl>
              <Divider sx={{ my: 4 }} />
              <Box sx={{ textAlign: 'center' }}>
                <Tooltip arrow placement="top" title="Facebook">
                  <IconButton color="primary">
                    <FacebookIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="top" title="Twitter">
                  <IconButton color="primary">
                    <TwitterIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="top" title="Instagram">
                  <IconButton color="primary">
                    <InstagramIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Container>
        </Container>
      </MainContent>
    </>
  );
}

export default StatusComingSoon;
