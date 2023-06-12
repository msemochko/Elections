import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

function Empty() {
  const [t] = useTranslation();
  const history = useHistory();

  return (
    <Fragment>
      <h1>{t('emptyPage.title')}</h1>
      <br />
      <br />
      <p>
        <code>/{history.location.pathname}</code>
      </p>
      <h3>{t('emptyPage.body')}</h3>
      <br />
    </Fragment>
  );
}

export default Empty;
