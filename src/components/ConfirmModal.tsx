import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'rsuite';

interface ConfirmModalInput {
  modalTitle: string;
  modalBody: string;
  callBackFunc: any;
  isOpen: boolean;
  closeModal: any;
  cleanUpFunc: any;
}

export default function ConfirmModal({
  modalTitle,
  modalBody,
  callBackFunc,
  isOpen,
  closeModal,
  cleanUpFunc,
}: ConfirmModalInput) {
  const [t] = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Modal backdrop="static" show={isOpen} onHide={() => closeModal()}>
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalBody}</Modal.Body>
      <Modal.Footer>
        <Button
          loading={loading}
          disabled={loading}
          onClick={() => {
            setLoading(true);
            callBackFunc()
              .then((res: number) => {
                cleanUpFunc(res);
              })
              .finally(() => {
                setLoading(false);
                closeModal();
              });
          }}
          appearance="primary"
        >
          {t('confirmModal.okBtn')}
        </Button>
        <Button
          disabled={loading}
          onClick={() => closeModal()}
          appearance="default"
        >
          {t('confirmModal.cancelBtn')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
