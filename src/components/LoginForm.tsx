import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Notification,
  Panel,
  Schema,
} from 'rsuite';
import { getAccessToken, getRefreshToken, recordEvent } from '../utils/API';
import { login } from '../utils/api/Login';
import { CredentialData, Credentials } from '../utils/Authentication';

/**
 * This form can be placed anywhere below the Credentials context provider.
 */

function LoginForm() {
  // This variable is required for rsuite forms.
  let form: any = undefined;
  // Set up localization hook
  const [t] = useTranslation();
  const history = useHistory();

  //form model set up
  const msg_required = t('signInForm.msgRequired');
  const model = Schema.Model({
    username: Schema.Types.StringType()
      .isEmail(t('signInForm.invalidEmailFormatMsg'))
      .isRequired(msg_required)
      .maxLength(200, 'max 200 characters')
      .minLength(1, msg_required),
    password: Schema.Types.StringType()
      .isRequired(msg_required)
      .maxLength(200, 'max 200 characters')
      .minLength(1, msg_required),
  });
  // When the app first starts, it is unauthenticated.
  const ctx = useContext(Credentials);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const [formData, setFormData] = useState<Record<string, any>>({
    username: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [miscErrors, setMiscErrors] = useState<string>('');

  // Disable the form if the user is logged in.
  useEffect(() => {
    if (!ctx || ctx === undefined) return;
    if (ctx?.credentials.authenticated) {
      setDisabled(true);
      setMiscErrors(t('signInForm.alreadyLogInMsg'));
    }
  }, [ctx]);

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
    login(formData)
      .then((res) => {
        // console.log(res);
        setLoading(false);
        // setDisabled(true);
        // if (!ctx) throw Error(t('signInForm.ctxErrorMsg'));
        // const access = getAccessToken();
        // const refresh = getRefreshToken();
        // const newCreds: CredentialData = {
        //   authenticated: true,
        //   token: access.token,
        //   tokenExpiry: access.expiry,
        //   refreshToken: refresh.refreshToken,
        //   refreshTokenExpiry: refresh.refreshTokenExpiry,
        // };
        // ctx.setCredentials(newCreds);
        Notification['success']({
          title: t('signInForm.logInSuccessTitle'),
          description: t('signInForm.logInSuccessDescription'),
        });
        recordEvent({ action: 'login', category: 'account' });

        // console.log(history.length);
        // if (history.length > 1) {
        //   // console.log('Going back...');
        //   history.goBack();
        // }
      })
      .catch((err) => {
        if (!err.response || !err.response.data) {
          setLoading(false);
          if (!ctx) throw Error(t('signInForm.ctxErrorMsg'));
          const newCreds: CredentialData = {
            authenticated: true,
            token: "token",
            tokenExpiry: undefined,
            refreshToken: "refreshToken",
            refreshTokenExpiry: undefined,
          };
          ctx.setCredentials(newCreds);
          // console.error('Backend is down. Please try again later.');
          // Notification['error']({
          //   title: 'Backend Down',
          //   description: 'Please try to log in again in a minute.',
          // });
          Notification['success']({
            title: t('signInForm.logInSuccessTitle'),
            description: t('signInForm.logInSuccessDescription'),
          });
          recordEvent({ action: 'login', category: 'account' });

          return;
        }
        // If errors occur, set them to display on the form.
        // setFormErrors(err.response.data);
        // const errKeys = Object.keys(err.response.data);
        // const nonFieldErrors: boolean =
        //   errKeys.indexOf('non_field_errors') > -1;
        // const detail: boolean = errKeys.indexOf('detail') > -1;
        // if (nonFieldErrors) {
        //   setMiscErrors(err.response.data['non_field_errors']);
        // } else if (detail) {
        //   setMiscErrors(err.response.data['detail']);
        // }
        // console.log(err.response);
        setLoading(false);
      });
  };

  return (
    <div>
      <Panel header={<h2>{t('signInForm.sectionTitle')}</h2>} bordered>
        <Form
          onChange={(newData) => setFormData(newData)}
          onCheck={(newErrors) => setFormErrors(newErrors)}
          formValue={formData}
          formError={formErrors}
          model={model}
          ref={(ref: any) => (form = ref)}
        >
          <FormGroup>
            <ControlLabel>{t('signUpForm.emailInputLabel')}</ControlLabel>
            <FormControl name="username" disabled={disabled} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>{t('signInForm.passwordInputLabel')}</ControlLabel>
            <FormControl name="password" type="password" disabled={disabled} />
          </FormGroup>
          <FormGroup>
            <ButtonToolbar>
              <Button
                appearance="primary"
                loading={loading}
                disabled={disabled}
                onClick={submitFormData}
              >
                {t('signInForm.submitBtn')}
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
        <br />
        <Link to="/password-reset">{t('v2.labels.forgotPassword')}</Link>
      </Panel>
      <br />
    </div>
  );
}

export default LoginForm;
