import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Notification,
  Schema,
} from 'rsuite';
import { updatePassword } from '../utils/api/User';

/**
 * This form can be placed anywhere below the Credentials context provider.
 */

function ChangePasswordForm() {
  // This variable is required for rsuite forms.
  let form: any = undefined;
  // Set up localization hook
  const [t] = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [miscErrors, setMiscErrors] = useState<string>('');

  const [formData, setFormData] = useState<Record<string, any>>({
    new_password1: '',
    new_password2: '',
  });

  //form model set up
  const msg_required = t('signInForm.msgRequired');
  const model = Schema.Model({
    new_password1: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required)
      .maxLength(200, 'max 200 characters'),
    new_password2: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required)
      .maxLength(200, 'max 200 characters'),
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
    updatePassword(formData)
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

  return (
    <Form
      onChange={(newData) => setFormData(newData)}
      onCheck={(newErrors) => setFormErrors(newErrors)}
      formValue={formData}
      formError={formErrors}
      model={model}
      ref={(ref: any) => (form = ref)}
    >
      <FormGroup>
        <ControlLabel>{t('resetPassword.form.password1')}</ControlLabel>
        <FormControl name="new_password1" type="password" disabled={disabled} />
      </FormGroup>
      <FormGroup>
        <ControlLabel>{t('resetPassword.form.password2')}</ControlLabel>
        <FormControl name="new_password2" type="password" disabled={disabled} />
      </FormGroup>
      <FormGroup>
        <ButtonToolbar>
          <Button
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
  );
}

export default ChangePasswordForm;
