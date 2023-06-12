import { Fragment, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Notification } from 'rsuite';
import { clearTokens, recordEvent } from '../utils/API';
import { Credentials } from '../utils/Authentication';

/**
 * Here is an example of a useContext hook to consume a provider.
 */
function LogoutButton() {
  // When the app first starts, it is unauthenticated.
  const ctx = useContext(Credentials);
  //Set up localization hook
  const [t] = useTranslation();
  const history = useHistory();

  return (
    <Fragment>
      <Button
        appearance="primary"
        size="lg"
        disabled={!ctx?.credentials.authenticated}
        onClick={() => {
          clearTokens();
          recordEvent({ action: 'logout', category: 'account' });
          ctx?.setCredentials({
            authenticated: false,
            token: '',
            tokenExpiry: undefined,
            refreshToken: '',
            refreshTokenExpiry: undefined,
          });
          history.push('/');
          Notification['success']({
            title: t('mainPage.logOutSuccessTitle'),
            description: t('mainPage.logOutSuccessDescription'),
          });
        }}
      >
        {t('mainPage.logoutButton')}
      </Button>
    </Fragment>
  );
}

export default LogoutButton;
