import React, { Fragment, useMemo, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import Gravatar from 'react-gravatar';
import { useTranslation } from 'react-i18next';
import { Avatar, Button, FlexboxGrid, Icon, Modal } from 'rsuite';
import { CandidateWithUserDetails } from '../utils/api/ElectionManagement';

interface CandidateInfoModalInput {
  candidate: CandidateWithUserDetails;
}
export default function CandidateInfo({ candidate }: CandidateInfoModalInput) {
  const [open, setOpen] = useState<boolean>(false);

  const userImage = useMemo(() => {
    if (!candidate || !candidate.user || !candidate.user.email) return null;
    return <Gravatar email={candidate.user.email} size={60} rating="pg" />;
  }, [candidate]);

  const [t] = useTranslation();
  return (
    <Fragment>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        style={{ marginRight: 8, marginBottom: 8 }}
        block
      >
        <Avatar
          size="lg"
          style={{
            display: 'block',
            margin: 'auto',
            marginTop: 10,
          }}
        >
          {userImage && (
            <Fade triggerOnce duration={600} delay={100}>
              <div>{userImage}</div>
            </Fade>
          )}
        </Avatar>
        <h5 style={{ marginTop: 5, textAlign: 'center' }}>
          {candidate.user.name}
        </h5>
        <small>
          <Icon icon="info" /> {t('v2.candidateInfoComp.btnTip')}
        </small>
      </Button>
      <Modal
        show={open}
        onHide={() => {
          setOpen(false);
        }}
      >
        <Modal.Header>{t('candidateInfoComp.modalTitle')}</Modal.Header>
        <Modal.Body style={{ padding: 10 }}>
          <FlexboxGrid justify="start" align="middle">
            <FlexboxGrid.Item>
              <Avatar
                size="lg"
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                {userImage && (
                  <Fade triggerOnce duration={600} delay={100}>
                    <div>{userImage}</div>
                  </Fade>
                )}
              </Avatar>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item style={{ padding: 10 }}>
              <b>{candidate.user.name}</b>
              <p>
                <code>{candidate.user.email}</code>
              </p>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <br />
          <h5>{t('candidateInfoComp.candidatePlatform')}</h5>
          <div style={{ marginTop: 10, marginBottom: 10 }}>
            {candidate.platform.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ marginTop: 10 }}
            onClick={() => {
              setOpen(false);
            }}
          >
            {t('general.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
