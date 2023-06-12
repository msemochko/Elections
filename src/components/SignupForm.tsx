import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  HelpBlock,
  Notification,
  Panel,
  Schema,
} from 'rsuite';
import { signup } from '../utils/api/Signup';
import { Credentials } from '../utils/Authentication';

/**
 * This form can be placed anywhere below the Credentials context provider.
 */

function SignupForm() {
  // This variable is required for rsuite forms.
  let form: any = undefined;
  // Set up localization hook
  const [t] = useTranslation();
  //form model set up
  const msg_required = t('signInForm.msgRequired');
  const model = Schema.Model({
    name: Schema.Types.StringType()
      .isRequired(msg_required)
      .maxLength(200, 'max 200 characters')
      .minLength(1, msg_required),
    email: Schema.Types.StringType()
      .isEmail(t('signInForm.invalidEmailFormatMsg'))
      .isRequired(msg_required)
      .maxLength(200, 'max 200 characters')
      .minLength(1, msg_required),
    password1: Schema.Types.StringType()
      .isRequired(msg_required)
      .maxLength(200, 'max 200 characters')
      .minLength(1, msg_required),
    password2: Schema.Types.StringType()
      .isRequired(msg_required)
      .maxLength(200, 'max 200 characters')
      .minLength(1, msg_required),
  });
  // When the app first starts, it is unauthenticated.
  const ctx = useContext(Credentials);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const [formData, setFormData] = useState<Record<string, any>>({
    name: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [miscErrors, setMiscErrors] = useState<string>('');

  // Disable the form if the user is logged in.
  useEffect(() => {
    if (!ctx || ctx === undefined) return;
    if (ctx?.credentials.authenticated) {
      setDisabled(true);
      setMiscErrors(t('signUpForm.loginErrorMsg'));
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
    signup(formData)
      .then((res) => {
        // console.log(res);
        setLoading(false);
        setDisabled(true);
        Notification['success']({
          title: t('signUpForm.signUpSuccessTitle'),
          description: t('signUpForm.signUpSuccessDescription'),
        });
      })
      .catch((err) => {
        // If errors occur, set them to display on the form.
        setFormErrors(err.response.data);
        const errKeys = Object.keys(err.response.data);
        const nonFieldErrors: boolean =
          errKeys.indexOf('non_field_errors') > -1;
        if (nonFieldErrors) {
          setMiscErrors(err.response.data['non_field_errors']);
        }
        // console.log(err.response);
        setLoading(false);
      });
  };

  return (
    <div>
      <Panel header={<h2>{t('signUpForm.sectionTitle')}</h2>} bordered>
        <Form
          onChange={(newData) => setFormData(newData)}
          onCheck={(newErrors) => setFormErrors(newErrors)}
          formValue={formData}
          formError={formErrors}
          model={model}
          ref={(ref: any) => (form = ref)}
        >
          <FormGroup>
            <ControlLabel>{t('signUpForm.nameInputLabel')}</ControlLabel>
            <FormControl name="name" disabled={disabled} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>{t('signUpForm.emailInputLabel')}</ControlLabel>
            <FormControl name="email" type="email" disabled={disabled} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>{t('signUpForm.passwordInputLabel')}</ControlLabel>
            <FormControl name="password1" type="password" disabled={disabled} />
          </FormGroup>
          <FormGroup>
            <FormControl name="password2" type="password" disabled={disabled} />
            <HelpBlock>{t('signUpForm.passwordInputFieldHint')}</HelpBlock>
          </FormGroup>
          <FormGroup>
            <ButtonToolbar>
              <Button
                appearance="primary"
                loading={loading}
                disabled={disabled}
                onClick={submitFormData}
              >
                {t('signUpForm.submitBtn')}
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
      </Panel>
      <br />
    </div>
  );
}

export default SignupForm;
