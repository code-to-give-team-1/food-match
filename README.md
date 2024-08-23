# food-match

## Setup

1. Clone the repository
2. `source ./setup.sh` and install any missing dependencies.
3. docker-compose up

We use nvm to manage node version and ensure that the team is using the same version of node.
We use corepack with pnpm to manage our package manager and dependencies.
We use venv for python virtual environment and freeze the dependencies into requirements.txt
I don't see a need to install specific version of python for development. if there are any issues among the team we can set up `pyenv`

For local development you can comment out the nextjs and ml service in the docker-compose.yml file and run them locally.
