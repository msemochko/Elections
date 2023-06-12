import moment from 'moment';
import React, {
  FC,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Fade } from 'react-awesome-reveal';
import { useTranslation } from 'react-i18next';
import {
  Route,
  RouteComponentProps,
  Switch,
  useHistory,
  useParams,
} from 'react-router-dom';
import {
  Badge,
  ButtonToolbar,
  Icon,
  IconButton,
  Message,
  Notification,
} from 'rsuite';
import AddPositionModal from '../components/AddPositionModal';
import ConfirmModal from '../components/ConfirmModal';
import EditElectionModal from '../components/EditElectionModal';
import EditWhiteListModal from '../components/EditWhiteListModal';
import ElectionManager from '../components/ElectionManager';
import ElectionResults from '../components/ElectionResults';
import ElectionSteps from '../components/ElectionSteps';
import ElectionTimeline from '../components/ElectionTimeline';
import PlatformList from '../components/PlatformList';
import PositionList from '../components/PositionList';
import SetTimelineModal from '../components/SetTimelineModal';
import {
  deleteElection,
  ElectionDetails,
  getElection,
} from '../utils/api/ElectionManagement';
import { User, UserDataInterface } from '../utils/api/User';
import Loading from './Loading';

interface ElectionSubpage {
  id: string | undefined;
  election: ElectionDetails | undefined;
  user: UserDataInterface | null;
  updateElection?: (id: string) => Promise<any>;
  finished?: boolean;
}

const ManagementTools: FC<ElectionSubpage> = ({
  id,
  election,
  updateElection,
  finished,
}) => {
  const [setTimelineOpen, setSetTimelineOpen] = useState<boolean>(false);
  const [addPositionOpen, setAddPositionOpen] = useState<boolean>(false);
  const [editWhiteListOpen, setEditWhiteListOpen] = useState<boolean>(false);
  const [editElectionOpen, setEditElectionOpen] = useState<boolean>(false);
  const [
    isDeleteElectionModalOpen,
    setIsDeleteElectionModalOpen,
  ] = useState<boolean>(false);
  const history = useHistory();
  const [t] = useTranslation();
  function closeDeleteElectionModal() {
    setIsDeleteElectionModalOpen(false);
  }

  function deleteElectionHandler(result: number) {
    if (result == 204) {
      setIsDeleteElectionModalOpen(false);
      Notification['success']({
        title: t('v2.electionPage.deleteNotification.successTitle'),
        description: t('v2.electionPage.deleteNotification.successBody'),
      });
      history.push(`/`);
    } else {
      setIsDeleteElectionModalOpen(false);
      Notification['error']({
        title: t('v2.errors.title'),
        description: t('v2.errors.cantDelete'),
      });
    }
  }

  if (!id || !election || election === undefined) return null;
  return (
    <Fragment>
      <h5 style={{ marginBottom: 10 }}>
        {t('electionPage.managementToolsSectionTitle')}
      </h5>
      <ButtonToolbar>
        <IconButton
          icon={<Icon icon="clock-o" />}
          onClick={() => setSetTimelineOpen(true)}
        >
          {t('electionPage.setTimelineBtn')}
        </IconButton>
        {finished !== true && (
          <IconButton
            icon={<Icon icon="plus" />}
            onClick={() => setAddPositionOpen(true)}
          >
            {t('electionPage.addPositionBtn')}
          </IconButton>
        )}
        <IconButton
          icon={<Icon icon="edit2" />}
          onClick={() => setEditWhiteListOpen(true)}
        >
          {t('v2.electionPage.editWhitelistBtn')}
        </IconButton>
        <IconButton
          icon={<Icon icon="edit2" />}
          onClick={() => setEditElectionOpen(true)}
        >
          {t('v2.electionPage.editElectionBtn')}
        </IconButton>
        <IconButton
          appearance="primary"
          icon={<Icon icon="trash" />}
          color="red"
          onClick={() => {
            setIsDeleteElectionModalOpen(true);
          }}
        >
          {t('electionPage.deleteEletionBtn')}
        </IconButton>
      </ButtonToolbar>
      <ConfirmModal
        modalTitle={t('electionPage.deleteElectionModalTitle')}
        modalBody={t('electionPage.deleteElectionModalBody')}
        callBackFunc={() => deleteElection(id)}
        isOpen={isDeleteElectionModalOpen}
        closeModal={() => closeDeleteElectionModal()}
        cleanUpFunc={(result: number) => deleteElectionHandler(result)}
      />
      <SetTimelineModal
        election={election}
        isOpen={setTimelineOpen}
        closeModal={() => setSetTimelineOpen(false)}
        cleanupFunc={() => {
          if (updateElection) updateElection(election.id);
        }}
      />
      <AddPositionModal
        open={addPositionOpen}
        setOpen={setAddPositionOpen}
        election={election}
        onCreate={(p) => {
          if (updateElection) updateElection(election.id);
          setAddPositionOpen(false);
        }}
      />
      <EditWhiteListModal
        closeModal={() => setEditWhiteListOpen(false)}
        isOpen={editWhiteListOpen}
        electionId={election.id}
      />
      <EditElectionModal
        closeModal={() => setEditElectionOpen(false)}
        isOpen={editElectionOpen}
        electionDetails={election}
        cleanupFunc={() => {
          if (updateElection) updateElection(election.id);
        }}
      />
    </Fragment>
  );
};

