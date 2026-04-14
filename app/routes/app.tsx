import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useRouteError ,Link} from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider  } from "@shopify/shopify-app-react-router/react";

import { authenticate } from "../shopify.server";
import { CustomNavbar } from "app/components/CustomNavbar";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  if (session?.shop && session?.accessToken) {
    console.log("Saving/Updating shop data for:", session.shop);
    await prisma.shop.upsert({
      where: { shop_domain: session.shop },
      update: { access_token: session.accessToken },
      create: {
        shop_domain: session.shop,
        access_token: session.accessToken,
      },
    });
  }
  console.log("LOG: [APP LAYOUT] Saving shop:", session.shop);

  return { apiKey: process.env.SHOPIFY_API_KEY || "" };

};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider embedded apiKey={apiKey}>
      {/* <s-app-nav>
        <s-link href="/app">Home</s-link>
        <s-link href="/app/additional">Additional page</s-link>
      </s-app-nav> */} 
      <CustomNavbar/>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
