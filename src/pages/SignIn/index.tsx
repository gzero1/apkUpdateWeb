import React, { useState } from 'react';
import BackgroundImage from '../../components/BackgroundImage';
import { useHistory as useNavigation } from 'react-router-dom';

import api from '../../api';
import Card from '../../components/Card';
import Input from '../../components/Input';
import ILoginResponse from '../../@types/api/login.response';
import ILoginData from '../../@types/api/login.data';
import { AxiosResponse } from 'axios';

const SignIn: React.FC = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async () => {
    try {
      console.log('posting');
      const formdata = new FormData();
      formdata.append('username', user);
      formdata.append('password', password);

      const response = await api.post<
        ILoginData,
        AxiosResponse<ILoginResponse>
      >('auth/jwt/login', formdata);
      if (!response) {
        throw Error('Unknown Error');
      }
      localStorage.setItem('authToken', response.data.access_token);
      navigation.push('/dashboard');
    } catch (error: any) {
      if (Array.isArray(error.response?.data.detail)) {
        setErrorMessage(error.response?.data.detail[0].msg);
      } else {
        setErrorMessage(error.response?.data.detail);
      }
    }
  };
  return (
    <BackgroundImage>
      <Card style={styles.card}>
        <h1 style={styles.title}>G01 Deployer</h1>
        <h3 style={styles.error}>{errorMessage}</h3>
        <Input
          type="user"
          placeholder="Username"
          value={user.replace(' ', '')}
          onChange={(e) => setUser((e.target as HTMLInputElement).value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        <Input
          style={{
            letterSpacing: password.length > 0 ? '0.3rem' : 0,
          }}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />

        <button
          style={styles.submitButton}
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <h3>Login</h3>
        </button>
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
  title: {
    margin: 0,
    color: 'white',
    fontSize: '3rem',
    fontFamily: 'Red Hat Display, sans-serif',
  },
  error: {
    margin: 0,
    color: '#ee2a2a',
    fontSize: '1rem',
    fontWeight: 'normal',
    fontFamily: 'Red Hat Display, sans-serif',
  },
  submitButton: {
    height: '3rem',
    width: '9rem',

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

export default SignIn;
