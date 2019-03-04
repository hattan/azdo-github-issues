import tl = require('azure-pipelines-task-lib/task');
import rm = require('typed-rest-client');
import { Issue } from './models/issue';
import {GitHubApiService} from './services/gitHubApiService';


async function run() {
    try {
        let githubEndpointToken="";
        const githubRepository =`hattan/sandbox`
        
        let service : GitHubApiService = new GitHubApiService(githubEndpointToken,githubRepository);
       // let results = await service.getIssueBySha("66a2eda2804db3779920ed9fc572aa2b3be29fcb");
       // console.log(results);
       await service.processBuild("81","test-CI","66a2eda2804db3779920ed9fc572aa2b3be29fcb","Succeeded","https://dev.azure.com/Shobokshi/test/_build/results?buildId=81","master");
    }
    catch (err) {
        console.log(err);
    }
}

run();