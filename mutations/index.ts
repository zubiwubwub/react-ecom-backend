import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';

// make fake graphql taggrd template literal
export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: `
    type Mutation {
      addToCart(productID: ID): CartItem
    }
  `,
  resolvers: {
    Mutation: {
      addToCart() {
        console.log('Add to cart');
      },
    }
  }
});
