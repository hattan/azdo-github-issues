# Create GitHub Issues on Failed Builds #

This extension contains a task to be used in an Azure DevOps Build Pipeline. This task checks the build status and if a build fails creates a GitHub issue in the designated repo. When the build is fixed, the task automatically closes the issue.

Note: This task only impacts failed or previously failing builds.

## Quick steps to get started ##

1. Create a new Azure DevOps or TFS Build pipeline.
2. Configure the build pipeline with tasks needed to build your project.
3. Add the GitHub Issues Notifier task.
4. Select the Github Service Connection you would like. If you do not have one, please add a new GitHub Service Connection.
5. Select the repository to post the issues too. (In general this should be the same as the source repo, but that may not always be the case.)
6. Expand "Control Options." and for Run this task select "Even if a previous task has failed, unless the build was cancelled." (NOTE: This step is important!)


## Learn More ##

The [source](https://github.com/hattan/azdo-github-issues) to this extension is available. Feel free to take, fork, and extend.

[View Notices](https://github.com/hattan/azdo-github-issues/blob/master/ThirdPartyNotices.txt) for third party software included in this extension.

## Minimum supported environments ##

- Azure DevOps
- TFS 2017 & 2018

## Feedback ##

- Add a review below.