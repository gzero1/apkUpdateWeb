import React, { useLayoutEffect, useRef, useState } from 'react';
import { useHistory as useNavigation, useParams } from 'react-router-dom';
import api from '../../api';
import BackgroundImage from '../../components/BackgroundImage';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import ClipLoader from 'react-spinners/ClipLoader';
import IAppInfoResponse from '../../@types/api/getInfo.response';
import url from '../../api/url';

const AppInfo: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'stable' | 'unstable'>(
    'stable'
  );
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [basicInfo, setBasicInfo] = useState({
    display_name: 'Loading...',
    github: 'Loading...',
    latestVersion: 'Loading...',
  });
  const navigation = useNavigation();
  const inputFile = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigation.push('/');
    }
    async function getInfo() {
      setLoading(true);
      try {
        const response = await api.get<IAppInfoResponse>(`/info/${name}`);
        setBasicInfo({
          display_name: response.data.display_name,
          github: response.data.repo_url,
          latestVersion: response.data.latest_version,
        });
      } catch (e: any) {
        console.log(e);
        if (e?.response?.status >= 400 && e?.response?.status < 500) {
          navigation.push('/');
          localStorage.clear();
        }

        navigation.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    getInfo();
  }, []);

  const Upload = (file: File) => {
    try {
      var bodyFormData = new FormData();
      bodyFormData.append('file', file);
      bodyFormData.append('version', selectedVersion);
      bodyFormData.append('is_stable', (selectedType === 'stable').toString());

      api.post(`/upload/${name}`, bodyFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          let progress: number = Math.round((event.loaded * 100) / event.total);

          setMessage(`Fazendo upload... ${progress}% completo.`);
          if (progress === 100) {
            setMessage('Arquivo enviado');
            progress = 0;
            setTimeout(() => setMessage(''), 2000);
          }
        },
      });
    } catch (e: any) {
      if (e.response?.data.detail === 'Unauthorized') {
        navigation.push('/');
        localStorage.clear();
      } else {
        setMessage(e.response?.data.detail);
      }
    }
  };

  const Download = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (selectedVersion.length > 0) {
      window.open(
        `${url}/download/${name}/${selectedVersion.replace(/\./g, '_')}`
      );
    } else {
      window.open(`${url}/download/${name}/latest`);
    }
  };

  return (
    <BackgroundImage>
      {!loading ? (
        <Card style={styles.card}>
          <h1 style={styles.title}>{basicInfo.display_name}</h1>
          <h2 style={styles.label}>{message}</h2>
          <div style={styles.basicInfoContainer}>
            <span style={styles.label}>
              Última Versão: {basicInfo.latestVersion}
            </span>
            <span style={styles.label}>
              Github:{' '}
              <a
                style={{ ...styles.label, ...styles.link }}
                href={basicInfo.github}
              >
                {basicInfo.github}
              </a>
            </span>
          </div>
          <div style={styles.inputContainer}>
            <Input
              placeholder="Version"
              value={selectedVersion}
              style={{ width: '70%' }}
              onChange={(e) => {
                const newValue = (e.target as HTMLInputElement).value;
                const semverRegex =
                  /(?<Major>0|(?:[1-9]\d*))(?:\.(?<Minor>0|(?:[1-9]\d*))(?:\.(?<Patch>0|(?:[1-9]\d*)))?(?:\-(?<PreRelease>[0-9A-Z\.-]+))?(?:\+(?<Meta>[0-9A-Z\.-]+))?)?/g;
                if (newValue.length === 0 || newValue.match(semverRegex)) {
                  setSelectedVersion((e.target as HTMLInputElement).value);
                }
              }}
            />
            <div style={styles.typeContainer}>
              <label style={styles.label}>Type: </label>
              <button
                id="stable"
                style={{
                  ...styles.checkbox,
                  backgroundColor:
                    selectedType === 'stable' ? 'lightblue' : '#FFFFFF',
                }}
                onClick={() => setSelectedType('stable')}
              />
              <label htmlFor="stable" style={styles.label}>
                stable
              </label>
              <button
                id="unstable"
                style={{
                  ...styles.checkbox,
                  backgroundColor:
                    selectedType === 'unstable' ? 'lightblue' : '#FFFFFF',
                }}
                onClick={() => setSelectedType('unstable')}
              />
              <label htmlFor="unstable" style={styles.label}>
                unstable
              </label>
            </div>
          </div>

          <div style={styles.versionContainer}>
            <Button style={{ width: '45%' }} onClick={Download}>
              Download
            </Button>
            <Button
              style={{ width: '45%' }}
              onClick={() => {
                inputFile.current!.click();
              }}
            >
              Upload
            </Button>
          </div>

          <input
            type="file"
            id="file"
            ref={inputFile}
            onChange={(e) => {
              if (e.target.files) {
                Upload(e.target.files[0]);
              }
            }}
            style={{ display: 'none' }}
          />
        </Card>
      ) : (
        <Card style={{ ...styles.card, ...{ width: '20vw' } }}>
          <ClipLoader color={'#FFFFFF'} loading={loading} size={50} />
        </Card>
      )}
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
  label: {
    margin: 0,
    color: 'white',
    fontSize: '1.3rem',
    fontFamily: 'Red Hat Display, sans-serif',
  },
  link: {
    textDecoration: 'underscore',
  },
  basicInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  versionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  typeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: '1rem',
  },
  inputContainer: {
    marginTop: '1rem',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  checkbox: {
    backgroundColor: '#FFFFFF',
    width: '1rem',
    height: '1rem',
    border: '',
    borderRadius: '1rem',
    borderWidth: '0.15rem',
    borderColor: 'white',
    borderStyle: 'solid',
  },
};

export default AppInfo;
