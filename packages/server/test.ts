import { Client } from '@rouby/eventing';
import * as dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import { createServer } from 'http';
import { URL } from 'url';
import { UsersInterface } from './src/read/Users';
import { UserInterface } from './src/write/User';

dotenv.config({ path: __dirname + '/.env' });

const authClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

const client = new Client<{ Users: UsersInterface }, { User: UserInterface }>(
  'ws://localhost:4000',
);

async function go() {
  client.start();

  try {
    await auth();

    // await client.aggregates
    //   .User()
    //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //   .signUp('Rouby', 'goto@hell.com');

    // await client.aggregates.User().signIn(idToken);

    const users = await client.lists.Users.find({ where: { name: 'Rouby' } });
    console.log('Users:', users);
  } catch (err) {
    console.log('command failed', err);
  }

  client.close();
}

async function auth() {
  const authUrl = authClient.generateAuthUrl({
    // eslint-disable-next-line @typescript-eslint/camelcase
    redirect_uri: 'http://localhost:3001',
    scope: ['profile'],
  });
  console.log(authUrl);

  const idToken = await new Promise<string>((resolve, reject) => {
    const server = createServer(async (req, res) => {
      const code = new URL(
        req.url || '',
        'http://localhost:3001',
      ).searchParams.get('code');
      res.end('Authentication successful! Please return to the console.');
      server.close();

      try {
        const {
          tokens: { id_token: idToken },
        } = await authClient.getToken({
          code: decodeURIComponent(code || ''),
          // eslint-disable-next-line @typescript-eslint/camelcase
          redirect_uri: 'http://localhost:3001',
        });
        // eslint-disable-next-line @typescript-eslint/camelcase
        resolve(idToken || '');
      } catch (err) {
        reject(err);
      }
    }).listen(3001);
  });

  await client.setUserToken(idToken);
}

go();
