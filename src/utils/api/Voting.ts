import { AxiosResponse } from 'axios';
import { api, preRequestRefreshAuth } from '../API';
import { PositionDetails } from './ElectionManagement';

export type VoteParams = {
  position: string;
  candidate: string | undefined;
  vote_type: string;
};

export type SubmitBallotParams = {
  election: string;
  votes: VoteParams[];
};

const ballotURL = `/elections/vote/`;

export async function submitBallot(
  formData: SubmitBallotParams
): Promise<AxiosResponse> {
  const token = await preRequestRefreshAuth();
  return api
    .post(ballotURL, formData, {
      headers: { Authorization: `JWT ${token}` },
    })
    .then((res) => {
      return res;
    });
}

export type EmptyBallot = {
  created: string;
  description: string;
  election_email_domain: string;
  enable_multiple_submissions: boolean;
  id: string;
  manager: string;
  positions: Array<PositionDetails>;
  submission_end_time: string;
  submission_start_time: string;
  title: string;
  voting_end_time: string;
  voting_start_time: string;
};

const emptyBallotUrl = '/elections/emptyballot/';

export async function getEmptyBallot(electionId: string): Promise<EmptyBallot> {
  const token = await preRequestRefreshAuth();
  let config = {
    headers: { Authorization: `JWT ${token}` },
  };
  const res: AxiosResponse = await api.get(
    `${emptyBallotUrl}${electionId}/`,
    config
  );
  return res.data;
}
