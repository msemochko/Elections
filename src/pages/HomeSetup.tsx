import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import ElectionList from '../components/ElectionList';
import NewElectionButton from '../components/NewElectionButton';

function HomeSetup() {
  const [t] = useTranslation();

  return (
    <Fragment>
      <h1>{t('setupHomePage.title')}</h1>
      <p>{t('setupHomePage.subtitle')}</p>
      <br />
      <NewElectionButton />
      <br />
      <br />
      <br />
      <h2>{t('setupHomePage.electionPanelTitle')}</h2>
      <br />
      <ElectionList />
      <br />
      {/* <h2>{t('setupHomePage.positionSubmissionsTitle')}</h2>
      <br />
      <ElectionList />
      <br /> */}
    </Fragment>
  );
}

export default HomeSetup;
