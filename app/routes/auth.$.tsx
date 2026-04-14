import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { redirect } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("Auth loader triggered");
  const { session } = await authenticate.admin(request);

  if (session) {
    console.log("Saving shop:", session.shop);
    
  }
  // if (session?.shop && session?.accessToken) {
  //   await prisma.shop.upsert({
  //     where: { shop_domain: session.shop },
  //     update: { access_token: session.accessToken },
  //     create: {
  //       shop_domain: session.shop,
  //       access_token: session.accessToken,
  //     },
  //   });
  // }
  console.log("LOG: [AUTH ROUTE] Saving shop:", session.shop);

  return null;
};

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};