import { useState } from 'react';
import { Modal, Box, Button, Typography, Grid, TextField, Divider, Tooltip, IconButton, useTheme } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import { IPiDia } from '../../interfaces/tipos-lugares';
interface ModalCalificacionProps {
  poi:IPiDia;
}

const ModalCalificacion = ({ poi }: ModalCalificacionProps) => {
  const [section, setSection] = useState<'lugar' | 'calificar' | 'salir'>('lugar');
  const [open, setOpen] = useState(false);
  const [currency] = useState();
  const currencies = [
    {
      value: 5,
      label: '5'
    },
    {
      value: 4,
      label: '4'
    },
    {
      value: 3,
      label: '3'
    },
    {
      value: 2,
      label: '2'
    },
    {
      value: 1,
      label: '1'
    },
    {
      value: 0,
      label: '0'
    }
  ];
  const handleRate = () => {
    console.log('Calificando lugar:', poi.poiObj?.name);
    setSection('calificar');
    setOpen(true);
  };

  const handleClose = () => {
    setSection('lugar');
    setOpen(false);
  };

  const handleSectionChange = (newSection: 'lugar' | 'calificar' | 'salir') => {
    setSection(newSection);
    if (newSection === 'salir') {
      handleClose();
    }
  };
  const theme = useTheme();

  const hasPhoto = poi.poiObj?.photos && poi.poiObj?.photos.length > 0;
  const photoUrl = hasPhoto ? `https://maps.googleapis.com/maps/api/place/photo?maxheight=200&photoreference=${poi.poiObj?.photos[0].photo_reference}&key=AIzaSyC4i2ej2NQxOwvw9hpGkTZVpADP8FYAuKk` : '';
  return (
    <>
      <Tooltip title="Calificar lugar" arrow>
        <IconButton
        onClick={handleRate}
          sx={{
            '&:hover': {
              background: theme.colors.primary.lighter
            },
            color: theme.palette.primary.main
          }}
          color="inherit"
          size="small"
        >
          <CommentIcon fontSize="small" />
        </IconButton>
      </Tooltip>


      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box component="form" sx={{ width: '80%', maxWidth: 500, bgcolor: 'white', p: 2, '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
          <div style={{ display: section === 'lugar' ? 'block' : 'none' }}>
            <Grid container spacing={2}>
              {hasPhoto && (
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" justifyContent="center" height={200}>
                    <img src={photoUrl} alt="Lugar" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  </Box>
                </Grid>
              )}
              <Grid item xs={12} md={hasPhoto ? 6 : 12}>
                <Typography variant="h4" align="center">
                  Información del lugar
                </Typography>
                <Divider />
                <TextField
                  disabled
                  id="standard-disabled"
                  label="Nombre:"
                  defaultValue={poi?.poiObj?.name}
                  variant="standard"
                />
                <TextField
                  disabled
                  id="standard-disabled"
                  label="Dirección:"
                  defaultValue={poi?.poiObj?.vicinity}
                  variant="standard"
                />
                <TextField
                  disabled
                  id="standard-disabled"
                  label="Categorias: "
                  defaultValue={poi?.poiObj?.types}
                  variant="standard"
                />
              </Grid>
            </Grid>

          </div>

          <div style={{ display: section === 'calificar' ? 'block' : 'none' }}>
            <Grid item xs={12} sm={11}>
              <Typography variant="h4" align="center">
                Calificar el lugar
              </Typography>
              <Divider />

              <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} noValidate autoComplete="off">
                <div style={{ marginTop: '16px', textAlign: 'right' }}>
                  <Button variant="contained" color="primary">
                    Subir Calificación
                  </Button>
                </div>

                <TextField
                  id="standard-select-currency-native"
                  select
                  fullWidth
                  label="Calificación"
                  value={currency}
                  SelectProps={{
                    native: true
                  }}
                  helperText="5: ¡Excelente! - 0: Malísimo."
                  variant="standard"
                >
                  {currencies.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>

                <TextField
                  required
                  fullWidth
                  type="text"
                  id="comentario"
                  label="Comentario"
                  variant="standard"
                  name="comentario"
                />
              </Box>
            </Grid>

          </div>

          <div style={{ display: section === 'salir' ? 'block' : 'none' }}>
            <Typography variant="h4" align="center">
              ¿Deseas salir?
            </Typography>
            <Button variant="contained" color="primary" onClick={handleClose}>
              Salir
            </Button>
          </div>

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleSectionChange('lugar')}
              disabled={section === 'lugar'}
              style={{ marginRight: '8px' }}
            >
              Lugar
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleSectionChange('calificar')}
              disabled={section === 'calificar'}
              style={{ marginRight: '8px' }}
            >
              Calificar
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleSectionChange('salir')}
              disabled={section === 'salir'}
            >
              Salir
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ModalCalificacion;
