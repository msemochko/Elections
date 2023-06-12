import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ElectionDetails, getElection } from '../utils/api/ElectionManagement';

export default function ElectionInfo() {
  let { id } = useParams<any>();
  const [isLoading, setLoading] = useState(true);
  const [election, setElection] = useState<ElectionDetails | undefined>();
  const [t] = useTranslation();
  useEffect(() => {
    if (!id) return;
    getElection(id).then((res) => {
      setElection(res);
      setLoading(false);
    });
  }, [id]);

  //waiting for the response from getEletctionList
  if (isLoading) {
    return <div>{t('electionInfo.loading')}</div>;
  }

  return (
    <div>
      <h3>{`${t('electionInfo.id')} ${election?.id}`}</h3>
      <h3>{`${t('electionInfo.creatationDate')} ${election?.created}`}</h3>
    </div>
  );
}
