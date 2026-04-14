import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";


export const action = async ({ request }: ActionFunctionArgs) => {
    const { payload, session, topic, shop } = await authenticate.webhook(request);
    console.log(`Received ${topic} webhook for ${shop}`);

    const current = payload.current as string[];
    if (session) {
        await db.session.update({   
            where: {
                id: session.id
            },
            data: {
                scope: current.toString(),
            },
        });

        const accessToken = payload.accessToken; // Check payload structure
        await db.shop.upsert({
            where: { shop_domain: shop },
            update: { 
                access_token: accessToken
            },
            create: { 
                shop_domain: shop, 
                access_token: accessToken
            },
        });
    }
    return new Response();
};
