import { AxiosError } from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FlexboxGrid,
  Form,
  FormControl,
  FormGroup,
  Notification,
  Schema,
} from 'rsuite';
import {
  ElectionDetails,
  getElection,
  Position,
} from '../utils/api/ElectionManagement';
import {
  getPosition,
  PositionApplicationParams,
  submitPositionApplication,
} from '../utils/api/PositionApplication';
import { Credentials } from '../utils/Authentication';
import Loading from './Loading';

function PositionApply() {
  const [t] = useTranslation();
  const history = useHistory();
  let { positionId } = useParams<any>();
  const [position, setPosition] = useState<Position>();
  const [election, setElection] = useState<ElectionDetails>();
  const ctx = useContext(Credentials);
  //set up required variable for rsuite forms.
  let form: any = undefined;
  const msg_required = t('positionApplyPage.fieldIsRequiredMsg');
  const model = Schema.Model({
    platform: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required)
      .maxLength(20000, 'max length reached, 20,000 characters'),
  });
  //form data setup
  const [formData, setFormData] = useState<Record<string, any>>({
    platform: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});

  useEffect(() => {
    //Return early if no context is provided.
    if (!positionId || !ctx || !ctx.credentials.authenticated) return;
    //If logged in, attempt to get the position details
    getPosition(positionId)
      .then((res) => {
        setPosition(res);
        return getElection(res.election).then((val) => {
          setElection(val);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [positionId, ctx]);

  function submitApplication() {
    //Process form input, check for form errors
    if (!form.check()) {
      // console.log('Application form has errors.');
      console.error(formErrors);
      return;
    }

    let application: PositionApplicationParams = {
      platform: formData.platform,
      position: positionId,
    };
    submitPositionApplication(application)
      .then(() => {
        Notification['success']({
          title: t('positionApplyPage.subSuccessModalTitle'),
          description: t('positionApplyPage.subSuccessModalBody'),
        });
        history.goBack();
      })
      .catch((x: AxiosError) => {
        if (x.response && x.response.status === 406) {
          // If the code is 424,
          Notification['error']({
            title: t('positionApplyPage.subLimitationModalTitle'),
            description: t('positionApplyPage.subLimitationModalBody'),
          });
          return;
        } else if (x.response && x.response.status === 417) {
          Notification['error']({
            title: t('v2.errors.notOnWhitelist.title'),
            description: t('v2.errors.notOnWhitelist.description'),
          });
          return;
        }
        console.error(x);
        Notification['error']({
          title: t('positionApplyPage.subFailModalTitle'),
          description: t('positionApplyPage.subFailModalBody'),
        });
      });
  }

  if (!position || !election) return <Loading half />;

  const stripPlatform = (formData.platform || '').replace(
    /(\r\n|\n|\r)/gm,
    ' '
  );
  const platformWordCount: number = stripPlatform
    .split(' ')
    .filter((x: any) => x).length;
  const platformCharacters: number = stripPlatform.length;
  const platformWords = platformCharacters === 0 ? 0 : platformWordCount;

  return (
    <div>
      <h1>{position.title}</h1>
      <p className="light">
        <small>
          <b>{election.title}</b> &middot; {election.subtitle}
        </small>
      </p>
      <br />
      <h4>{t('positionApplyPage.positionSectionTitle')}</h4>
      {position.description.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ))}
      <br />
      <h4>{t('positionApplyPage.posAppFormTitle')}</h4>
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
            {t('positionApplyPage.posAppFormPlatform')}
          </ControlLabel>
          <FormControl rows={10} name="platform" componentClass="textarea" />
        </FormGroup>
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item>
            <p>
              ~ <b>{platformWords}w</b> &middot;{' '}
              <small>{platformCharacters}ch</small>
            </p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item>
            <ButtonToolbar>
              <Button
                appearance="primary"
                size="lg"
                onClick={() => submitApplication()}
              >
                {t('positionApplyPage.posAppFormSubBtn')}
              </Button>
              <Button size="lg" onClick={() => history.goBack()}>
                {t('positionApplyPage.posAppFormCancelBtn')}
              </Button>
            </ButtonToolbar>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Form>
    </div>
  );
}

export default PositionApply;
