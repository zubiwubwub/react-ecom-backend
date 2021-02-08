import 'dotenv/config';
import { User } from './schemas/User';
import { config, createSchema } from '@keystone-next/keystone/schema';

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sickfits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long should user stay signed in
  secret: process.env.COOKIE_SECRET,
};

export default config({
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: 'mongoose',
    url: databaseURL,
    // TODO: Add data seeding here
  },
  lists: createSchema({
    // Schema items go in here
    User
  }),
  ui: {
    // Change this for roles
    isAccessAllowed: () => true,
  },
  // Add Session values here
});
