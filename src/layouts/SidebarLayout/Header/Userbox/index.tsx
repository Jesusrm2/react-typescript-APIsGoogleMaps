import { useContext, useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,

  Popover,
  Typography
} from '@mui/material';


import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import AuthContext from '../../../../contexts/auth/authContext';
import useStore from '../../../../store';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {

  const store = useStore();
  const user = store.authUser;
  const { decodedToken, setDecodedToken } = useContext(AuthContext);

  const navigate = useNavigate();
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };
  const logoutUser = () => {
    // Borrar el token del almacenamiento local
    localStorage.removeItem("token");
    // Restablecer los valores en el context
    setDecodedToken(null);
    // Redirigir a la página de inicio de sesión u otra página según sea necesario
    navigate("/");
  };





  useEffect(() => {
    // Verificar si hay un usuario almacenado en el almacenamiento local
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      store.setAuthUser(JSON.parse(storedUser));
    }
    // Verificar si hay un token decodificado almacenado en el almacenamiento local
    const storedDecodedToken = localStorage.getItem("decodedToken");
    if (storedDecodedToken) {
      const decodedToken = JSON.parse(storedDecodedToken);
      setDecodedToken(decodedToken); // Establecer el valor de decodedToken en el contexto
    }
  }, []);

  const rol = decodedToken?.rol_id;
  let rolString = '';

  switch (rol) {
    case 1:
      rolString='Administrador' ;
      break;
    case 2:
      rolString='Dueño Local' ;
      break;
    case 3:
      rolString='Turista' ;
      break;
    default:
      rolString  = ""; // Opcionalmente, puedes mostrar un componente por defecto para otros roles
      break;
  }

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
      <Avatar variant="rounded" alt="" src="../../../assets/perfil.jpg"/>
        <Hidden mdDown>
          <UserBoxText>
              <UserBoxLabel variant="body1">{user?.per_nombres} {user?.per_apellidos}</UserBoxLabel>
            <UserBoxDescription variant="body2">
            {rolString}
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">

          
        <Avatar variant="rounded" alt="" src="../../../assets/perfil.jpg"/>
          <UserBoxText>
            <UserBoxLabel variant="body1">{user?.per_nombres}</UserBoxLabel>
            <UserBoxDescription variant="body2">
            {rolString}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
    
        <Divider />
        <Box sx={{ m: 1 }}>
        <Button onClick={logoutUser} color="primary" fullWidth >
            <LockOpenTwoToneIcon  sx={{ mr: 1 }} />
            Cerrar Sesión
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
