# Azure DevOps Github Issues Notifier #

## Overview ##

This extension contains a task to be used in an Azure DevOps Build Pipeline. This task checks the build status and if a build fails creates a GitHub issue in the designated repo. When the build is fixed, the task automatically closes the issue.

Note: This task only impacts failed or previously failing builds.

Look at [overview.md](overview/md) for more information

Check out this extension at the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=hattanshobokshi.azdo-github-issues).

## How to Contribute ##

Please create an issue for any bug/feedback. If you would like to contribute to this extension, you could fork off this repo and submit a pull request.

Some documents that can help you, in this regard:

1. [How to write a task for VS Team Services Build/Release task](https://github.com/Microsoft/vso-agent-tasks#writing-tasks)
2. [How to create and publish an extension](https://www.visualstudio.com/en-us/integrate/extensions/publish/overview)
3. [Learn about installing npm](https://www.npmjs.com/package/npm)
4. [How to install tfx-cli tool](https://github.com/Microsoft/tfs-cli), required to create and publish extensions