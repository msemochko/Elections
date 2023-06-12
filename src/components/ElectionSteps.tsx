import React, { FC, Fragment, useMemo } from 'react';
import { Icon, Loader, Steps, Timeline } from 'rsuite';
import { ElectionDetails } from '../utils/api/ElectionManagement';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Fade } from 'react-awesome-reveal';

interface Props {
  election: ElectionDetails;
}

const timeformat: string = 'MMMM DD, YYYY, hh:mm A';

const ElectionSteps: FC<Props> = ({ election }) => {
  const [t] = useTranslation();

  const phase: number = useMemo(() => {
    if (!election) return 0;
    const now = moment();
    if (now.isAfter(moment(election.voting_release_time))) return 5;
    if (now.isAfter(moment(election.voting_end_time))) return 4;
    if (now.isAfter(moment(election.voting_start_time))) return 3;
    if (now.isAfter(moment(election.submission_release_time))) return 2;
    if (now.isAfter(moment(election.submission_end_time))) return 1;
    if (now.isAfter(moment(election.submission_start_time))) return 0;
    return -1;
  }, [election]);

  if (!election)
    return (
      <Fragment>
        <div style={{ marginBottom: 20 }}>
          <Loader size="md" />
        </div>
      </Fragment>
    );

  return (
    <Fragment>
      <h4>{t('v2.electionTimeline.title')}</h4>
      <br />
      <Steps current={phase} vertical style={{ marginBottom: 30 }}>
        <Steps.Item
          title={t('electionTimeline.appBegin')}
          description={moment(election.submission_start_time).format(
            timeformat
          )}
        />
        <Steps.Item
          title={t('v2.electionTimeline.appEndAndReview')}
          description={moment(election.submission_end_time).format(timeformat)}
        />
        <Steps.Item
          title={t('v2.electionTimeline.appRelease')}
          description={
            election.submission_release_time &&
            moment(election.submission_release_time).format(timeformat)
          }
        />
        <Steps.Item
          title={t('electionTimeline.voteBegin')}
          description={moment(election.voting_start_time).format(timeformat)}
        />
        <Steps.Item
          title={t('v2.electionTimeline.voteEndAndReview')}
          description={moment(election.voting_end_time).format(timeformat)}
        />
        <Steps.Item
          title={t('v2.electionTimeline.voteRelease')}
          description={
            election.voting_release_time &&
            moment(election.voting_release_time).format(timeformat)
          }
        />
      </Steps>
    </Fragment>
  );
};

export default ElectionSteps;
