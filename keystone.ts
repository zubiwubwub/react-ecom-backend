import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import { User } from './schemas/User';
import { CartItem } from './schemas/CartItem';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';
import { insertSeedData } from './seed-data';
import { sendPasswirdResetEmail } from './lib/mail';
import { extendGraphqlSchema } from './mutations';

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sickfits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long should user stay signed in
  secret: process.env.COOKIE_SECRET || 'secret',
};

const { withAuth } = createAuth(
  {
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
      fields: ['name', 'email', 'password'],
      //TODO Add initial roles
    },
    passwordResetLink: {
      async sendToken(args) {
        // Send an email
        await sendPasswirdResetEmail(args.token, args.identity);
      }
    }
  }
);

export default withAuth(config({
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: 'mongoose',
    url: databaseURL,
    async onConnect(keystone) {
      console.log('Connected to the database!');
      if (process.argv.includes('--seed-data')) {
        await insertSeedData(keystone);
      }
    },
  },
  lists: createSchema({
    // Schema items go in here
    User,
    Product,
    ProductImage,
    CartItem,
    OrderItem,
    Order,
  }),
  extendGraphqlSchema,
  ui: {
    // Change this for roles // Show the UI only for people who pass this test
    isAccessAllowed: ({ session }) => {
      return session?.data;
    },
  },
  session: withItemData(statelessSessions(sessionConfig), {
    User: `id`
  })
}
));
