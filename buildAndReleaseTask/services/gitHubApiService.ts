import rm = require('typed-rest-client');
import { Issue, Comment } from '../models/issue';
import { IssueType } from 'azure-pipelines-task-lib';

export class GitHubApiService{
  token: string;
  repository: string;

  constructor(token: string,repository: string) {
    this.token=token;
    this.repository = repository;
  }

  private getRequestOptions(){
    let requestOptions: rm.IRequestOptions = <rm.IRequestOptions>{};
    requestOptions.additionalHeaders = {
        "Authorization": `token ${this.token}`
    }
    return requestOptions;
  }

  public async getIssues() : Promise<Issue>{
    let rest: rm.RestClient = new rm.RestClient('azdo-github-issues', `https://api.github.com/`);
    let response: rm.IRestResponse<Issue> = await rest.get<Issue>(`/repos/${this.repository}/issues`, this.getRequestOptions());
    return response.result;
  }

  public async getIssueBySha(sha: string) : Promise<Issue>{
    let rest: rm.RestClient = new rm.RestClient('azdo-github-issues', `https://api.github.com/`);
    let response: rm.IRestResponse<Issue[]> = await rest.get<Issue[]>(`/repos/${this.repository}/issues`, this.getRequestOptions());
    let issues : Issue[] = response.result;
    let results = issues.filter(issue=>{
      return issue.body.includes(`Commit: ${sha}`);
    })
    return (results.length>0) ? results[0] : null;
  }

  public async getIssueByBranch(branch: string) : Promise<Issue>{
    let rest: rm.RestClient = new rm.RestClient('azdo-github-issues', `https://api.github.com/`);
    let response: rm.IRestResponse<Issue[]> = await rest.get<Issue[]>(`/repos/${this.repository}/issues`, this.getRequestOptions());
    let issues : Issue[] = response.result;
    let results = issues.filter(issue=>{
      return issue.body.includes(`Branch: ${branch}`);
    })
    return (results.length>0) ? results[0] : null;
  }

  public getFixedBuildMessage(buildUrl: string){
    return `Build is now succeeding! ${buildUrl}`;
  }

  public async postSuccessComment(issueNumber: number,buildUrl: string): Promise<Comment>{
    let rest: rm.RestClient = new rm.RestClient('azdo-github-issues', `https://api.github.com/`);
    let response: rm.IRestResponse<Comment> = await rest.create<Comment>(`/repos/${this.repository}/issues/${issueNumber}/comments`,{body: this.getFixedBuildMessage(buildUrl)}, this.getRequestOptions());
    console.log(`GitHub Issues Notifier: Adding success comment for issue ${issueNumber}.`);
    return response.result;
  }

  public async closeIssue(issueNumber: number): Promise<Issue>{
    let rest: rm.RestClient = new rm.RestClient('azdo-github-issues', `https://api.github.com/`);
    let response: rm.IRestResponse<Issue> = await rest.update<Issue>(`/repos/${this.repository}/issues/${issueNumber}`,{"state": "closed"}, this.getRequestOptions());
    console.log(`GitHub Issues Notifier: Closing issue ${issueNumber}.`);
    return response.result;
  }

  public async createIssue(buildId: string, pipeline: string, sha: string, jobStatus: string, buildUrl: string,branch: string): Promise<Issue>{
    let newIssue : Issue ={
      title: `Azure Build Failed - Pipeline:${pipeline} BuildId:${buildId}`,
      body: `\`\`\`
Build Failure for pipeline ${pipeline}
Build Status: ${jobStatus}
Commit: ${sha}
Branch: ${branch}
\`\`\`
${buildUrl}`
    };
    console.log(`/repos/${this.repository}/issues`);

    let rest: rm.RestClient = new rm.RestClient('azdo-github-issues', `https://api.github.com/`);
    let response: rm.IRestResponse<Issue> = await rest.create<Issue>(`/repos/${this.repository}/issues`,newIssue, this.getRequestOptions());
    if(response.statusCode === 201 && response.result){
      console.log(`GitHub Issues Notifier: Created new Issue. ${response.result.url}`);
    }
    return response.result;
  }
  public async processBuild(buildId: string, pipeline: string, sha: string, jobStatus: string, buildUrl: string,branch: string){
    const issue = await this.getIssueByBranch(branch);
    if(issue!=null){
      const issueNumber : number = issue.number;
      console.log(`GitHub Issues Notifier: Issue ${issueNumber} found.`);
      if(jobStatus == `Failed`){
        console.log(`GitHub Issues Notifier: Build is still failing, no further action.`);
        return;
      }      
      else if(jobStatus == `Succeeded` || jobStatus == `SucceededWithIssues`){
        await this.postSuccessComment(issueNumber,buildUrl);
        await this.closeIssue(issueNumber)
      }
    }
    else{
      if(jobStatus == `Failed`){
        console.log(`GitHub Issues Notifier: No existing issue for branch ${branch}.`);
        await this.createIssue(buildId,pipeline,sha,jobStatus,buildUrl,branch);
      } else if(jobStatus == `Succeeded` || jobStatus == `SucceededWithIssues`){
        console.log(`GitHub Issues Notifier: No existing issue for branch ${branch} and job has Succeeded. No actions taken.`);
      }
    }
  }
}