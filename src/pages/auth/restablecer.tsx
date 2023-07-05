
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

import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';

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

const enviarEmail = async (data: any) => {
    console.log(data.get("email"));
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
                        Le enviaremos un correo electrónico en cuanto pongamos en marcha nuestro sitio web. 
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
