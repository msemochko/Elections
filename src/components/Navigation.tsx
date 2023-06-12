import React, { Fragment, useContext, useMemo } from 'react';
import { Fade, Slide } from 'react-awesome-reveal';
import Gravatar from 'react-gravatar';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Avatar, Dropdown, Icon, Nav, Navbar, Notification } from 'rsuite';
import { clearTokens } from '../utils/API';
import { User } from '../utils/api/User';
import { Credentials } from '../utils/Authentication';
import LanguagePicker from './LanguagePicker';

function AccountMenu() {
  const ctx = useContext(Credentials);
  const history = useHistory();
  const [t] = useTranslation();
  const user = useContext(User);

  const userImage = useMemo(() => {
    if (!user || !user.user || !user.user.email) return null;
    return <Gravatar email={user?.user.email} size={40} rating="pg" />;
  }, [user]);

  return (
    <Dropdown
      placement="bottomEnd"
      renderTitle={() => (
        <Fragment>
          <Avatar style={{ margin: 7, marginLeft: 2, marginRight: 2 }}>
            {/** Render initials or avatar as fallback */}

            {userImage && (
              <Fade triggerOnce duration={600} delay={100}>
                <div>{userImage}</div>
              </Fade>
            )}
          </Avatar>
        </Fragment>
      )}
    >
      <Dropdown.Item panel style={{ padding: 10 }}>
        <p>
          <b>{user?.user.name}</b>
        </p>
        <p>{user?.user.email}</p>
      </Dropdown.Item>
      <Dropdown.Item divider />
      <Dropdown.Item
        icon={<Icon icon="gear-circle" />}
        onSelect={() => {
          history.push('/account');
        }}
      >
        {t('mainPage.accountSetting')}
      </Dropdown.Item>
      <Dropdown.Item divider />
      <Dropdown.Item
        icon={<Icon icon="sign-out" />}
        onSelect={() => {
          clearTokens();
          if (!ctx) return;
          ctx.setCredentials({
            authenticated: false,
            token: '',
            tokenExpiry: undefined,
            refreshToken: '',
            refreshTokenExpiry: undefined,
          });
          history.push('/');
          Notification['success']({
            title: t('mainPage.logoutSuccessTitle'),
            description: t('mainPage.logoutSuccessDescription'),
          });
        }}
      >
        {t('mainPage.logoutButton')}
      </Dropdown.Item>
    </Dropdown>
  );
}

function Navigation() {
  const ctx = useContext(Credentials);
  const [t] = useTranslation();
  const history = useHistory();
  const location = useLocation();

  return (
    <Navbar>
      <Navbar.Body
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        {ctx && ctx?.credentials.authenticated && (
          <Nav
            appearance="subtle"
            activeKey={location.pathname}
            onSelect={(key: string) => history.push(key)}
            className="democracy-nav"
          >
            <Nav.Item eventKey="/" icon={<Icon icon="home" />}>
              {t('mainPage.homeLink')}
            </Nav.Item>
            {/* <Nav.Item eventKey="/vote" icon={<Icon icon="check2" />}>
              {t('mainPage.voteLink')}
            </Nav.Item> */}
            <Nav.Item eventKey="/setup" icon={<Icon icon="gears2" />}>
              {t('mainPage.setupLink')}
            </Nav.Item>
          </Nav>
        )}
        <Nav pullRight>
          <LanguagePicker />
          {ctx && ctx.credentials.authenticated && <AccountMenu />}
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
}

export default Navigation;
