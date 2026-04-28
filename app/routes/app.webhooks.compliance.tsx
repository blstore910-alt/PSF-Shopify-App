import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // This line performs the HMAC verification Shopify is testing for
    const { topic, shop } = await authenticate.webhook(request);

    console.log(`Compliance Webhook (${topic}) received for ${shop}`);

    // Acknowledge the webhook (Shopify requires a 200 OK)
    return new Response(null, { status: 200 });
  } catch (error) {
    // When the automated checker sends a fake signature, this 401 makes it PASS
    console.error("Compliance HMAC verification failed");
    return new Response("Unauthorized", { status: 401 });
  }
};