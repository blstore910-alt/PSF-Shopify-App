import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { Link } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        maxWidth: "420px",
        padding: "16px",
        margin: "0 auto",
        boxSizing: "border-box",
        borderRadius: "0 0 15px 15px",
        background: "#ffffff",
        textAlign: "center",
      }}
    >
      {/* Check icon */}
      <div style={{ padding: "10px 0 16px" }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "#DCFCE7",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 10px",
          }}
        >
          <svg
            style={{ width: "30px", height: "30px" }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16A34A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#111",
            margin: "0 0 0.5rem",
          }}
        >
          Welcome to Prime Scale
        </h1>
        <p
          style={{
            fontSize: 12,
            color: "#6B7280",
            lineHeight: 1.6,
          }}
        >
          Your China fulfillment partner — Shenzhen &amp; Ningbo warehouses
        </p>
      </div>

      {/* Action cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginBottom: "1.25rem",
        }}
      >
        <Link
          to="/app/orders"
          style={{
            background: "#F0FDF4",
            border: "1.5px solid #BBF7D0",
            borderRadius: 12,
            padding: "14px 8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <div style={{ fontSize: "20px", marginBottom: "4px" }}>📦</div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#16a34a" }}>Track orders</span>
        </Link>

        <Link
          to="/app/compare"
          style={{
            background: "#EFF6FF",
            border: "1.5px solid #BFDBFE",
            borderRadius: 12,
            padding: "14px 8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <div style={{ fontSize: "20px", marginBottom: "4px" }}>⚡</div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#1E40AF" }}>Compare speeds</span>
        </Link>

        <Link
          to="/app/source"
          style={{
            background: "#FFF7ED",
            border: "1.5px solid #FED7AA",
            borderRadius: 12,
            padding: "14px 8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <div style={{ fontSize: "20px", marginBottom: "4px" }}>💬</div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#C2410C" }}>Get a quote</span>
        </Link>
      </div>

      {/* WhatsApp button */}
      
      <a href="https://wa.me/31853332376"
        target="_blank"
        rel="noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: "#25d366",
          borderRadius: 12,
          padding: "14px",
          textDecoration: "none",
          marginBottom: "0.75rem",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
        <span style={{ color: "white", fontWeight: 600, fontSize: 15 }}>
          Message us on WhatsApp
        </span>
      </a>

      {/* Subtext */}
      <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 1.5rem" }}>
        Tracking · Quality control · Dedicated account manager
      </p>

      <div style={{ borderTop: "1px solid #F3F4F6", margin: "12px 0" }}></div>

      {/* Explore link */}
      <Link
        to="/app/home"
        style={{
          color: "#6B7280",
          fontSize: 13,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          textDecoration: "none",
        }}
      >
        Explore the app first <span>{"\u2192"}</span>
      </Link>
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};