import { readFile } from "fs/promises";
import path from "path";
import { globby } from "globby";
import fetch from "node-fetch";
import { GIT_HUB_API_HEADERS } from "./constants.js";
import {
  getGetRefURL,
  getGetCommitURL,
  getCreateBlobURL,
  getCreateTreeURL,
  getCreateCommitURL,
  getUpdateRefURL,
} from "./endpoints.js";

const getCurrentCommit = async (org: any, repo: any, branch: any) => {
  const response = await fetch(getGetRefURL(org, repo, `heads/${branch}`), {
    method: "GET",
    headers: GIT_HUB_API_HEADERS,
  });

  const refData = await response.json();

  const commitSha = refData.object.sha;

  const responseCommit = await fetch(getGetCommitURL(org, repo, commitSha), {
    method: "GET",
  });

  const commitData = await responseCommit.json();

  return {
    commitSha,
    treeSha: commitData.tree.sha,
  };
};

const getFileAsUTF8 = (filePath: any) => readFile(filePath, "utf8");

const createBlobForFile = (org: any, repo: any) => async (filePath: any) => {
  const content = await getFileAsUTF8(filePath);

  const response = await fetch(getCreateBlobURL(org, repo), {
    method: "POST",
    body: JSON.stringify({
      content,
      encoding: "utf-8",
    }),
    headers: GIT_HUB_API_HEADERS,
  });

  const result = await response.json();

  return result;
};

const createNewTree = async (
  owner: any,
  repo: any,
  blobs: any,
  paths: any,
  parentTreeSha: any
) => {
  const tree = blobs.map(({ sha }: any, index: any) => {
    return {
      path: `md/${paths[index]}`,
      mode: `100644`,
      type: `blob`,
      sha,
    };
  });

  const responseTree = await fetch(getCreateTreeURL(owner, repo), {
    method: "POST",
    headers: GIT_HUB_API_HEADERS,
    body: JSON.stringify({
      base_tree: parentTreeSha,
      tree,
    }),
  });

  const data = await responseTree.json();
  return data;
};

export const createNewCommit = async (
  org: any,
  repo: any,
  message: any,
  currentTreeSha: any,
  currentCommitSha: any
) => {
  const commitResponse = await fetch(getCreateCommitURL(org, repo), {
    method: "POST",
    headers: GIT_HUB_API_HEADERS,
    body: JSON.stringify({
      message,
      tree: currentTreeSha,
      parents: [currentCommitSha],
    }),
  });

  const data = await commitResponse.json();

  return data;
};

export const setBranchToCommit = (
  org: any,
  repo: any,
  branch: any,
  commitSha: any
) => {
  fetch(getUpdateRefURL(org, repo, `heads/${branch}`), {
    method: "PATCH",
    headers: GIT_HUB_API_HEADERS,
    body: JSON.stringify({
      sha: commitSha,
      force: true,
    }),
  });
};

export const uploadToRepo = async (coursePath: any, repo: any, branch: any) => {
  const currentCommit = await getCurrentCommit("delawere", repo, branch);
  const filesPaths = await globby(coursePath);
  const filesBlobs = await Promise.all(
    filesPaths.map(createBlobForFile("delawere", repo))
  );
  const pathsForBlobs = filesPaths.map((fullPath: any) => {
    return path.relative(coursePath, fullPath);
  });

  const newTree = await createNewTree(
    "delawere",
    repo,
    filesBlobs,
    pathsForBlobs,
    currentCommit.treeSha
  );
  const newCommit = await createNewCommit(
    "delawere",
    repo,
    "test",
    newTree.sha,
    currentCommit.commitSha
  );
  setBranchToCommit("delawere", repo, branch, newCommit.sha);
};
