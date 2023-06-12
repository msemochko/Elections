import { AxiosError } from 'axios';
import moment from 'moment';
import React, { Fragment, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Col,
  ControlLabel,
  DatePicker,
  Drawer,
  FlexboxGrid,
  Form,
  FormControl,
  FormGroup,
  Icon,
  IconButton,
  Notification,
  Radio,
  RadioGroup,
  Schema,
} from 'rsuite';
import { create } from '../utils/api/ElectionManagement';
import { Credentials } from '../utils/Authentication';

/**
 * Reminder to self:
 * Max editing this file. Do not edit until his PR is merged.
 */

// By default, use two one-week periods to run the election.
// Attempts to set time to 9AM to 5pm
const a = moment().add(7, 'days').hours(9).startOf('hour').toDate();
const b = moment().add(14, 'days').hours(17).startOf('hour').toDate();
const c = moment().add(17, 'days').hours(17).startOf('hour').toDate();
const d = moment().add(21, 'days').hours(9).startOf('hour').toDate();
const e = moment().add(28, 'days').hours(17).startOf('hour').toDate();
const f = moment().add(30, 'days').hours(17).startOf('hour').toDate();
const timeformat = 'YYYY-MM-DD HH:mm';

function NewElectionButton() {
  // When the app first starts, it is unauthenticated.
  const ctx = useContext(Credentials);
  const [loading, setLoading] = useState<boolean>(false);
  // Drawer open/closed state:
  const [open, setOpen] = useState<boolean>(false);
  // Set up localization hook
  const [t] = useTranslation();
  //set up required variable for rsuite forms.
  let form: any = undefined;
  //form model setup
  const msg_required = t('createElectionBtn.msgRequired');
  const msg_ivalid_format = t('createElectionBtn.msgInvalidFormat');
  const msg_max_length_200 = t('createElectionBtn.maxLength200');

  const model = Schema.Model({
    title: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required)
      .maxLength(200, msg_max_length_200),
    subtitle: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required)
      .maxLength(200, msg_max_length_200),
    description: Schema.Types.StringType()
      .isRequired(msg_required)
      .maxLength(20000, 'max 20,000 characters')
      .minLength(1, msg_required),
    enable_multiple_submissions: Schema.Types.BooleanType(),
    election_email_domain: Schema.Types.StringType()
      .isRequired(msg_required)
      .pattern(
        /^(?!:\/\/)([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?$/,
        msg_ivalid_format
      ),
    submission_start_time: Schema.Types.DateType().isRequired(msg_required),
    submission_end_time: Schema.Types.DateType()
      .isRequired(msg_required)
      .addRule((value, data) => {
        if (value < data.submission_start_time) {
          return false;
        }
        return true;
      }, 'The application deadline must be after the start date!'),
    submission_release_time: Schema.Types.DateType()
      .isRequired(msg_required)
      .addRule((value, data) => {
        if (value < data.submission_end_time) {
          return false;
        }
        return true;
      }, 'The candidate platform release date must be after the application deadline date!'),
    voting_start_time: Schema.Types.DateType()
      .isRequired(msg_required)
      .addRule((value, data) => {
        if (value < data.submission_release_time) {
          return false;
        }
        return true;
      }, 'The voting start date must be after the application deadline date!'),
    voting_end_time: Schema.Types.DateType()
      .isRequired(msg_required)
      .addRule((value, data) => {
        if (value < data.voting_start_time) {
          return false;
        }
        return true;
      }, 'The voting deadline must be after the voting start date!'),
    voting_release_time: Schema.Types.DateType()
      .isRequired(msg_required)
      .addRule((value, data) => {
        if (value < data.voting_end_time) {
          return false;
        }
        return true;
      }, 'The election result release date must be after the voting end date!'),
  });
  //form data setup
  const [formData, setFormData] = useState<Record<string, any>>({
    title: '',
    subtitle: '',
    description: '',
    enable_multiple_submissions: false,
    election_email_domain: 'uottawa.ca',
    submission_start_time: a,
    submission_end_time: b,
    submission_release_time: c,
    voting_start_time: d,
    voting_end_time: e,
    voting_release_time: f,
  });
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const history = useHistory();

  /**
   * Creates a new election and navigates to that page.
   * @param electionDetails User input for the election details
   */
  const createElection = async (electionDetails: Record<string, any>) => {
    // If  not authenticated, quit early.
    if (!ctx || !ctx.credentials.authenticated) return;
    // Otherwise, start loading animations.
    setLoading(true);

    // Process form input, check for form errors
    if (!form.check()) {
      // console.log('New election form has errors.');
      // console.log(formErrors);
      setLoading(false);
      return;
    }
    // Call the creation endpoint.
    create({
      title: electionDetails.title,
      subtitle: electionDetails.subtitle,
      description: electionDetails.description,
      election_email_domain: electionDetails.election_email_domain,
      enable_multiple_submissions: electionDetails.enable_multiple_submissions,
      submission_start_time: electionDetails.submission_start_time,
      submission_end_time: electionDetails.submission_end_time,
      submission_release_time: electionDetails.submission_release_time,
      voting_start_time: electionDetails.voting_start_time,
      voting_end_time: electionDetails.voting_end_time,
      voting_release_time: electionDetails.voting_release_time,
    })
      .then((election) => {
        let path = `/election/${election.id}`;
        history.push(path);
        setFormData({}); // Clear form after successful submission.
      })
      .catch((x: AxiosError) => {
        console.error(x);
        if (x.response && x.response.status === 424) {
          // If the code is 424,
          Notification['error']({
            title: t('createElectionBtn.tooManyElectionsErrorTitle'),
            description: t('createElectionBtn.tooManyElectionsErrorBody'),
          });
          return;
        }

        Notification['error']({
          title: t('createElectionBtn.failMsgTitle'),
          description: t('createElectionBtn.failMsg'),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <IconButton
        icon={<Icon icon="plus"></Icon>}
        appearance="primary"
        size="lg"
        // disabled={!ctx?.credentials.authenticated}
        loading={loading}
        onClick={() => setOpen(true)}
      >
        {t('createElectionBtn.btnLabel')}
      </IconButton>
      <Drawer
        full
        show={open}
        placement={'bottom'}
        onHide={() => setOpen(false)}
      >
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item
            componentClass={Col}
            colspan={24}
            style={{ maxWidth: '700px' }}
          >
            <Drawer.Header>
              <Drawer.Title>
                {t('createElectionBtn.electionFormTitle')}
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Form
                onChange={(newData) => setFormData(newData)}
                onCheck={(newErrors) => setFormErrors(newErrors)}
                formValue={formData}
                formError={formErrors}
                model={model}
                ref={(ref: any) => (form = ref)}
                fluid
              >
                <FormGroup>
                  <ControlLabel>
                    {t('createElectionBtn.electionTitle')}
                  </ControlLabel>
                  <FormControl name="title" />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>
                    {t('createElectionBtn.electionSubtitle')}
                  </ControlLabel>
                  <FormControl name="subtitle" />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>
                    {t(
                      'createElectionBtn.electionDescriptionAndSubmissionInfo'
                    )}
                  </ControlLabel>
                  <FormControl
                    rows={5}
                    name="description"
                    componentClass="textarea"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>
                    {t('createElectionBtn.electionEnableMultiSubs')}
                  </ControlLabel>
                  <FormControl
                    name="enable_multiple_submissions"
                    accepter={RadioGroup}
                    inline
                  >
                    <Radio value={true}>
                      {t('createElectionBtn.electionMultiSubsTrue')}
                    </Radio>
                    <Radio value={false} checked>
                      {t('createElectionBtn.electionMultiSubsFalse')}
                    </Radio>
                  </FormControl>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>
                    {t('createElectionBtn.electionEmailDomain')}
                  </ControlLabel>
                  <FormControl name="election_email_domain"></FormControl>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>
                    {t('createElectionBtn.applicationPeriod')}
                  </ControlLabel>
                  <FlexboxGrid justify="start" align="middle">
                    <FlexboxGrid.Item>
                      <FormControl
                        accepter={DatePicker}
                        name="submission_start_time"
                        format={timeformat}
                        placement="topStart"
                      ></FormControl>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ padding: 10 }}>
                      {t('createElectionBtn.betweenDates')}
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item>
                      <FormControl
                        accepter={DatePicker}
                        name="submission_end_time"
                        format={timeformat}
                        placement="topEnd"
                      ></FormControl>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Candidate Platform Release Date</ControlLabel>
                  <FormControl
                    accepter={DatePicker}
                    name="submission_release_time"
                    format={timeformat}
                    placement="topStart"
                  ></FormControl>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>
                    {t('createElectionBtn.votingPeriod')}
                  </ControlLabel>
                  <FlexboxGrid justify="start" align="middle">
                    <FlexboxGrid.Item>
                      <FormControl
                        accepter={DatePicker}
                        name="voting_start_time"
                        format={timeformat}
                        placement="topStart"
                      ></FormControl>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ padding: 10 }}>
                      {t('createElectionBtn.betweenDates')}
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item>
                      <FormControl
                        accepter={DatePicker}
                        name="voting_end_time"
                        format={timeformat}
                        placement="topEnd"
                      ></FormControl>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Election Result Release Date</ControlLabel>
                  <FormControl
                    accepter={DatePicker}
                    name="voting_release_time"
                    format={timeformat}
                    placement="topStart"
                  ></FormControl>
                </FormGroup>
              </Form>
            </Drawer.Body>
            <Drawer.Footer style={{ paddingBottom: 10 }}>
              <Button
                disabled={!ctx?.credentials.authenticated}
                loading={loading}
                appearance="primary"
                onClick={() => {
                  setLoading(true);
                  createElection(formData);
                }}
              >
                {t('createElectionBtn.createBtn')}
              </Button>
              <Button
                disabled={!ctx?.credentials.authenticated}
                loading={loading}
                appearance="subtle"
                onClick={() => setOpen(false)}
              >
                {t('createElectionBtn.cancelBtn')}
              </Button>
            </Drawer.Footer>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Drawer>
    </Fragment>
  );
}

export default NewElectionButton;
