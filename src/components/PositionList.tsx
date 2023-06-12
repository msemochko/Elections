import React, { FC, useContext, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Col, FlexboxGrid, List, Notification } from 'rsuite';
import {
  deletePosition,
  ElectionDetails,
} from '../utils/api/ElectionManagement';
import { User } from '../utils/api/User';
import { Credentials } from '../utils/Authentication';
import ConfirmModal from './ConfirmModal';

interface PLProps {
  election: ElectionDetails;
  updateElection: () => void;
}

const PositionList: FC<PLProps> = ({ election, updateElection }) => {
  const ctx = useContext(Credentials);
  const user = useContext(User);
  const history = useHistory();
  const [
    isDeletePositionModalOpen,
    setIsDeletePositionModalOpen,
  ] = useState<boolean>(false);
  const [positionId, setPositionId] = useState<string>();
  function closeDeletePositionModal() {
    setIsDeletePositionModalOpen(false);
  }
  if (!user || !ctx) return null;

  const showDelete = user.user.id === election.manager.id;
  const [t] = useTranslation();
  function deletePositionHandler(result: number): void {
    if (result == 204) {
      setIsDeletePositionModalOpen(false);
      updateElection();
      Notification['success']({
        title: t('positionList.deleteNotification.successTitle'),
        description: t('positionList.deleteNotification.successBody'),
      });
    } else {
      setIsDeletePositionModalOpen(false);
      Notification['error']({
        title: t('positionList.deleteNotification.errorTitle'),
        description: t('positionList.deleteNotification.errorBody'),
      });
    }
  }

  return (
    <div>
      {election.positions.length !== 0 ? (
        <List>
          <Fade cascade triggerOnce damping={0.2} duration={200} delay={100}>
            {election.positions.map((position, index) => (
              <div key={index}>
                <List.Item key={index}>
                  <FlexboxGrid align="middle" justify="space-between">
                    <FlexboxGrid.Item
                      componentClass={Col}
                      colspan={24}
                      sm={showDelete ? 12 : 16}
                    >
                      <h5>{position.title}</h5>
                      {position.description.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </FlexboxGrid.Item>
                    {showDelete && (
                      <FlexboxGrid.Item
                        componentClass={Col}
                        colspan={showDelete ? 12 : 24}
                        sm={6}
                      >
                        <Button
                          appearance="primary"
                          color="red"
                          onClick={() => {
                            setPositionId(position.id);
                            setIsDeletePositionModalOpen(true);
                          }}
                          block
                        >
                          {t('general.delete')}
                        </Button>
                      </FlexboxGrid.Item>
                    )}
                    <FlexboxGrid.Item
                      componentClass={Col}
                      colspan={showDelete ? 12 : 24}
                      sm={6}
                    >
                      {/*Navigate to the position application form*/}
                      <Button
                        block
                        disabled={
                          !election.applications_open || !election.domain_match
                        }
                        onClick={() => {
                          history.push(`/apply/${position.id}`);
                        }}
                      >
                        {t('positionList.applyBtn')}
                      </Button>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </List.Item>
              </div>
            ))}
          </Fade>
          <ConfirmModal
            modalTitle={t('positionList.confirmModalTitle')}
            modalBody={t('positionList.confirmModalBody')}
            callBackFunc={() => deletePosition(positionId)}
            isOpen={isDeletePositionModalOpen}
            closeModal={() => closeDeletePositionModal()}
            cleanUpFunc={(result: number) => deletePositionHandler(result)}
          />
        </List>
      ) : (
        <FlexboxGrid>
          <p>{t('positionList.emptyPosition')}</p>
        </FlexboxGrid>
      )}
    </div>
  );
};

export default PositionList;
