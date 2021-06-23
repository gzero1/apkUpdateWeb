import React from 'react';
import LandscapeImage from '../../assets/images/landscape.jpeg';

const index: React.FC = ({ children }) => {
  return <div style={styles.bgImage}>{children}</div>;
};

const styles: StyleSheets = {
  bgImage: {
    height: '100vh',
    width: '100vw',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    // backgroundImage: `url(${LandscapeImage})`,

    backgroundImage: `url(https://images.unsplash.com/photo-1508306815155-0a7bc4e00de1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2l0eSUyMHZpZXd8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80)`,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default index;
