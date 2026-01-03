# Attakk Store Backend

## Introduction

Attakk Store Backend is a lightweight internal REST API for managing orders and statistics for a temporary e-commerce campaign. Built with Node.js, Express, and SQLite for simplicity and performance.

The Idea is to use it until we have Stripe up and running.

## Installation

To set up the project locally, follow these steps:

1. Install dependencies:

   ```bash
   nvm install
   npm install
   ```

1. Start the development server:

   ```bash
   npm run dev
   ```

## Usage

- **Development**: Use `npm run dev` to start the development server with hot reload.
- **Build**: Use `npm run build` to compile TypeScript.
- **Production**: Use `npm start` to start the production server.
- **Testing**: Use `npm run test` to run all tests.
- **Type Checking**: Use `npm run typecheck` to run TypeScript type checking.
- **Linting**: Use `npm run lint` to check code quality, or `npm run lint:fix` to auto-fix issues.
- **Formatting**: Use `npm run format` to check formatting, or `npm run format:fix` to auto-format.

## Docker

To run the project using Docker:

1. Build the Docker image:

   ```bash
   docker build -t attakk-store-backend .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 3000:3000 attakk-store-backend
   ```

The API will be accessible at `http://localhost:3000`.

## Deployment

Deployed using Dokku on the same host as the frontend. The API is only accessible internally via Docker networking.

### Initial Setup Dokku

On Dokku Host:

```bash
dokku apps:create attakk-store-backend
# No external ports or domains - internal access only via Docker network
dokku docker-options:add attakk-store-backend deploy "--network dokku"
```

**Internal Access**: The frontend accesses this API via `http://attakk-store-backend.web:3000` on the Docker network.

On Local Machine:

```bash
git remote add dokku dokku@atk-collective.ch:attakk-store-backend
```

### Deployment

#### Automatic Deployment (GitHub Actions)

Pushing to the `main` branch automatically deploys to Dokku via GitHub Actions.

**Setup:**

1. Generate SSH key on the Dokku server:

   ```bash
   ssh-keygen -t ed25519 -f dokku_github_actions
   ```

2. Add public key to authorized_keys:

   ```bash
   cat dokku_github_actions.pub >> ~/.ssh/authorized_keys
   ```

3. Add public key to Dokku:

   ```bash
   cat dokku_github_actions.pub | sudo dokku ssh-keys:add github_actions
   dokku ssh-keys:list
   ```

4. Add private key to GitHub repository secrets as `SSH_PRIVATE_KEY`:
   - Go to repository Settings → Secrets and variables → Actions
   - Add new repository secret named `SSH_PRIVATE_KEY`
   - Paste contents of `dokku_github_actions` (private key)

#### Manual Deployment

```bash
git push dokku main
```

Make sure you have your ssh config set up correctly to allow access to the Dokku host. (Use IP address of server as Hostname in your SSH config.)

```
Host atk-collective.ch
    HostName 83.228.205.168
    User ubuntu
    IdentityFile ~/.ssh/...
```

Test:

```bash
ssh atk-collective.ch
```
