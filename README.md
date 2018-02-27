# Kuruyo Server
Kuruyo is a little app that lets you know when your bus is coming.
This is the server which tracks bus data and sends notifications to the client.


## Instructions

### Setup (Mac)
1. Make sure Node & NPM are installed, and use npm to install the correct packages.
```
$ brew install node
$ npm install
```
2. Create a apn-config.ts file in the root directory with the following:

```typescript
export const APNCONFIG = {
  keyPath: "./AuthKey_#######.p8",
  keyId: "YOUR_KEY_ID",
  teamId: "YOUR_TEAM_ID"
}
```
4. Include your .p8 in your root directory.

### Running tests

```
$ npm test
```

### Running server

```
$ npm run build
$ npm start
```

You can also run the server without building.
This requires the ts-node dev dependency.

```
$ npm run ts-server
```

### Deploying to Pivotal Web Services
This server has a manifest.yml setup for Cloud Foundry and can be hosted on Pivotal Web Services.

1. Build the app (since only the compiled js will be run), make sure your logged in, and push it up.
```
$ npm run build
$ cf login -a https://api.run.pivotal.io
$ cf push
```
