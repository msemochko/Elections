import { AxiosResponse } from 'axios';
import { api } from '../API';

const signupURL = '/rest-auth/registration/';

export type signupFormData = {
  name: string;
  username: string;
  email: string;
  password1: string;
  password2: string;
};

export async function signup(data: any): Promise<AxiosResponse> {
  return api.post(signupURL, data);
}