const Information: FC<ElectionSubpage> = ({ id, election, updateElection }) => {
  if (!id || !election) return null;
  const [t] = useTranslation();
  return (
    <Fragment>
      <Fade cascade triggerOnce damping={0.1} duration={200}>
        <div>
          <h3>{t('electionPage.infoSubpageTitle')}</h3>
          <br />
        </div>
        <div>
          {election.description.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <div>
          <br />
          <br />
          <ElectionManager election={election} />
        </div>
        <div>
          <br />
          <br />
          <ElectionSteps election={election} />
          {/* <ElectionTimeline election={election} /> */}
        </div>
        <div>
          <br />
          <h4>{t('electionPage.infoSubpagePostionSectionTitle')}</h4>
          <br />
          <PositionList
            election={election}
            updateElection={() => {
              if (updateElection) updateElection(election.id);
            }}
          />
          <br />
        </div>
      </Fade>
    </Fragment>
  );
};

const Positions: FC<ElectionSubpage> = ({ id, election, updateElection }) => {
  if (!id || !election) return null;
  const [t] = useTranslation();
  return (
    <Fragment>
      <Fade cascade triggerOnce damping={0.1} duration={200}>
        <div>
          <h3>{t('electionPage.positionSectionTilte')}</h3>
          <br />
        </div>
        <div>
          <PositionList
            election={election}
            updateElection={() => {
              if (updateElection) updateElection(election.id);
            }}
          />
        </div>
      </Fade>
    </Fragment>
  );
};

const Platforms: FC<ElectionSubpage> = ({ id, election }) => {
  if (!id || !election) return null;
  const [t] = useTranslation();
  return (
    <Fragment>
      <Fade triggerOnce duration={300}>
        <div>
          <h3>{t('electionPage.platformSectionTitle')}</h3>
          <PlatformList election={election} />
        </div>
      </Fade>
    </Fragment>
  );
};

const Election: FC<RouteComponentProps> = ({ match }) => {
  const { id } = useParams<Record<string, string | undefined>>();
  const history = useHistory();
  const user = useContext(User);
  const [t] = useTranslation();
  const [showTools, setShowTools] = useState<boolean>(false);
  // @ts-ignore
  const [election, setElection] = useState<ElectionDetails>({"id":"6017de03-26a7-4647-b89a-ca079e76b43c","positions":[{"id":"c60156d1-84e6-4f03-9bbe-9aee5e09ad47","title":"Htrnjh","description":"rvgergergergergergerger"}],"manager":{"id":"4a330c11-5d4c-47dd-bc90-0d53f8403923","created":"2023-04-16T20:41:23.488993Z","username":"demcukbogdan76","email":"demcukbogdan76@gmail.com","name":"Богдан Андрійович Демчук","url":"https://democracy-api.smallminds.dev/api/users/4a330c11-5d4c-47dd-bc90-0d53f8403923/"},"title":"ferrgerg","subtitle":"gergrgerg","description":"gregrgergergergergerg","enable_multiple_submissions":false,"election_email_domain":"gmail.com","limit_to_domain":true,"whitelist":"","public":false,"submission_start_time":"2023-04-23T06:00:00Z","submission_end_time":"2023-04-30T14:00:00Z","submission_release_time":"2023-05-03T14:00:00Z","voting_start_time":"2023-05-07T06:00:00Z","voting_end_time":"2023-05-14T14:00:00Z","voting_release_time":"2023-05-16T14:00:00Z","voting_open":false,"applications_open":false,"domain_match":true,"candidate_count":0}
  );

//  const election:<ElectionDetails> =
  // @ts-ignore
  const updateElection = (i: string): Promise<any> => {
    // return getElection(i)
    //   .then((res) => {
    //     setElection(res);
    //   })
    //   .catch(() => {
    //     Notification['error']({
    //       title: t('v2.errors.title'),
    //       description: t('v2.errors.electionInvalid'),
    //     });
    //     history.push('/');
    //   });
  };

  const manager: boolean = useMemo(() => {
    if (!user || !user.user || !election || !election.manager) return false;
    return user.user.id === election.manager.id;
  }, [user, election]);

  // Get Election
  // useEffect(() => {
  //   if (!id) return;
  //   updateElection(id);
  // }, [id]);

  // Show Management Tools
  useEffect(() => {
    if (!id || !election || !user) return;
    setShowTools(user.user.id === election.manager.id);
  }, [id, election, user]);

  // Return to the previous page if no ID is provided.
  // if (!id || id === undefined) {
  //   history.goBack();
  //   return null;
  // }

  if (!id || !election || election === undefined)
    return (
      <Fragment>
        <Loading half />
      </Fragment>
    );

  if (moment(election.voting_end_time).isBefore(moment())) {
    return (
      <Fragment>
        <h2>{election.title}</h2>
        <p>
          <b>@{election.election_email_domain}</b>
          {election.subtitle && (
            <Fragment>
              &nbsp;&middot;&nbsp;
              <span>{election.subtitle}</span>
            </Fragment>
          )}
        </p>
        <br />
        <br />
        <h3>{t('electionPage.resultSectionTitle')}</h3>
        {showTools && (
          <Fragment>
            <br />
            <ManagementTools
              id={id}
              election={election}
              user={user}
              updateElection={updateElection}
              finished={true}
            />
            <br />
          </Fragment>
        )}
        {manager ||
        (election.voting_release_time &&
          moment(election.voting_release_time).isBefore(moment())) ? (
          <ElectionResults />
        ) : (
          <Fragment>
            <p>{t('v2.labels.processingResults')}</p>
            <br />
            <ElectionManager election={election} />
            <br />
            <br />
            <ElectionSteps election={election} />
          </Fragment>
        )}
        <br />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <h2>{election.title}</h2>
      <p>
        <b>@{election.election_email_domain}</b>
        {election.subtitle && (
          <Fragment>
            &nbsp;&middot;&nbsp;
            <span>{election.subtitle}</span>
          </Fragment>
        )}
      </p>
      <br />
      {election && election.domain_match === false && (
        <Fragment>
          <Message
            type="error"
            showIcon
            description={
              t('electionPage.electionDomainErrorMsg') +
              `  @${election.election_email_domain}`
            }
          />
          <br />
        </Fragment>
      )}
      <Fragment>
        <ButtonToolbar>
          <IconButton
            appearance="primary"
            icon={<Icon icon="check2" />}
            onClick={() => history.push(`${match.url}/vote`)}
            disabled={!election.voting_open || !election.domain_match}
          >
            {t('electionPage.voteBtn')}
          </IconButton>
          <IconButton
            appearance="primary"
            icon={<Icon icon="list" />}
            onClick={() => history.push(`${match.url}/positions`)}
            color="green"
            disabled={!election.applications_open || !election.domain_match}
          >
            {t('electionPage.applyBtn')}
          </IconButton>
          <IconButton
            icon={<Icon icon="info" />}
            onClick={() => history.push(match.url)}
          >
            {t('electionPage.infoBtn')}
          </IconButton>
          <IconButton
            icon={<Icon icon="cubes" />}
            onClick={() => history.push(`${match.url}/positions`)}
          >
            {t('electionPage.openPositionBtn')}
          </IconButton>
          <Badge content={election.candidate_count || 0}>
            <IconButton
              icon={<Icon icon="speaker" />}
              onClick={() => history.push(`${match.url}/platforms`)}
            >
              {t('electionPage.platformBtn')}
            </IconButton>
          </Badge>
        </ButtonToolbar>
      </Fragment>
      <br />
      {showTools && (
        <Fragment>
          <br />
          <ManagementTools
            id={id}
            election={election}
            user={user}
            updateElection={updateElection}
            finished={false}
          />
          <br />
        </Fragment>
      )}
      <br />
      <Switch>
        {/* Positions*/}
        <Route path={`${match.url}/positions`}>
          <Positions
            id={id}
            election={election}
            user={user}
            updateElection={updateElection}
          />
        </Route>
        {/* Platforms */}
        <Route path={`${match.url}/platforms`}>
          <Platforms id={id} election={election} user={user} />
        </Route>
        {/* Info */}
        <Route path={match.url}>
          <Information
            id={id}
            election={election}
            user={user}
            updateElection={updateElection}
          />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default Election;
