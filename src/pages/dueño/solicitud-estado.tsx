import {
    Box,
    Typography,
    Container,
    Divider,
    IconButton,
    Tooltip
  } from '@mui/material';

  import { styled } from '@mui/material/styles';
  import FacebookIcon from '@mui/icons-material/Facebook';
  import TwitterIcon from '@mui/icons-material/Twitter';
  import InstagramIcon from '@mui/icons-material/Instagram';
  
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
  
  function EstadoSolicitud() {
    return (
      <>
        <div><h1>.</h1></div>
        <MainContent>
          <Container maxWidth="md">

            <Box textAlign="center">
              <Container maxWidth="xs">
                <Typography variant="h2" sx={{ mt: 4, mb: 2 }}>
                ¡Se ha enviado exitosamente la solicitud de punto de interés!
                </Typography>
                <Typography
                  variant="h3"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{ mb: 4 }}
                >
                 Gracias por su solicitud de punto de interés. Estamos procesando su solicitud y verificando la información proporcionada. 
                </Typography>
              </Container>

            </Box>
            <Divider sx={{ my: 4 }} />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography component="span" variant="subtitle1">
                  Teléfono:{' '}
                </Typography>
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="text.primary"
                >
                  + 593 998 563 245
                </Typography>
              </Box>
              <Box>
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
        </MainContent>
      </>
    );
  }
  
  export default EstadoSolicitud;
  