import tl = require('azure-pipelines-task-lib/task');
import {GitHubApiService} from './services/gitHubApiService';

function getBuildUrl(teamFoundationCollectionUri:string, teamProject: string, buildId: string){
    return `${teamFoundationCollectionUri}${teamProject}/_build/results?buildId=${buildId}`;
}
async function run() {
    try {
        let githubEndpointToken;

        const buildId = tl.getVariable('Build.BuildId');
        const definitionName = tl.getVariable('Build.DefinitionName');
        const sourceVersion = tl.getVariable('Build.SourceVersion');
        const jobStatus = tl.getVariable('Agent.JobStatus');
        const teamFoundationCollectionUri = tl.getVariable('System.TeamFoundationCollectionUri');
        const teamProject = tl.getVariable('System.TeamProject');
        const url = getBuildUrl(teamFoundationCollectionUri,teamProject,buildId);
        const hostType = tl.getVariable('System.HostType');
        const sourceBranchName = tl.getVariable('Build.SourceBranchName');
        if(hostType === 'deployment'){
            throw "This task is only for build piplines."
        }

        const githubEndpoint = tl.getInput('githubEndpoint')
        const githubEndpointObject = tl.getEndpointAuthorization(githubEndpoint,false);
                
        if (githubEndpointObject.scheme === 'PersonalAccessToken') {
            githubEndpointToken = githubEndpointObject.parameters.accessToken;
          } else {
             githubEndpointToken = githubEndpointObject.parameters.AccessToken;
          }

        const githubRepository = tl.getInput('githubRepository');
        
        let service : GitHubApiService = new GitHubApiService(githubEndpointToken,githubRepository);
        await service.processBuild(buildId,definitionName,sourceVersion,jobStatus,url,sourceBranchName);

    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();