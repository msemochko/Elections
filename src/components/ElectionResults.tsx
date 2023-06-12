import React, { FC, Fragment, useEffect, useMemo, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Icon } from 'rsuite';
import ProgressLine from 'rsuite/lib/Progress/ProgressLine';
import Loading from '../pages/Loading';
import {
  CandidateResult,
  ElectionResult,
  getElectionResult,
  PositionResult,
} from '../utils/api/ElectionManagement';

const Position: FC<{ position: PositionResult }> = ({ position }) => {
  const [t] = useTranslation();
  const [maxVotes, setMaxVotes] = useState<number>(0);
  /**
   * Returns a list of sorted candidates to display for the position.
   */
  const sortedResults: CandidateResult[] | undefined = useMemo(() => {
    if (!position) return undefined; // Return undefined if position data not ready.
    let maxVotesInResult = 0;
    const res = position.candidates
      .map((value) => {
        value.voteCount = value.votes.length;
        if (value.voteCount > maxVotesInResult)
          maxVotesInResult = value.voteCount;
        return value;
      })
      .sort((a, b) => {
        return (b.voteCount || 0) - (a.voteCount || 0);
      });
    setMaxVotes(maxVotesInResult);
    return res;
  }, [position]);

  /**
   * Calculates if the top two candidates have equal votes.
   */
  const draw: boolean = useMemo(() => {
    if (!sortedResults || sortedResults.length < 2) return false;
    return sortedResults[0].votes.length === sortedResults[1].votes.length;
  }, [sortedResults]);

  /**
   * If no position or candidates, show alternative views.
   */
  if (!position || !sortedResults) return null;
  if (sortedResults.length === 0)
    return (
      <div style={{ marginBottom: 30 }}>
        <h4>
          <b>{position.title}</b>{' '}
          <Icon
            icon="arrow-right-line"
            style={{ margin: 5, marginRight: 10 }}
          />
          {t('electionResults.noWinner')}
        </h4>
      </div>
    );

  return (
    <div style={{ marginBottom: 30 }}>
      <br />
      {draw ? (
        <h4>
          <b>{position.title}</b>{' '}
          <Icon
            icon="arrow-right-line"
            style={{ margin: 5, marginRight: 10 }}
          />
          {t('electionResults.draw')}
        </h4>
      ) : (
        <h4>
          <b>{position.title}</b>{' '}
          <Icon
            icon="arrow-right-line"
            style={{ margin: 5, marginRight: 10 }}
          />
          {sortedResults[0].user.name}
        </h4>
      )}
      <br />
      <Fade cascade delay={0} duration={200} damping={0.1} triggerOnce>
        {sortedResults.map((res, index) => {
          const percent: number = ((res.voteCount || 0) / maxVotes) * 100;
          const winner: boolean = (res.voteCount || 0) === maxVotes;
          return (
            <div key={index}>
              <p>
                <b>{res.user.name}</b> - {t('electionResults.votes')}:
                <b>
                  <code>&nbsp;{res.voteCount || 0}</code>
                </b>
              </p>
              <ProgressLine
                percent={percent}
                showInfo={false}
                status={winner && !draw ? 'success' : undefined}
              />
            </div>
          );
        })}
        <div>
          <br />
          {(position.abstain || position.no_confidence) && (
            <Fragment>
              {position.abstain && (
                <p>
                  {t('v2.electionResults.votesOfAbstention')}:
                  <b>
                    <code>&nbsp;{position.abstain}</code>
                  </b>
                </p>
              )}
              {position.no_confidence && (
                <p>
                  {t('v2.electionResults.votesOfNoConfidence')}:
                  <b>
                    <code>&nbsp;{position.no_confidence}</code>
                  </b>
                </p>
              )}
            </Fragment>
          )}
        </div>
      </Fade>
    </div>
  );
};

export default function ElectionResults() {
  let { id } = useParams<any>();
  const [isLoading, setLoading] = useState(true);
  const [electionResult, setElection] = useState<ElectionResult>();
  const [t] = useTranslation();
  useEffect(() => {
    if (!id) return;
    getElectionResult(id).then((res) => {
      setElection(res);
      setLoading(false);
    });
  }, [id]);

  //waiting for the response from getEletctionList
  if (isLoading) {
    return <Loading half />;
  }

  if (!electionResult) {
    return <p>{t('electionResult.noResult')}</p>;
  }

  return (
    <div>
      <Fade cascade delay={100} duration={400} triggerOnce damping={0.1}>
        {electionResult.positions.map(
          (position: PositionResult, index: number) => (
            <Position position={position} key={index} />
          )
        )}
        <br />
      </Fade>
    </div>
  );
}
