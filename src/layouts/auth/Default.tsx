import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function AuthIllustration(props: { children: any; illustrationBackground: any; }) {
  const { children, illustrationBackground } = props;

  return (
    <Box position='relative' minHeight='100vh'>
      <Box
        height={{
          sm: 'initial',
          md: 'unset',
          lg: '100vh',
          xl: '97vh'
        }}
        width='100%'
        maxWidth={{ md: '66%', lg: '1313px' }}
        mx='auto'
        pt={{ sm: '50px', md: '0px' }}
        px={{ lg: '30px', xl: '0px' }}
        display='flex'
        flexDirection='column'
      >
        <Link to='/admin' style={{ width: 'fit-content', marginTop: '40px' }}>
          {/* Add your logo or navigation link */}
        </Link>
        {children}
        <Box
          display={{ xs: 'none', md: 'block' }}
          height='100%'
          minHeight='100vh'
          width={{ lg: '50vw', '2xl': '44vw' }}
          position='absolute'
          right='0px'
        >
          <Box
            sx={{
              backgroundImage: `url(${illustrationBackground})`,
              backgroundPosition: '50%',
              backgroundSize: 'cover',
              position: 'absolute',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'flex-end',
              borderBottomLeftRadius: { lg: '120px', xl: '200px' }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

AuthIllustration.propTypes = {
  illustrationBackground: PropTypes.string,
  image: PropTypes.any
};

export default AuthIllustration;

