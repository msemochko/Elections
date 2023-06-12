import moment from 'moment';
import React, { FC, Fragment, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Divider, Panel, Tag, TagGroup } from 'rsuite';
import { Election } from '../utils/api/ElectionManagement';
import { User } from '../utils/api/User';

interface ElectionListElementProps {
  index: any;
  election: Election;
  managerList?: boolean;
}

type TimeInfo = {
  period: string;
  color: string | undefined;
};

const ElectionListElement: FC<ElectionListElementProps> = ({
  index,
  election,
  managerList = false,
}) => {
  const user = useContext(User);
  const [t] = useTranslation();
  // const history = useHistory();

  const manager: boolean = useMemo(() => {
    if (managerList) return true;
    if (!user || !user.user || !user.user.id || !election) return false;
    return user.user.id === election.manager;
  }, [user, election]);

  const buttonName: string = useMemo(() => {
    if (!user || !user.user || !user.user.id)
      return t('electionList.button.viewElection');
    if (managerList || user.user.id === election.manager)
      return t('electionList.button.manageElection');
    return t('electionList.button.viewElection');
  }, [user, election]);

  /** Fall back on the election description if no subtitle is available. */
  const subtitle: string = useMemo(() => {
    if (election.subtitle) return election.subtitle;
    if (election.description) {
      if (election.description.length < 200) return election.description;
      return election.description.substring(0, 180) + '...';
    }
    return '';
  }, [election]);

  const timeInfo: TimeInfo | undefined = useMemo(() => {
    if (!election) return undefined;
    const now = moment();
    if (now.isAfter(moment(election.voting_release_time)))
      return {
        period: t('v2.timespans.resultsReleased'),
        color: 'green',
      };

    if (now.isAfter(moment(election.voting_end_time)))
      return {
        period: t('v2.timespans.processingResults'),
        color: 'blue',
      };

    if (now.isAfter(moment(election.voting_start_time)))
      return {
        period: t('v2.timespans.votingOpen'),
        color: 'red',
      };

    if (now.isAfter(moment(election.submission_release_time)))
      return {
        period: t('v2.timespans.campaigningPeriod'),
        color: 'yellow',
      };

    if (now.isAfter(moment(election.submission_end_time)))
      return {
        period: t('v2.timespans.submissionReview'),
        color: 'blue',
      };

    if (now.isAfter(moment(election.submission_start_time)))
      return {
        period: t('v2.timespans.submissionsOpen'),
        color: 'orange',
      };

    return {
      period: t('v2.timespans.preElection'),
      color: undefined,
    };
  }, [election]);

  const electionLink = `/election/${election.id}`;
  return (
    <div>
      <Panel key={index} index={index} bordered>
        <Link to={electionLink}>
          <h3>{election.title}</h3>
        </Link>
        <TagGroup style={{ marginBottom: 10 }}>
          {timeInfo && <Tag color={timeInfo.color}>{timeInfo.period}</Tag>}
          <Tag>@{election.election_email_domain}</Tag>
          {manager && <Tag color="green">{t('v2.general.manager')}</Tag>}
        </TagGroup>
        {/* <Divider style={{ padding: 0, margin: 0, marginBottom: 10 }} /> */}
        <p>{subtitle}</p>
      </Panel>
      <br />
    </div>
  );
};

export default ElectionListElement;
