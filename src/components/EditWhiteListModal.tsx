import React, { useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Loader,
  Message,
  Modal,
  Notification,
  Schema,
} from 'rsuite';
import {
  getManagedElectionDetails,
  ManagedElectionDetails,
  updateOldElection,
} from '../utils/api/ElectionManagement';

interface EditWhiteListModalInput {
  closeModal: () => void;
  isOpen: boolean;
  electionId: string;
}

export default function EditWhiteListModal({
  closeModal,
  isOpen,
  electionId,
}: EditWhiteListModalInput) {
  const [processing, setProcessing] = useState<boolean>(false);
  let form: any = undefined;
  const [isLoading, setIsLoading] = useState<boolean>();
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [
    electionDetail,
    setElectionDetail,
  ] = useState<ManagedElectionDetails>();
  const [formData, setFormData] = useState<Record<string, any>>({
    whitelist: '',
  });
  const model = Schema.Model({
    whitelist: Schema.Types.StringType(),
  });
  const [t] = useTranslation();

  useEffect(() => {
    if (!electionId) return;
    getManagedElectionDetails(electionId).then((res) => {
      setElectionDetail(res);
      setFormData({ whitelist: res.whitelist });
      setIsLoading(false);
    });
  }, [electionId]);

  function submitWhitelist(input: string): void {
    setProcessing(true);
    if (electionDetail) {
      //Pass the formData the the endpoint
      updateOldElection(formData, electionId)
        .then((res: Number) => {
          // console.log(res);
          if (res == 200) {
            Notification['success']({
              title: t('v2.editWhitelistModal.successNotificationTitle'),
              description: t('v2.editWhitelistModal.successNotificationBody'),
            });
          } else {
            Notification['error']({
              title: t('v2.editWhitelistModal.errorNotificationTitle'),
              description: t('v2.editWhitelistModal.errorNotificationBody'),
            });
          }
        })
        .finally(() => {
          setProcessing(false);
          closeModal();
        });
    }
  }

  return (
    <Modal
      backdrop="static"
      show={isOpen}
      onHide={() => closeModal()}
      size="sm"
    >
      <Modal.Header>
        <h5>{t('v2.editWhitelistModal.title')}</h5>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <Loader />
        ) : (
          <Form
            onChange={(newData) => setFormData(newData)}
            onCheck={(newErrors) => setFormErrors(newErrors)}
            formValue={formData}
            formError={formErrors}
            model={model}
            ref={(ref: any) => (form = ref)}
            fluid
          >
            <Message
              type="warning"
              showIcon
              description={t('v2.editWhitelistModal.warning')}
            />
            <br />
            <p>{t('v2.editWhitelistModal.instructions')}</p>
            <br />
            <FormGroup>
              <ControlLabel>
                {t('v2.editWhitelistModal.formLabel')}
              </ControlLabel>
              <FormControl
                name="whitelist"
                componentClass="textarea"
                rows={20}
                placeholder="leave blank to disable whitelist"
                type="string"
              />
            </FormGroup>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          appearance="primary"
          disabled={isLoading || processing}
          loading={processing}
          onClick={() => submitWhitelist(formData.whitelist)}
        >
          {t('v2.editWhitelistModal.submitBtn')}
        </Button>
        <Button
          appearance="default"
          disabled={isLoading || processing}
          onClick={() => closeModal()}
        >
          {t('v2.editWhitelistModal.cancelBtn')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
