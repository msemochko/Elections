import React, { Fragment, useContext, useMemo } from 'react';
import { Fade } from 'react-awesome-reveal';
import Gravatar from 'react-gravatar';
import { useTranslation } from 'react-i18next';
import { Avatar, FlexboxGrid, Icon } from 'rsuite';
import ChangeNameForm from '../components/ChangeNameForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { User } from '../utils/api/User';

export default function ManageAccount() {
  const user = useContext(User);
  const [t] = useTranslation();

  const userImage = useMemo(() => {
    if (!user || !user.user || !user.user.email) return null;
    return <Gravatar email={user.user.email} size={60} rating="pg" />;
  }, [user]);

  if (!user || !user.user) return null;
  return (
    <div>
      <Fade cascade duration={200} damping={0.2}>
        <div style={{ marginBottom: 20 }}>
          <h1>{t('manageAccountPage.title')}</h1>
          <p>{t('manageAccountPage.instruction')}</p>
        </div>
        <div style={{ marginBottom: 5 }}>
          <FlexboxGrid justify="start" align="middle">
            <FlexboxGrid.Item style={{ marginRight: 10 }}>
              <Avatar size="lg" style={{ marginTop: 20, marginBottom: 20 }}>
                {userImage && (
                  <Fade triggerOnce duration={600} delay={100}>
                    <div>{userImage}</div>
                  </Fade>
                )}
              </Avatar>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <h3>{user.user.name}</h3>
              <p>
                <code>{user.user.email}</code>
              </p>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
        <div style={{ marginBottom: 40 }}>
          <p>
            <a
              href="https://en.gravatar.com/"
              rel="external nofollow"
              target="_blank"
            >
              {t('manageAccountPage.changeProfileBtn')}
              <Icon icon="external-link" style={{ marginLeft: 5 }}></Icon>
            </a>
          </p>
        </div>
        <div style={{ marginBottom: 30 }}>
          <h3>{t('signUpForm.nameInputLabel')}</h3>
          <br />
          <ChangeNameForm />
        </div>
        <div style={{ marginBottom: 30 }}>
          <h3>{t('resetPassword.form.password1')}</h3>
          <br />
          <ChangePasswordForm />
        </div>
      </Fade>
    </div>
  );
}
