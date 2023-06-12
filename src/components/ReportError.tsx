import React from 'react';
import { useHistory } from 'react-router';
import { Button } from 'rsuite';

export default function ReportError() {
  const history = useHistory();
  return (
    <div style={{ padding: 20, margin: '20px auto', maxWidth: '500px' }}>
      <h1>You Found a Bug!</h1>
      <p>
        <b>We're super sorry!</b> an error report has been sent to the devs and
        will be reviewed shortly. Please reload the app and contact the
        developers if the crash was super bad.
      </p>
      <br />
      <Button
        block
        appearance="primary"
        onClick={() => window.location.reload()}
      >
        Refresh
      </Button>
    </div>
  );
}
