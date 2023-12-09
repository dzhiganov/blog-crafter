import { readFile } from "fs/promises";
import path from "path";
import fg from "fast-glob";
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

export class Articles {
  accessToken: string;
  user: string;

  constructor({ accessToken, user }: { accessToken: string; user: string }) {
    this.accessToken = accessToken;
    this.user = user;
  }

  getDefaultHeaders() {
    return {
      ...GIT_HUB_API_HEADERS,
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  async getCurrentCommit(org: any, repo: any, branch: any) {
    try {
      const response = await fetch(getGetRefURL(org, repo, `heads/${branch}`), {
        method: "GET",
        headers: this.getDefaultHeaders(),
      });

      const refData = await response.json();

      const commitSha = refData.object.sha;

      const responseCommit = await fetch(
        getGetCommitURL(org, repo, commitSha),
        {
          method: "GET",
        }
      );

      const commitData = await responseCommit.json();

      return {
        commitSha,
        treeSha: commitData.tree.sha,
      };
    } catch (err) {
      console.log("Error:", err);
      throw err;
    }
  }

  getFileAsUTF8(filePath: any) {
    return readFile(filePath, "utf8");
  }

  createBlobForFile(org: any, repo: any) {
    return async (filePath: any) => {
      const content = await this.getFileAsUTF8(filePath);

      const response = await fetch(getCreateBlobURL(org, repo), {
        method: "POST",
        body: JSON.stringify({
          content,
          encoding: "utf-8",
        }),
        headers: this.getDefaultHeaders(),
      });

      const result = await response.json();

      return result;
    };
  }

  async createNewTree(
    owner: any,
    repo: any,
    blobs: any,
    paths: any,
    parentTreeSha: any,
    pathInRepo: string
  ) {
    const tree = blobs.map(({ sha }: any) => {
      return {
        path: pathInRepo + "/index.md",
        mode: `100644`,
        type: `blob`,
        sha,
      };
    });

    const responseTree = await fetch(getCreateTreeURL(owner, repo), {
      method: "POST",
      headers: this.getDefaultHeaders(),
      body: JSON.stringify({
        base_tree: parentTreeSha,
        tree,
      }),
    });

    const data = await responseTree.json();
    return data;
  }

  async createNewCommit(
    org: any,
    repo: any,
    message: any,
    currentTreeSha: any,
    currentCommitSha: any
  ) {
    const commitResponse = await fetch(getCreateCommitURL(org, repo), {
      method: "POST",
      headers: this.getDefaultHeaders(),
      body: JSON.stringify({
        message,
        tree: currentTreeSha,
        parents: [currentCommitSha],
      }),
    });

    const data = await commitResponse.json();

    return data;
  }

  setBranchToCommit = (org: any, repo: any, branch: any, commitSha: any) => {
    fetch(getUpdateRefURL(org, repo, `heads/${branch}`), {
      method: "PATCH",
      headers: this.getDefaultHeaders(),
      body: JSON.stringify({
        sha: commitSha,
        force: true,
      }),
    });
  };

  async uploadToRepo(
    pathToFile: string,
    pathInRepo: string,
    repo: any,
    branch: any
  ) {
    const currentCommit = await this.getCurrentCommit(this.user, repo, branch);
    const filesPaths = await fg.glob(pathToFile);
    const filesBlobs = await Promise.all(
      filesPaths.map(this.createBlobForFile(this.user, repo))
    );
    const pathsForBlobs = filesPaths.map((fullPath: any) => {
      return path.relative(pathToFile, fullPath);
    });

    const newTree = await this.createNewTree(
      this.user,
      repo,
      filesBlobs,
      pathsForBlobs,
      currentCommit.treeSha,
      pathInRepo
    );
    const newCommit = await this.createNewCommit(
      this.user,
      repo,
      "test",
      newTree.sha,
      currentCommit.commitSha
    );

    this.setBranchToCommit(this.user, repo, branch, newCommit.sha);
  }
}
