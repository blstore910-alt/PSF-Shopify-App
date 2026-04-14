import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData } from "react-router";

import { login } from "../../shopify.server";

import styles from "./styles.module.css";
import prisma from "../../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  // If shop param exists, check onboarding status
  if (shop) {
    try {
      const shopData = await prisma.shop.findUnique({
        where: { shop_domain: shop },
      });

      // If shop exists AND onboarding is complete, redirect to home
      if (shopData && shopData.onboarding_seen === true) {
        throw redirect(`/app/home?${url.searchParams.toString()}`);
      }

      // If shop exists but onboarding not complete, or shop doesn't exist, go to app
      throw redirect(`/app?${url.searchParams.toString()}`);
    } catch (error) {
      // If it's a redirect, re-throw it
      if (error instanceof Response) {
        throw error;
      }
      // Log other errors but don't block login
      console.error(`Error checking shop data for ${shop}:`, error);
    }
  }

  // No shop param, show login form
  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>A short heading about [your app]</h1>
        <p className={styles.text}>
          A tagline about [your app] that describes your value proposition.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>
              <input className={styles.input} type="text" name="shop" />
              <span>e.g: my-shop-domain.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Log in
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>
            <strong>Product feature</strong>. Some detail about your feature and
            its benefit to your customer.
          </li>
          <li>
            <strong>Product feature</strong>. Some detail about your feature and
            its benefit to your customer.
          </li>
          <li>
            <strong>Product feature</strong>. Some detail about your feature and
            its benefit to your customer.
          </li>
        </ul>
      </div>
    </div>
  );
}
