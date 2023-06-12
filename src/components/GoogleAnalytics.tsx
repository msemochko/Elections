import React, { Fragment, useContext, useEffect } from 'react';
import { useLocation } from 'react-router';
import ReactGA from 'react-ga';
import { User } from '../utils/api/User';

// https://levelup.gitconnected.com/using-google-analytics-with-react-3d98d709399b

export default function GoogleAnalytics() {
  const location = useLocation();
  const user = useContext(User);

  useEffect(() => {
    if (!location) return;
    ReactGA.pageview(location.pathname);
    ReactGA.set({ page: location.pathname });
  }, [location]);

  useEffect(() => {
    if (!user || !user.user || !user.user.id) return;
    ReactGA.set({
      userId: user.user.id,
    });
  }, [user]);

  return <Fragment></Fragment>;
}
