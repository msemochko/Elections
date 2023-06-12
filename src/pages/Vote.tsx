import { AxiosError, AxiosResponse } from 'axios';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  ButtonToolbar,
  Col,
  Divider,
  FlexboxGrid,
  Form,
  FormControl,
  FormGroup,
  Notification,
  Radio,
  RadioGroup,
} from 'rsuite';
import CandidateInfo from '../components/CandidateInfo';
import { PositionDetails } from '../utils/api/ElectionManagement';
import {
  EmptyBallot,
  getEmptyBallot,
  submitBallot,
  VoteParams,
} from '../utils/api/Voting';
import { Credentials } from '../utils/Authentication';
import { random } from '../utils/random';
import Loading from './Loading';

export default function Vote() {
  const [t] = useTranslation();
  const history = useHistory();
  let { id } = useParams<any>();
  const ctx = useContext(Credentials);
  //set up required variable for rsuite forms.
  let form: any = undefined;

  //form data setup
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});

  const [ballot, setBallot] = useState<EmptyBallot>();

  // useEffect(() => {
  //   // console.log('Getting ballot...');
  //   //Return early if no context is provided.
  //   if (!id || !ctx || !ctx.credentials.authenticated || ballot) return;
  //   //If logged in, attempt to get the position details
  //   getEmptyBallot(id).then((ballot: EmptyBallot) => {
  //     // Shuffle candidates within ballot:
  //     ballot.positions = ballot.positions.map((position) => {
  //       position.candidates = random.shuffle(position.candidates);
  //       return position;
  //     });
  //     setBallot(ballot);
  //   });
  // }, [id]);

  const submit = () => {
    // First, check the form for errors.
    if (!ballot) return;
    const formDataKeys = Object.keys(formData);
    // console.log(formData);

    // Place all missing keys into an array.
    const missingPositions: PositionDetails[] = [];
    ballot.positions.forEach((position) => {
      if (
        formDataKeys.indexOf(position.id) === -1 &&
        position.candidates.length !== 0
      ) {
        missingPositions.push(position);
      }
    });

    // Add all missing keys to the form errors.
    if (missingPositions.length !== 0) {
      // console.log('Missing positions detected.');
      const errors: any = {};
      missingPositions.forEach((position) => {
        errors[position.id] = 'Required.';
      });
      setFormErrors(errors);
      // console.log('Form is missing election fields.');
      // console.log(errors);
      return;
    } else {
      setFormErrors({});
    }

    if (!form.check()) {
      // console.log('Form has errors.');
      // console.log(formErrors);
      return;
    }

    // console.log('Form has NO ERRORS, submitting...');
    const votes: VoteParams[] = [];
    ballot.positions.forEach((position) => {
      // Don't submit a vote for no-candidate positions.
      if (position.candidates.length === 0) return;
      const choice = formData[position.id];
      if (choice === 'abstain') {
        votes.push({
          position: position.id,
          candidate: undefined,
          vote_type: 'ABSTAIN',
        });
        return;
      }
      if (choice === 'no_confidence') {
        votes.push({
          position: position.id,
          candidate: undefined,
          vote_type: 'NO_CONFIDENCE',
        });
        return;
      }
      votes.push({
        position: position.id,
        candidate: choice,
        vote_type: 'NORMAL',
      });
    });
    // console.log(votes);
    submitBallot({
      election: id.toString().trim(),
      votes: votes,
    })
      .then((res: AxiosResponse) => {
        // console.log(res);
        setFormData({});
        setFormErrors({});
        history.push(`/election/${id}`);
        Notification['success']({
          title: t('votePage.ballotSubSuccessModalTitle'),
          description: t('votePage.ballotSubSuccessModalBody'),
        });
      })
      .catch((err: AxiosError) => {
        console.error(err);
        if (err.response && err.response.status) {
          if (err.response.status === 417) {
            Notification['error']({
              title: t('v2.errors.notOnWhitelist.title'),
              description: t('v2.errors.notOnWhitelist.description'),
            });
            return;
          } else if (err.response.status === 406) {
            Notification['error']({
              title: t('v2.errors.alreadySubmittedBallot.title'),
              description: t('v2.errors.alreadySubmittedBallot.description'),
            });
            return;
          }
        }
        Notification['error']({
          title: t('votePage.ballotSubFailModalTitle'),
          description: t('votePage.ballotSubFailModalBody'),
        });
      });
  };

  // While we fetch the ballot, show the spinner.
  if (!ballot)
    return (
      <Fragment>
        <Loading half />
      </Fragment>
    );

  return (
    <div>
      <Fade triggerOnce duration={200}>
        <div>
          <h3>{`${t('votePage.ballotElectionTitle')} ${ballot.title}`}</h3>
          <p>
            {`${t('votePage.ballotPositionTitle')} ${ballot.positions
              .map((pos) => pos.title)
              .join(', ')}`}
          </p>
          <p>{t('votePage.ballotViewCandidateInfo')}</p>
          <br />
        </div>
      </Fade>
      <Form
        onChange={(newData) => setFormData(newData)}
        checkTrigger="none"
        formValue={formData}
        formError={formErrors}
        ref={(ref: any) => (form = ref)}
        fluid
      >
        <FormGroup>
          <Fade cascade triggerOnce damping={0.1} duration={200} delay={100}>
            {ballot.positions.map((pos, index) => (
              <div key={index}>
                <Divider>
                  <h3>{pos.title}</h3>
                </Divider>
                <br />
                <h5>{t('votePage.ballotPosDescriptionTitle')}</h5>
                {pos.description.split('\n').map((line, index) => (
                  <p key={index}>
                    <i>{line}</i>
                  </p>
                ))}
                <br />
                {pos.candidates.length !== 0 ? (
                  <Fragment>
                    <h5>{t('votePage.ballotPosCandidateTitle')}</h5>
                    <br />

                    {
                      <FlexboxGrid align="middle">
                        {pos.candidates.map((candidate, index) => (
                          <FlexboxGrid.Item
                            key={index}
                            style={{ paddingRight: 10, width: 180 }}
                          >
                            <CandidateInfo candidate={candidate} />
                          </FlexboxGrid.Item>
                        ))}
                      </FlexboxGrid>
                    }

                    <br />
                    <h5>{t('votePage.ballotVoteSectionTitle')}</h5>
                    <br />
                    <FormControl name={pos.id} accepter={RadioGroup} required>
                      {pos.candidates.map((candidate, index) => (
                        <Radio key={index} value={candidate.id}>
                          <b>{candidate.user.name}</b>
                        </Radio>
                      ))}
                      <Radio value={`abstain`}>
                        <b>{t('v2.votePage.option.abstain')}</b>
                      </Radio>
                      <Radio value={`no_confidence`}>
                        <b>{t('v2.votePage.option.noConfidence')}</b>
                      </Radio>
                    </FormControl>
                  </Fragment>
                ) : (
                  <Fragment>
                    <p>
                      <b>{t('v2.votePage.noContest')}</b>
                    </p>
                    <br />
                  </Fragment>
                )}
              </div>
            ))}
          </Fade>
          <div>
            <Divider />
          </div>
          <div>
            <FlexboxGrid justify="end">
              <FlexboxGrid.Item>
                <ButtonToolbar>
                  <Button
                    appearance="primary"
                    size="lg"
                    type="submit"
                    onClick={() => submit()}
                  >
                    {t('votePage.ballotSubBtn')}
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => {
                      history.goBack();
                    }}
                  >
                    {t('votePage.ballotCancelBtn')}
                  </Button>
                </ButtonToolbar>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </div>
        </FormGroup>
      </Form>
    </div>
  );
}
