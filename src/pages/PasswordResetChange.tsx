import React, { FC, Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Icon,
  IconButton,
  Notification,
  Schema,
} from 'rsuite';
import { resetPassword } from '../utils/api/User';

const PasswordResetChange: FC = () => {
  const [t] = useTranslation();
  const history = useHistory();
  const { uid, token } = useParams<Record<string, string | undefined>>();

  // This variable is required for rsuite forms.
  let form: any = undefined;

  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [miscErrors, setMiscErrors] = useState<string>('');

  const [formData, setFormData] = useState<Record<string, any>>({
    new_password1: '',
    new_password2: '',
    uid: '',
    token: '',
  });

  useEffect(() => {
    if (!uid || !token) return;
    setFormData({ uid: uid, token: token });
  }, [uid, token]);

  //form model set up
  const msg_required = t('signInForm.msgRequired');
  const model = Schema.Model({
    new_password1: Schema.Types.StringType()
      .isRequired(msg_required)
      .maxLength(200, 'max 200 characters')
      .minLength(1, msg_required),
    new_password2: Schema.Types.StringType()
      .isRequired(msg_required)
      .maxLength(200, 'max 200 characters')
      .minLength(1, msg_required),
  });

  const submitFormData = async () => {
    // Remove errors and set button to loading state.
    setLoading(true);
    setMiscErrors('');

    // First, check the form for errors.
    if (!form.check()) {
      // console.log('Form has errors.');
      // console.log(formErrors);
      setLoading(false);
      return;
    }

    // Then, submit the form to the backend.
    // console.log(formData);
    resetPassword(formData)
      .then((res) => {
        // console.log(res);
        setLoading(false);
        setDisabled(true);
        // Perform updates to local state:
        Notification['success']({
          title: t('setTimelineModal.updateNotification.successTitle'),
        });
      })
      .catch((err) => {
        // If errors occur, set them to display on the form.
        setFormErrors(err.response.data);
        const errKeys = Object.keys(err.response.data);
        const nonFieldErrors: boolean =
          errKeys.indexOf('non_field_errors') > -1;
        const detail: boolean = errKeys.indexOf('detail') > -1;
        if (nonFieldErrors) {
          setMiscErrors(err.response.data['non_field_errors']);
        } else if (detail) {
          setMiscErrors(err.response.data['detail']);
        }
        // console.log(err.response);
        setLoading(false);
      });
  };

  if (!uid || !token) return null;
  return (
    <div style={{ textAlign: 'center' }}>
      <br />
      <h3>{t('v2.passwordResetChange.title')}</h3>
      <br />
      <p>{t('v2.passwordResetChange.description')}</p>
      <br />
      <Form
        onChange={(newData) => setFormData(newData)}
        onCheck={(newErrors) => setFormErrors(newErrors)}
        formValue={formData}
        formError={formErrors}
        model={model}
        ref={(ref: any) => (form = ref)}
      >
        <FormGroup>
          <ControlLabel>
            {t('v2.passwordResetChange.form.password1')}
          </ControlLabel>
          <FormControl
            name="new_password1"
            type="password"
            disabled={disabled}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>
            {t('v2.passwordResetChange.form.password2')}
          </ControlLabel>
          <FormControl
            name="new_password2"
            type="password"
            disabled={disabled}
          />
        </FormGroup>
        <FormGroup>
          <ButtonToolbar>
            <Button
              size="lg"
              appearance="primary"
              loading={loading}
              disabled={disabled}
              onClick={submitFormData}
            >
              {t('general.submit')}
            </Button>
            {miscErrors ? (
              <Button
                appearance="subtle"
                onClick={submitFormData}
                disabled={disabled}
              >
                {miscErrors}
              </Button>
            ) : null}
          </ButtonToolbar>
        </FormGroup>
      </Form>
      {disabled && (
        <Fragment>
          <br />
          <IconButton
            appearance="primary"
            size="lg"
            icon={<Icon icon="arrow-right-line" />}
            onClick={() => {
              history.push('/');
            }}
          >
            {t('general.returnToLogin')}
          </IconButton>
        </Fragment>
      )}
      <br />
    </div>
  );
};

export default PasswordResetChange;
