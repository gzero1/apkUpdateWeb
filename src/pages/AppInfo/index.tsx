import React, { useLayoutEffect, useRef, useState } from 'react';
import { useHistory as useNavigation, useParams } from 'react-router-dom';
import api from '../../api';
import BackgroundImage from '../../components/BackgroundImage';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import ClipLoader from 'react-spinners/ClipLoader';
import IAppInfoResponse from '../../@types/api/getInfo.response';
import { AiOutlineSearch } from 'react-icons/ai';
import IDownloadInfoResponse from '../../@types/api/downloadInfo.response';
import IApksResponse, { Apk } from '../../@types/api/apks.response';
import Switch from 'react-switch';

const AppInfo: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'stable' | 'unstable'>(
    'stable'
  );
  const [message, setMessage] = useState<string>('');
  const [AndroidId, setAndroidId] = useState<string>('');
  const [AndroidIdMessage, setAndroidIdMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [basicInfo, setBasicInfo] = useState({
    displayName: 'Loading...',
    github: 'Loading...',
    latestVersion: 'Loading...',
    totalUsers: 0,
    totalUpdatedUsers: 0,
  });
  const [apks, setApks] = useState<Apk[]>([]);
  const [apkFilter, setApkFilter] = useState<string>('');
  const navigation = useNavigation();
  const inputFile = useRef<HTMLInputElement | null>(null);

  const updateApks = async () => {
    const apks = (await api.get<IApksResponse>(`/info/${name}/apks`)).data;
    setApks(apks);
  };

  async function updateInfo() {
    const basicInfo = (await api.get<IAppInfoResponse>(`/info/${name}`)).data;
    setBasicInfo({
      displayName: basicInfo.display_name,
      github: basicInfo.repo_url,
      latestVersion: basicInfo.latest_version,
      totalUsers: basicInfo.total_downloads,
      totalUpdatedUsers: basicInfo.total_updated,
    });
    updateApks();
  }

  useLayoutEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigation.push('/');
    }
    setLoading(true);
    try {
      updateInfo();
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
  }, []);

  const upload = (file: File) => {
    try {
      var bodyFormData = new FormData();
      bodyFormData.append('file', file);
      bodyFormData.append('version', selectedVersion);
      bodyFormData.append('is_stable', (selectedType === 'stable').toString());

      api.post(`/upload/${name}`, bodyFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          let progress: number = Math.round((event.loaded * 100) / event.total);

          setMessage(`Uploading... ${progress}% complete.`);
          if (progress === 100) {
            setMessage('File sent');
            progress = 0;
            setTimeout(() => updateApks(), 2000);
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

  // const Download = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   if (selectedVersion.length > 0) {
  //     window.open(
  //       `${url}/download/${name}/${selectedVersion.replace(/\./g, '_')}`
  //     );
  //   } else {
  //     window.open(`${url}/download/${name}/latest`);
  //   }
  // };

  const checkImei = async () => {
    setLoading(true);
    try {
      const response = await api.get<IDownloadInfoResponse>(
        `/download_info/${name}`,
        { params: { android_id: AndroidId } }
      );
      console.log(response.data);
      setAndroidIdMessage(
        response.data.is_updated
          ? 'Success: User HAS updated!'
          : 'Warning: User HAS NOT updated!'
      );
    } catch (e: any) {
      console.log(e);
      if (e?.response?.data?.detail === 'android_id não existe') {
        setAndroidIdMessage('Invalid/Inexistant AndroidId');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundImage>
      {!loading ? (
        <>
          <Card style={styles.card}>
            <h1 style={styles.title}>{basicInfo.displayName}</h1>
            <h2 style={styles.label}>{message}</h2>
            <div style={styles.basicInfoContainer}>
              <span style={styles.label}>
                Latest Version:{' '}
                {basicInfo.latestVersion ?? 'No version available'}
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
              <span style={styles.label}>
                Users: {basicInfo.totalUsers} / Updated:{' '}
                {basicInfo.totalUpdatedUsers}
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
                  upload(e.target.files[0]);
                }
              }}
              style={{ display: 'none' }}
            />

            <div style={styles.imeicheck}>
              <Input
                placeholder="Check AndroidId"
                value={AndroidId}
                style={{ width: '60%' }}
                onChange={(e) => setAndroidId(e.target.value)}
              />
              <Button style={{ width: '20%' }} onClick={checkImei}>
                <AiOutlineSearch size={25} />
              </Button>
            </div>
            <span style={styles.label}>{AndroidIdMessage}</span>
          </Card>
          <Card
            style={{
              ...styles.card,
              justifyContent: 'flex-start',
              marginLeft: '2rem',
            }}
          >
            <span style={styles.label}>Versions:</span>
            <Input
              placeholder="Filter"
              value={apkFilter}
              style={{ width: '60%' }}
              onChange={(e) => setApkFilter(e.target.value)}
            />
            <div style={styles.versionList}>
              {[...apks]
                .reverse()
                .filter((apk) => apk.version.includes(apkFilter))
                .map((apk) => (
                  <div style={styles.versionListItem}>
                    <span style={styles.label}>{apk.version}</span>
                    <Switch
                      onChange={async (checked) => {
                        await api.post(`info/${name}`, {
                          version: apk.version,
                          is_stable: checked,
                        });
                        await updateInfo();
                      }}
                      checked={apk.is_stable}
                    />
                  </div>
                ))}
            </div>
          </Card>
        </>
      ) : (
        <>
          <Card
            style={{
              ...styles.card,

              width: '20vw',
            }}
          >
            <ClipLoader color={'#FFFFFF'} loading={loading} size={50} />
          </Card>
          <Card style={{ ...styles.card, ...{ width: '20vw' } }}>
            <ClipLoader color={'#FFFFFF'} loading={loading} size={50} />
          </Card>
        </>
      )}
    </BackgroundImage>
  );
};

const styles: StyleSheets = {
  card: {
    height: '60vh',
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
    justifyContent: 'center',
    width: '90%',
  },
  versionList: {
    // flex: 1,
    width: '100%',
    overflowY: 'scroll',
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
  imeicheck: {
    width: '100%',
    marginTop: '2rem',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  versionListItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '1rem',
  },
};

export default AppInfo;
