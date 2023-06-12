import React, { FC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Content } from 'rsuite';
import versionInfo from '../../package.json';
import { AppInfo, info } from '../utils/api/Alive';

const version = versionInfo.version;

interface InfoModalProps {
  open: boolean;
  setOpen: (x: boolean) => any;
}

const InfoModal: FC<InfoModalProps> = ({ open, setOpen }) => {
  const [t] = useTranslation();
  const [backendVersion, setBackendVersion] = useState<string>('0.0.0');

  // Get backend version number.
  useEffect(() => {
    info()
      .then((res) => {
        const info: AppInfo = res.data;
        setBackendVersion(info.api_version);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header>
        <Modal.Title>Application Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Content>
          <h1>Democracy</h1>
          <p>
            <b>
              <code>
                Frontend v{version} &amp; Backend v{backendVersion}
              </code>
            </b>
          </p>
          <br />
          <h4>Development Team</h4>
          <p>
            Built by the <b>Small Minds</b> team circa 2020.
          </p>
          <br />
          <ul>
            <li>
              <b>Ryan Fleck</b> &middot; Development Lead for BE/FE
            </li>
            <li>
              <b>Mengxuan (Max) Chen</b> &middot; Frontend Developer, UX
            </li>
          </ul>
          <br />
          <h4>{t('v2.infoModal.titles.contributors')}</h4>
          <p>Contributors provided alternative translations for the web app.</p>
          <br />
          <ul>
            <li>
              <b>Nicholas Morin</b> &middot; French translation
            </li>
            <li>
              <b>Alae Boufarrachene</b> &middot; Arabic translation
            </li>
            <li>
              <b>RuiFeng Tian</b> &middot; Chinese translation
            </li>
            <li>
              <b>Mengxuan Chen</b> &middot; Chinese translation
            </li>
          </ul>
          <br />
          <h4>{t('v2.infoModal.titles.tos')}</h4>
          {t('semiLegal.termsOfService')}
          <br />
          <br />
          <h4>{t('v2.infoModal.titles.privacy')}</h4>
          {t('semiLegal.privacyPolicy')}
          <br />
          <br />
          <h4>Open Source</h4>
          <p>
            Source code for the frontend and backend of this application is
            pubilshed under open source licenses and can be freely extended.
          </p>
          <br />
          <p>
            <a
              href="https://github.com/Small-Minds"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              Small Minds Repositories
            </a>
          </p>
          <br />
          <br />
          {process.env.NODE_ENV !== 'production' && (
            <>
              <h4>Development Information</h4>
              <p>Backend URL: {process.env.REACT_APP_BACKEND_URL}</p>
            </>
          )}
        </Content>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setOpen(false)} appearance="subtle">
          {t('confirmModal.cancelBtn')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
