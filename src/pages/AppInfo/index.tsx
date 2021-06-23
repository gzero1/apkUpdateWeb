import React, { useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import BackgroundImage from '../../components/BackgroundImage';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import ClipLoader from 'react-spinners/ClipLoader';

const AppInfo: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [selectedVersion, setSelectedVersion] = useState<string>('2021.17.0');
  const [selectedType, setSelectedType] = useState<'stable' | 'unstable'>(
    'stable'
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [basicInfo, setBasicInfo] = useState<{ [key: string]: string }>({
    name: 'Exemplo',
    github: 'http://example.com',
    latestVersion: '2021.17.0',
  });
  const inputFile = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    setLoading(true);
    // api.get('/app_info/', { params: { name: name } });
    setLoading(false);
  }, []);

  const Upload = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    inputFile.current!.click();
    if (!selectedFile) {
      return;
    }

    var bodyFormData = new FormData();
    bodyFormData.append('apk', selectedFile);

    api.post(
      `/upload/${name}/${selectedVersion.replace(/\./g, '_')}/${selectedType}`,
      bodyFormData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  };

  const Download = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    api.get(
      `/upload/${name}/${selectedVersion.replace(/\./g, '_')}/${selectedType}`
    );
  };

  return (
    <BackgroundImage>
      {!loading ? (
        <Card style={styles.card}>
          <h1 style={styles.title}>{basicInfo.name}</h1>
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
                console.log((e.target as HTMLInputElement).value);
                if ((e.target as HTMLInputElement).value.match(/^[0-9\.]*$/g)) {
                  setSelectedVersion((e.target as HTMLInputElement).value);
                }
              }}
            />
            <div style={styles.typeContainer}>
              <label style={styles.label}>Type: </label>
              <button
                style={{
                  ...styles.checkbox,
                  backgroundColor:
                    selectedType === 'stable' ? 'lightblue' : '#FFFFFF',
                }}
                onClick={() => setSelectedType('stable')}
              />
              <label style={styles.label}>stable</label>
              <button
                style={{
                  ...styles.checkbox,
                  backgroundColor:
                    selectedType === 'unstable' ? 'lightblue' : '#FFFFFF',
                }}
                onClick={() => setSelectedType('unstable')}
              />
              <label style={styles.label}>unstable</label>
            </div>
          </div>

          <div style={styles.versionContainer}>
            <Button style={{ width: '45%' }} onClick={Download}>
              Download
            </Button>
            <Button style={{ width: '45%' }} onClick={Upload}>
              Upload
            </Button>
          </div>

          <input
            type="file"
            id="file"
            ref={inputFile}
            onChange={(e) => {
              if (e.target.files) setSelectedFile(e.target.files[0]);
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
