/**
 * Returns backend url, without ending slash.
 */
export function getBackendURL() {
  return process.env.REACT_APP_BACKEND_URL;
  // In production, must be set to 'https://sm-democracy-v1.herokuapp.com';
}
