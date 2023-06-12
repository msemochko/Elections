import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { useTranslation } from 'react-i18next';
import Loading from '../pages/Loading';
import { Election, getElectionList } from '../utils/api/ElectionManagement';
import { Credentials } from '../utils/Authentication';
import ElectionListElement from './ElectionListElement';

export default function ElectionList() {
  const ctx = useContext(Credentials);
  const [electionList, setElectionList] = useState<Array<Election>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [t] = useTranslation();

  useEffect(() => {
    // Return early if no context is provided.
    if (!ctx || !ctx.credentials || !ctx.credentials.authenticated) return;
    // Return if the list has already been populated.
    if (electionList.length > 0) return;
    // If logged in, attempt to get the list of elections.
    getElectionList()
      .then((res) => {
        setElectionList(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ctx]);

  if (loading || !electionList) return <Loading half />;
  if (electionList.length === 0)
    return (
      <div>
        <br />
        <p>{t('electionList.noMatchingElections')}</p>
        <br />
      </div>
    );

  return (
    <div>
      <Fade cascade duration={250} triggerOnce delay={0} damping={0.1}>
        {electionList.map((election, index) => (
          <ElectionListElement
            key={index}
            index={index}
            election={election}
            managerList
          />
        ))}
      </Fade>
      <br />
    </div>
  );
}
