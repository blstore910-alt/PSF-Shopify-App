import { useState } from "react";
import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { Link } from "react-router";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop; 

  try {
    await db.shop.updateMany({
      where: { 
        shop_domain: shop,
        onboarding_seen: false 
      },
      data: { onboarding_seen: true },
    });
    console.log("DB Update Success for:", shop);
  } catch (e) {
    console.error("DB Update Failed:", e);
  }
  return null;
};

function InfoRow({
  label,
  value,
  valueColor = "#1E293B",
  isLast = false,
}: {
  label: string;
  value: string;
  valueColor?: string;
  isLast?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: isLast ? "none" : "1px solid #F1F5F9",
      }}
    >
      <span style={{ fontSize: "13px", color: "#6B7280", fontWeight: "400" }}>
        {label}
      </span>
      <span style={{ fontSize: "13px", fontWeight: "700", color: valueColor }}>
        {value}
      </span>
    </div>
  );
}
const styles = {
  supportCard: {
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    marginBottom: "12px",
    overflow: "hidden",
  },

  supportRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    borderBottom: "1px solid #F3F4F6",
  },

  supportIcon: {
    width: "32px",
    height: "32px",
    flexShrink: 0,
    background: "white",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    display: "grid",
    placeItems: "center",
    fontSize: "15px",
  },

  supportContent: {
    flex: 1,
    minWidth: 0,
  },

  supportKey: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: ".04em",
    marginBottom: "2px",
  },

  supportVal: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#111827",
    lineHeight: "1.35",
    wordBreak: "break-word",
  },
};

export default function AppSupport() {
  const [whatsappHovered, setWhatsappHovered] = useState(false);
  const [sourcingHovered, setSourcingHovered] = useState(false);
  const [reviewHovered, setReviewHovered] = useState(false);

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        // minHeight: "100vh",
        maxWidth: "420px",
        padding: "16px",
        margin: "0 auto",
        boxSizing: "border-box",
        background: "#ffffff",
        borderRadius: "0 0 15px 15px",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "5px" }}>
        Support & contact
      </div>
      <div
        style={{
          color: "#6B7280",
          marginBottom: "11px",
          fontSize: "13px",
          lineHeight: "1.5",
        }}
      >
        Reach your fulfillment team for order questions, sourcing requests, or
        anything related to your shipments.
      </div>

      <div style={styles.supportCard}>
        <div style={styles.supportRow}>
          <div style={styles.supportIcon}>💬</div>
          <div style={styles.supportContent}>
            <div style={styles.supportKey}>Channels</div>
            <div style={styles.supportVal}>WhatsApp · Telegram · Phone</div>
          </div>
        </div>
        <div style={styles.supportRow}>
          <div style={styles.supportIcon}>🌍</div>
          <div style={styles.supportContent}>
            <div style={styles.supportKey}>Languages</div>
            <div style={styles.supportVal}>EN · NL · + any language</div>
          </div>
        </div>
        <div style={styles.supportRow}>
          <div style={styles.supportIcon}>🕐</div>
          <div style={styles.supportContent}>
            <div style={styles.supportKey}>Support hours</div>
            <div style={styles.supportVal}>Mon–Sat, 08:00–22:00</div>
          </div>
        </div>
        <div style={styles.supportRow}>
          <div style={styles.supportIcon}>📦</div>
          <div style={styles.supportContent}>
            <div style={styles.supportKey}>Coverage</div>
            <div style={styles.supportVal}>USA · EU · UK · AU and more</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <a
          style={{ textDecoration: "none" }}
          href="https://wa.me/31853332376?text=Hi%2C%20I%20need%20help%20with%20my%20fulfillment%20account"
          target="_blank"
          rel="noreferrer"
        >
          <button
            onMouseEnter={() => setWhatsappHovered(true)}
            onMouseLeave={() => setWhatsappHovered(false)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "14px",
              background: whatsappHovered ? "#16a34a" : "#22c55e",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <WhatsAppIcon color="#fff" />
            Open WhatsApp support
          </button>
        </a>

        <Link to={'/app/source'} style={{textDecoration:'none',color:'inherit'}}>
          <button
            onMouseEnter={() => setSourcingHovered(true)}
            onMouseLeave={() => setSourcingHovered(false)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "14px",
              background: sourcingHovered ? "#f0fdf4" : "#fff",
              border: "2px solid #22c55e",
              borderRadius: "10px",
              color: "#16a34a",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" style={{fill:'#16A34A'}}><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
            Source a product
          </button>
        </Link>

        <div
          style={{
            background: "#F0F7FF",
            borderRadius: "10px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            border: "1px solid #E0E7FF",
          }}
        >
          <div
            style={{
              background: "#2563EB",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              style={{ width: "17px", height: "17px", fill: "white" }}
              viewBox="0 0 24 24"
            >
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"></path>
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{ fontSize: "16px", fontWeight: "800", color: "#1E40AF" }}
            >
              +31 6 21 91 79 32
            </div>
            <div style={{ fontSize: "11px", color: "#60A5FA" }}>
              No WhatsApp? Call or message on Telegram 
            </div>
          </div>
        </div>

        <div>
                   
          <div
            style={{
              textAlign: "center",
              fontSize: "11px",
              color: "#9CA3AF",
            }}
          >
            primescalefulfillment.com
          </div>
        </div>
      </div>
    </div>
  );
}

function WhatsAppIcon({ color = "#fff" }: { color?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
