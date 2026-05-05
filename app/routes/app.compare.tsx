import { useState } from "react";
import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { ComparePageShippingmethods as comparisonData } from "../config";
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

const psfFeatures = [
  "Quality control on every shipment before it leaves",
  "Full tracking from warehouse to customer door",
  "Dedicated account manager ",
  "Worldwide delivery — USA, EU, UK, AU and more",
];

export default function AppCompare() {
  const [whatsappHovered, setWhatsappHovered] = useState(false);
  const [sourcingHovered, setSourcingHovered] = useState(false);

  const [btnHovered, setBtnHovered] = useState(false);
  const getCellColor = (type: string) => {
    if (type === "bad") return { bg: "#FFF1F2", text: "#E11D48" };
    if (type === "mid") return { bg: "#FFFBEB", text: "#D97706" };
    return { bg: "#F0FDF4", text: "#16A34A" };
  };

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
        Shipping speed comparison
      </div>
      <div style={{ color: "#6B7280", marginBottom: "11px", fontSize: "13px" }}>
        Typical delivery times from China to your customers
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          fontSize: "12px",
          textAlign: "center",
          borderRadius: "9px",
          overflow: "hidden",
        }}
      >
        <tr
          style={{
            background: "#1E293B",
            color: "#ffffff",
          }}
        >
          <th
            style={{
              padding: "7px 8px",
              textAlign: "left",
              fontWeight: "600",
            }}
          >
            Method
          </th>
          <th style={{ padding: "12px 4px" }}>USA</th>
          <th style={{ padding: "12px 4px" }}>Europe</th>
          <th style={{ padding: "12px 4px" }}>UK</th>
        </tr>

        {comparisonData.map((row) => {
          const colors = getCellColor(row.type);
          return (
            <tr key={row.method} style={{ borderBottom: "1px solid #F1F5F9" }}>
              <td
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  fontWeight: row.type === "good" ? "700" : "500",
                  color: row.type === "good" ? "#16A34A" : "#1E293B",
                }}
              >
                {row.method}
              </td>

              {[row.usa, row.europe, row.uk].map((time, i) => (
                <td key={i} style={{ padding: "8px 4px" }}>
                  <div
                    style={{
                      background: colors.bg,
                      color: colors.text,
                      padding: "4px 2px",
                      borderRadius: "6px",
                      fontWeight: "700",
                    }}
                  >
                    {time}
                  </div>
                </td>
              ))}
            </tr>
          );
        })}
      </table>

      <p
        style={{
          fontSize: "11px",
          color: "#94A3B8",
          fontStyle: "italic",
          marginBottom: "24px",
          lineHeight: "1.4",
        }}
      >
        Typical times based on publicly available data. Actual times may vary by destination.
      </p>

      <div style={{ borderTop: "1px solid #F3F4F6", margin: "12px 0" }}></div>

      <div style={{ marginBottom: "14px" }}>
        <div
          style={{
            fontSize: "15px",
            fontWeight: "800",
            marginBottom: "5px",
            color: "#1E293B",
          }}
        >
          What's included with PSF
        </div>

        {psfFeatures.map((feature, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "7px",
              alignItems: "flex-start",
            }}
          >
            <span style={{ color: "#22C55E", fontWeight: "bold" }}>✓</span>
            <span
              style={{ fontSize: "13px", color: "#475569", lineHeight: "1.4" }}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>

      <a
        style={{ textDecoration: "none" }}
        href="https://wa.me/31853332376?text=Hi%2C%20I%27d%20like%20to%20switch%20to%20PSF%20fulfillment"
        target="_blank"
        rel="noreferrer"
      >
        <button
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "16px",
            background: btnHovered ? "#16a34a" : "#22c55e",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
            fontWeight: "700",
            fontSize: "15px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            transform: btnHovered ? "scale(0.98)" : "scale(1)",
          }}
        >
          <WhatsAppIcon color="#fff" />
          Get a quote on WhatsApp
        </button>
      </a>
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
