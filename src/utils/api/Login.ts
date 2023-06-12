import { AxiosResponse } from 'axios';
import { api, setNewAccessToken, setNewRefreshToken } from '../API';

const loginURL = `/jwt-auth/token/obtain/`;

export async function login(formData: any): Promise<AxiosResponse> {
  // Make the API call to the login endpoint.
  return api.post(loginURL, formData).then((response) => {
    // console.log('Got login response from backend:');
    // console.log(response);
    if (
      response.data &&
      response.data.access !== null &&
      response.data.refresh !== null
    ) {
      setNewAccessToken(response.data.access);
      setNewRefreshToken(response.data.refresh);
    } else {
      const msg = 'Received an unexpected response from the server.';
      throw new Error(msg);
    }

    return response;
  });
}
