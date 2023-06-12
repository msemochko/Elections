import React, { FC, Fragment, useMemo } from 'react';
import { Fade } from 'react-awesome-reveal';
import Gravatar from 'react-gravatar';
import { useTranslation } from 'react-i18next';
import { Avatar, FlexboxGrid, Icon } from 'rsuite';
import { ElectionDetails } from '../utils/api/ElectionManagement';

interface EMProps {
  election: ElectionDetails;
}

const ElectionManager: FC<EMProps> = ({ election }) => {
  const userImage = useMemo(() => {
    return <Gravatar email={election.manager.email} size={40} rating="pg" />;
  }, [election]);

  const initials = useMemo(() => {
    return '';
  }, [election]);
  const [t] = useTranslation();
  if (!election || !election.manager || !election.manager.email) return null;
  return (
    <Fragment>
      <FlexboxGrid align="middle">
        <FlexboxGrid.Item>
          <Avatar style={{ margin: 7, marginLeft: 2, marginRight: 2 }}>
            {userImage && (
              <Fade triggerOnce duration={600} delay={100}>
                <div>{userImage}</div>
              </Fade>
            )}
          </Avatar>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item style={{ padding: 10 }}>
          <h5>{`${t('electionManager.manager')} ${election.manager.name}`}</h5>
          <p>
            <code>{election.manager.email}</code>
          </p>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item></FlexboxGrid.Item>
      </FlexboxGrid>
    </Fragment>
  );
};

export default ElectionManager;
