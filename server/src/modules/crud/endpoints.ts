import { GIT_HUB_API_URL } from "./constants.js";

export const getCreateBlobURL = (owner: string, repo: string) =>
  `${GIT_HUB_API_URL}/repos/${owner}/${repo}/git/blobs`;

export const getGetRefURL = (owner: string, repo: string, ref: string) =>
  `${GIT_HUB_API_URL}/repos/${owner}/${repo}/git/ref/${ref}`;

export const getGetCommitURL = (owner: string, repo: string, sha: string) =>
  `${GIT_HUB_API_URL}/repos/${owner}/${repo}/git/commits/${sha}`;

export const getCreateTreeURL = (owner: string, repo: string) =>
  `${GIT_HUB_API_URL}/repos/${owner}/${repo}/git/trees`;

export const getUpdateRefURL = (owner: string, repo: string, ref: string) =>
  `${GIT_HUB_API_URL}/repos/${owner}/${repo}/git/refs/${ref}`;

export const getCreateCommitURL = (owner: string, repo: string) =>
  `${GIT_HUB_API_URL}/repos/${owner}/${repo}/git/commits`;

export const getGetContentURL = (owner: string, repo: string, path: string) =>
  `${GIT_HUB_API_URL}/repos/${owner}/${repo}/contents/${path}`;

export const getGetReposURL = (owner: string) =>
  `${GIT_HUB_API_URL}/users/${owner}/repos`;
