import React, { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { FlexboxGrid, Icon, IconButton } from 'rsuite';

const ReturnToLogin: FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  const [t] = useTranslation();
  const history = useHistory();

  return (
    <FlexboxGrid align="middle" justify="center" style={{ height: '50vh' }}>
      <FlexboxGrid.Item>
        <div style={{ textAlign: 'center' }}>
          <br />
          <h2>{title}</h2>
          <br />
          {subtitle && (
            <Fragment>
              <p>{subtitle}</p> <br />
            </Fragment>
          )}
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
          <br />
        </div>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default ReturnToLogin;
