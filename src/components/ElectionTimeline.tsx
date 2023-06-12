import React, { FC, Fragment, useMemo } from 'react';
import { Icon, Loader, Timeline } from 'rsuite';
import { ElectionDetails } from '../utils/api/ElectionManagement';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props {
  election: ElectionDetails;
}

const timeformat: string = 'MMMM DD, YYYY, hh:mm A';

const ElectionTimeline: FC<Props> = ({ election }) => {
  const phase: number = useMemo(() => {
    return 0;
  }, [election]);

  if (!election)
    return (
      <Fragment>
        <div style={{ marginBottom: 20 }}>
          <Loader size="md" />
        </div>
      </Fragment>
    );
  const [t] = useTranslation();
  return (
    <Fragment>
      <div style={{ marginBottom: 20 }}>
        <Timeline className="custom-timeline">
          <Timeline.Item dot={<Icon icon="eye" size="2x" />}>
            <p>
              <b>{moment(election.submission_start_time).format(timeformat)}</b>
            </p>
            <p>{t('electionTimeline.appBegin')}</p>
          </Timeline.Item>
          <Timeline.Item dot={<Icon icon="pencil" size="2x" />}>
            <p>
              <b>{moment(election.submission_end_time).format(timeformat)}</b>
            </p>
            <p>{t('electionTimeline.appEnd')}</p>
          </Timeline.Item>
          {election.submission_release_time && (
            <Fragment>
              <Timeline.Item>
                <p>{t('electionTimeline.review')}</p>
              </Timeline.Item>
              <Timeline.Item
                dot={<Icon icon="character-authorize" size="2x" />}
              >
                <p>
                  <b>
                    {moment(election.submission_release_time).format(
                      timeformat
                    )}
                  </b>
                </p>
                <p>Candidate platforms released</p>
              </Timeline.Item>
            </Fragment>
          )}
          <Timeline.Item>
            <p>Campaigning period</p>
          </Timeline.Item>
          <Timeline.Item dot={<Icon icon="list" size="2x" />}>
            <p>
              <b>{moment(election.voting_start_time).format(timeformat)}</b>
            </p>
            <p>{t('electionTimeline.voteBegin')}</p>
          </Timeline.Item>
          <Timeline.Item dot={<Icon icon="check-square-o" size="2x" />}>
            <p>
              <b>{moment(election.voting_end_time).format(timeformat)}</b>
            </p>
            <p>{t('electionTimeline.voteEnd')}</p>
          </Timeline.Item>
          {election.voting_release_time && (
            <Fragment>
              <Timeline.Item>
                <p>Certification of election results</p>
              </Timeline.Item>
              <Timeline.Item dot={<Icon icon="tasks" size="2x" />}>
                <p>
                  <b>
                    {moment(election.voting_release_time).format(timeformat)}
                  </b>
                </p>
                <p>Election results released</p>
              </Timeline.Item>
            </Fragment>
          )}
        </Timeline>
      </div>
    </Fragment>
  );
};

export default ElectionTimeline;
