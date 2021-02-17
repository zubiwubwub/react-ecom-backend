import { KeystoneContext } from '@keystone-next/types'


export default function addToCart(
  root: any,
  {productID}: {productId: string},
  context: KeystoneContext
) {
  console.log("Adding to cart")
}