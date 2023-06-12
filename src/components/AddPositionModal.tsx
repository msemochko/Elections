import React, { FC, Fragment, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Modal,
  Notification,
  Schema,
} from 'rsuite';
import {
  createPosition,
  ElectionDetails,
  Position,
} from '../utils/api/ElectionManagement';
import { Credentials } from '../utils/Authentication';

interface APMProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  election: ElectionDetails;
  onCreate: (p: Position) => void;
}

/**
 * Modal for adding election positions.
 * Uses open and setOpen props from parent.
 */
const AddPositionModal: FC<APMProps> = ({
  open,
  setOpen,
  election,
  onCreate,
}) => {
  const ctx = useContext(Credentials);
  const [loading, setLoading] = useState<boolean>(false);
  const [t] = useTranslation();
  //set up required variable for rsuite forms.
  let form: any = undefined;
  //form model setup
  const msg_required = t('addPositionModalComp.fieldRequiredMsg');
  const model = Schema.Model({
    title: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required)
      .maxLength(200, 'max 200 characters'),
    description: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required)
      .maxLength(20000, 'max length reached, 20,000 characters'),
  });
  //form data setup
  const [formData, setFormData] = useState<Record<string, any>>({
    title: '',
    description: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, any>>({});

  const createNewPosition = async (title: string, description: string) => {
    if (!ctx || !ctx.credentials.authenticated) return;
    setLoading(true);
    // Process form input, check for form errors
    if (!form.check()) {
      // console.log('New election form has errors.');
      // console.log(formErrors);
      setLoading(false);
      return;
    }
    // Call the creation endpoint.
    createPosition({
      title: title,
      description: description,
      election: election.id,
    })
      .then((position) => {
        onCreate(position);
        setFormData({}); // Clear form data after successful submission.
      })
      .catch((x) => {
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
      <Modal size="sm" show={open} onHide={() => setOpen(false)}>
        <Modal.Title>{t('addPositionModalComp.title')}</Modal.Title>
        <Modal.Body>
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
              <ControlLabel>{t('addPositionModalComp.posTitle')}</ControlLabel>
              <FormControl name="title" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>
                {t('addPositionModalComp.posDescription')}
              </ControlLabel>
              <FormControl
                rows={8}
                name="description"
                componentClass="textarea"
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={!ctx?.credentials.authenticated || loading}
            loading={loading}
            appearance="primary"
            onClick={() => {
              setLoading(true);
              createNewPosition(formData.title, formData.description);
            }}
          >
            {t('addPositionModalComp.createBtn')}
          </Button>
          <Button
            disabled={!ctx?.credentials.authenticated || loading}
            appearance="subtle"
            onClick={() => setOpen(false)}
          >
            {t('addPositionModalComp.cancelBtn')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default AddPositionModal;
