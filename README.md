# Kuruyo Server
Kuruyo is a little app that lets you know when your bus is coming.
This is the server which tracks bus data and sends notifications to the client.


## Instructions

### Setup (Mac)
1. $ brew install node
2. $ npm install
3. Create a apn-config.ts file in the root directory with the following:
```typescript
export const APNCONFIG = {
  keyPath: "./AuthKey_#######.p8",
  keyId: "YOUR_KEY_ID",
  teamId: "YOUR_TEAM_ID"
}
```
4. Include your .p8 in your root directory.

### Running tests
1. $ npm test

### Running server
1. $ npm run build
2. $ npm start

You can also run the server without building.
This requires the ts-node dev dependency.

1. $ npm run ts-server
