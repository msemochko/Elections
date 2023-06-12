import { AxiosResponse } from 'axios';
import { api, preRequestRefreshAuth } from '../API';
import { UserInfo } from './User';

const electionURL = `/elections/manage/election/`;
const electionPositionURL = `/elections/manage/position/`;
const electionParticipationURL = `/elections/participate/election/`;
const electionParticipationPositionURL = `/elections/participate/position/`;

export type EmptyElection = {
  id: string;
  created: Date;
  title: string;
  description: string;
};

export type Election = {
  created: string;
  title: string;
  subtitle: string;
  description: string;
  election_email_domain: string;
  enable_multiple_submissions: boolean;
  id: string;
  manager: string;
  positions: Array<string>;
  submission_end_time: string;
  submission_start_time: string;
  submission_release_time: string;
  voting_end_time: string;
  voting_start_time: string;
  voting_release_time: string;
  public: boolean;
};

export type ElectionDetails = {
  created: string;
  title: string;
  subtitle: string;
  description: string;
  election_email_domain: string;
  enable_multiple_submissions: boolean;
  id: string;
  manager: UserInfo;
  positions: Array<Position>;
  submission_end_time: string;
  submission_start_time: string;
  submission_release_time: string;
  voting_end_time: string;
  voting_start_time: string;
  voting_release_time: string;
  voting_open: boolean;
  applications_open: boolean;
  domain_match: boolean;
  candidate_count?: number;
};

export type ManagedElectionDetails = {
  manager: GenericUser;
  title: string;
  subtitle: string;
  description: string;
  enable_multiple_submissions: boolean;
  election_email_domain: string;
  whitelist: string;
  submission_end_time: string;
  submission_start_time: string;
  voting_end_time: string;
  voting_start_time: string;
};

/**
 * Results
 */

export type CandidateResult = {
  id: string;
  user: UserInfo;
  platform: string;
  votes: string[];
  voteCount?: number;
};

export type PositionResult = {
  id: string;
  title: string;
  description: string;
  candidates: CandidateResult[];
  abstain: number;
  no_confidence: number;
};

export type ElectionResult = {
  id: string;
  positions: PositionResult[];
};

/*
  Users
*/

export type GenericUser = {
  username: string;
  email: string;
  name: string;
};

export type CandidateWithUserDetails = {
  id: string;
  user: UserInfo;
  platform: string;
  position: string;
};

export type PositionDetails = {
  id: string;
  candidates: CandidateWithUserDetails[];
  title: string;
  description: string;
  election: string;
};

export type CreateElectionParams = {
  title: string;
  subtitle: string;
  description: string;
  election_email_domain: string;
  enable_multiple_submissions: boolean;
  submission_end_time: Date;
  submission_start_time: Date;
  submission_release_time: Date;
  voting_end_time: Date;
  voting_start_time: Date;
  voting_release_time: Date;
};

export async function create(
  formData: CreateElectionParams
): Promise<EmptyElection> {
  const token = await preRequestRefreshAuth();
  return api
    .post(electionURL, formData, {
      headers: { Authorization: `JWT ${token}` },
    })
    .then((res) => {
      const election: EmptyElection = res.data;
      return election;
    });
}

export async function getPublicElectionList(): Promise<AxiosResponse> {
  const token = await preRequestRefreshAuth();
  return api.get(electionParticipationURL, {
    headers: { Authorization: `JWT ${token}` },
  });
}

export async function getElectionList(): Promise<AxiosResponse> {
  const token = await preRequestRefreshAuth();
  return api.get(electionURL, {
    headers: { Authorization: `JWT ${token}` },
  });
}

export async function getElection(
  electionId: string
): Promise<ElectionDetails> {
  const token = await preRequestRefreshAuth();
  let config = {
    headers: { Authorization: `JWT ${token}` },
  };
  const res: AxiosResponse = await api.get(
    `${electionParticipationURL}${electionId}/`,
    config
  );
  return res.data;
}

export async function getElectionResult(
  electionId: string
): Promise<ElectionResult> {
  const token = await preRequestRefreshAuth();
  let config = {
    headers: { Authorization: `JWT ${token}` },
  };
  const res: AxiosResponse = await api.get(
    `/elections/results/${electionId}/`,
    config
  );
  return res.data;
}

export async function getManagedElectionDetails(
  electionId: string
): Promise<ManagedElectionDetails> {
  const token = await preRequestRefreshAuth();
  let config = {
    headers: { Authorization: `JWT ${token}` },
  };
  const res: AxiosResponse = await api.get(
    `/elections/manage/election/${electionId}/`,
    config
  );
  return res.data;
}

export async function deleteElection(electionId: string): Promise<Number> {
  const token = await preRequestRefreshAuth();
  return api
    .delete(`${electionURL}${electionId}/`, {
      headers: { Authorization: `JWT ${token}` },
    })
    .then((res) => {
      return res.status;
    })
    .catch((err) => {
      return err.status;
    });
}

export async function updateOldElection(
  newElectionDetails: Object,
  electionId: string
): Promise<Number> {
  const token = await preRequestRefreshAuth();
  return api
    .patch(`${electionURL}${electionId}/`, newElectionDetails, {
      headers: { Authorization: `JWT ${token}` },
    })
    .then((res) => {
      return res.status;
    })
    .catch((err) => {
      return err.status;
    });
}

export async function deletePosition(
  positionId: string | undefined
): Promise<Number> {
  const token = await preRequestRefreshAuth();

  return api
    .delete(`${electionPositionURL}${positionId}/`, {
      headers: { Authorization: `JWT  ${token}` },
    })
    .then((res) => {
      return res.status;
    })
    .catch((err) => {
      return err.status;
    });
}

export async function getPositionDetails(
  positionId: string
): Promise<PositionDetails> {
  const token = await preRequestRefreshAuth();
  let config = {
    headers: { Authorization: `JWT ${token}` },
  };
  const res: AxiosResponse = await api.get(
    `${electionParticipationPositionURL}${positionId}/`,
    config
  );
  return res.data;
}

/**
 * CANDIDATES
 */

export type Candidate = {
  id: string;
  created: string;
  position: string;
  platform: string;
};

/**
 * POSITIONS
 */

const positionManagementUrl = `/elections/manage/position/`;

export type CreatePositionParams = {
  title: string;
  description: string;
  election: string;
};

export type Position = {
  id: string;
  candidates: Candidate[];
  title: string;
  description: string;
  election: string;
};

export async function createPosition(
  formData: CreatePositionParams
): Promise<Position> {
  const token = await preRequestRefreshAuth();
  return api
    .post(positionManagementUrl, formData, {
      headers: { Authorization: `JWT ${token}` },
    })
    .then((res) => {
      const p: Position = res.data;
      return p;
    });
}

// 83962581-34d5-473f-a398-8c2b0c91af44
