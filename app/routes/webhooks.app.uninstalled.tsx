import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { shop, session, topic } = await authenticate.webhook(request);

    console.log(`Received ${topic} webhook for ${shop}`);

    if (session) {
      await db.session.deleteMany({ where: { shop } });
    }

    // 2. ALWAYS delete the shop data (Moved OUTSIDE the session check)
    // This ensures data is wiped even if the session is already gone.
    await db.shop.deleteMany({ where: { shop_domain: shop } });

    return new Response(null, { status: 200 });

  } catch (error) {
    // This part is MANDATORY to pass the Shopify App Store check
    console.error("HMAC verification failed");
    return new Response("Unauthorized", { status: 401 });
  }
};