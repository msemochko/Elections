import React, { useState } from 'react';
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
  ElectionDetails,
  updateOldElection,
} from '../utils/api/ElectionManagement';

interface EditElectionModalInput {
  closeModal: () => void;
  isOpen: boolean;
  electionDetails: ElectionDetails;
  cleanupFunc: () => void;
}

export default function EditElectionModal({
  closeModal,
  isOpen,
  electionDetails,
  cleanupFunc,
}: EditElectionModalInput) {
  const [loading, setLoading] = useState<boolean>(false);
  let form: any = undefined;
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState<Record<string, any>>({
    title: electionDetails.title,
    subtitle: electionDetails.subtitle,
    description: electionDetails.description,
  });
  const msg_required = 'This field is required';
  const model = Schema.Model({
    title: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required)
      .maxLength(200, 'max 200 characters'),
    subtitle: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required)
      .maxLength(200, 'max 200 characters'),
    description: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required)
      .maxLength(20000, 'max length reached, 20,000 characters'),
  });
  const [t] = useTranslation();
  async function submitNewDetails() {
    setLoading(true);
    if (!form.check()) {
      setLoading(false);
      return;
    }

    //Pass the formData the the endpoint
    updateOldElection(formData, electionDetails.id)
      .then((res: Number) => {
        if (res == 200) {
          Notification['success']({
            title: t('v2.editElectionModal.successNotificationTitle'),
            description: t('v2.editElectionModal.successNotificationBody'),
          });
          cleanupFunc();
        } else {
          Notification['error']({
            title: t('v2.editElectionModal.errorNotificationTitle'),
            description: t('v2.editElectionModal.errorNotificationBody'),
          });
        }
      })
      .finally(() => {
        setLoading(false);
        closeModal();
      });
  }
  return (
    <Modal
      backdrop="static"
      show={isOpen}
      onHide={() => closeModal()}
      size="sm"
    >
      <Modal.Header>
        <h5>{t('v2.editElectionModal.title')}</h5>
      </Modal.Header>
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
          <br />
          <p>{t('v2.editElectionModal.instructions')}</p>
          <br />
          <FormGroup>
            <ControlLabel>{t('v2.editElectionModal.titleLabel')}</ControlLabel>
            <FormControl name="title" />
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              {t('v2.editElectionModal.subtitleLabel')}
            </ControlLabel>
            <FormControl name="subtitle" />
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              {t('v2.editElectionModal.descriptionLabel')}
            </ControlLabel>
            <FormControl
              name="description"
              componentClass="textarea"
              rows={4}
              type="string"
            />
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          appearance="primary"
          loading={loading}
          disabled={loading}
          onClick={() => submitNewDetails()}
        >
          {t('v2.editElectionModal.subBtn')}
        </Button>
        <Button
          appearance="default"
          disabled={loading}
          onClick={() => closeModal()}
        >
          {t('v2.editElectionModal.cancelBtn')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
