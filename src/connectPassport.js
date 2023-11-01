import { config, passport  } from '@imtbl/sdk';

const passportInstance = new passport.Passport({
  baseConfig: new config.ImmutableConfiguration({
    environment: config.Environment.SANDBOX,
  }),
  clientId: 'WlFccmztt17F7udM86YrNWX6WBDJOVi9',
  redirectUri: 'https://chel-chainmatchgame.netlify.app//logging',
  logoutRedirectUri: 'https://chel-chainmatchgame.netlify.app/logout',
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
});

export default passportInstance;