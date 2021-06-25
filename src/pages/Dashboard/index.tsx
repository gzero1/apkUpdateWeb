import React, { useLayoutEffect } from 'react';
import BackgroundImage from '../../components/BackgroundImage';
import Card from '../../components/Card';
import { useHistory as useNavigation } from 'react-router';
import Button from '../../components/Button';
import { VscTriangleRight } from 'react-icons/vsc';

const Dashboard: React.FC = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigation.push('/');
    }
  }, []);

  return (
    <BackgroundImage>
      <Card style={styles.card}>
        <h1 style={styles.title}>Choose an app</h1>
        <Button
          onClick={(e) => {
            e.preventDefault();
            navigation.push('/dashboard/bla_bla');
          }}
        >
          Blá Blá <VscTriangleRight />
        </Button>
        {/* <Button
          onClick={(e) => {
            e.preventDefault();
            navigation.push('/dashboard/king');
          }}
        >
          King
        </Button> */}
        <Button
          onClick={(e) => {
            e.preventDefault();
            navigation.push('/dashboard/maq');
          }}
        >
          Maq <VscTriangleRight />
        </Button>
      </Card>
    </BackgroundImage>
  );
};

const styles: StyleSheets = {
  card: {
    height: '40vh',
    backgroundColor: 'rgba(27, 27, 27, 0.3)',
    boxShadow: 'inset 0 0 150px #86bef7',
    backdropFilter: 'blur(2rem) brightness(1.2) contrast(2rem) opacity(1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  input: {
    height: '3rem',
    width: '15rem',

    paddingLeft: '2rem',
    paddingRight: '2rem',

    border: 0,
    borderStyle: 'solid',
    borderRadius: '100rem',

    fontFamily: 'Red Hat Display, sans-serif',
    fontSize: '1.3rem',
  },
  title: {
    margin: 0,
    color: 'white',
    fontSize: '3rem',
    fontFamily: 'Red Hat Display, sans-serif',
  },
  appButton: {
    height: '3rem',
    width: '11rem',

    marginTop: '1rem',

    border: 0,
    borderStyle: 'solid',
    borderRadius: '100rem',

    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    fontFamily: 'Red Hat Display, sans-serif',
  },
  forgotPasswordContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '90%',
  },
  forgotPassword: {
    margin: 0,
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'lighter',
    // marginBottom: '2rem',
    fontFamily: 'Red Hat Display, sans-serif',
  },
  signUp: {
    color: 'white',
    // textDecoration: 'underline',
    cursor: 'pointer',
    fontFamily: 'Red Hat Display, sans-serif',
  },
};

export default Dashboard;
