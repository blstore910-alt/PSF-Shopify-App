import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData } from "react-router";

import { login } from "../../shopify.server";

import styles from "./styles.module.css";
import prisma from "../../db.server";

// export const loader = async () => {
//   return redirect("https://primescalefulfillment.com", {
//     status: 301, 
//   });
// };

// export default function App() {
//   return null;
// }

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
    <div style={{
      backgroundColor: '#050608', 
      color: '#fff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Inter, sans-serif',
      padding: '20px'
    }}>
      <nav style={{
      width: '100%',
      maxWidth: '1200px',
      padding: '24px 40px',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          padding: '8px',
          borderRadius: '8px'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"></path>
            <path d="M3 8l9 5 9-5"></path>
            <line x1="12" y1="13" x2="12" y2="21"></line>
            <polyline points="9 11.5 12 13 15 11.5"></polyline>
          </svg>
        </div>
        <span style={{ fontWeight: '700', fontSize: '18px', letterSpacing: '-0.5px' }}>
          Prime Scale Fulfillment
        </span>
      </div>
    </nav>

      <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      maxWidth: '700px', 
      padding: '0 20px',
      marginTop: '-60px' // Pulls content slightly up for better visual balance
    }}>
      
      <div style={{
        display: 'inline-block',
        width: 'fit-content',
        padding: '6px 12px',
        borderRadius: '20px',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        color: '#10B981',
        fontSize: '14px',
        marginBottom: '24px'
      }}>
        ● For brands shipping 20+ orders/day
      </div>

        <h1 style={{ 
          fontSize: '64px', 
          fontWeight: '800', 
          lineHeight: '1.1',
          marginBottom: '24px' 
        }}>
          Fulfillment built <br/> 
          for <span style={{ color: '#10B981' }}>serious DTC brands.</span>
        </h1>

        <p style={{ 
          fontSize: '18px', 
          color: '#9ca3af', 
          lineHeight: '1.6',
          marginBottom: '40px' 
        }}>
          We pick, pack, and ship your <strong>Shopify</strong> orders out of Shenzhen and Ningbo with 
          <span style={{color: '#fff'}}> QC on every order</span>.
        </p>

        {showForm && (
          <Form method="post" action="/auth/login" style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
            <input 
              type="text" 
              name="shop" 
              placeholder="your-store.myshopify.com" 
              style={{
                flex: 1,
                padding: '16px 20px',
                borderRadius: '8px',
                border: '1px solid #374151',
                backgroundColor: '#111827',
                color: '#fff',
                fontSize: '16px'
              }}
            />
            <button type="submit" style={{
              backgroundColor: '#10B981',
              color: '#000',
              padding: '16px 32px',
              borderRadius: '8px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              Connect Store
            </button>
          </Form>
        )}

        <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#6b7280' }}>
          <span>✔ No setup fees</span>
          <span>✔ QC on every order</span>
          <span>✔ Live in 24h</span>
          <span>✔ Cancel Anytime</span>
        </div>
      </div>
    </div>
  );
}
