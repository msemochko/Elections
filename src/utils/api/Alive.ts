import { AxiosResponse } from 'axios';
import { api } from '../API';

export type AppInfo = {
  name: string;
  author: string;
  api_version: string;
};

const aliveURL = `/alive/alive/`;

export async function alive(): Promise<AxiosResponse> {
  return api.get(aliveURL).then((response) => {
    // console.log(response);
    return response;
  });
}

export async function info(): Promise<AxiosResponse> {
  return api.get('/').then((response) => {
    return response;
  });
}
