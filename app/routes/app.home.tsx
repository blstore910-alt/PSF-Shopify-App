import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { HomePageDeliverySpeed as shippingMethods } from "../config";
import { Link, useLoaderData, type ActionFunctionArgs, redirect} from "react-router";
import db from "../db.server";

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
// const CACHE_DURATION = 0;

// Helper: Get date string (YYYY-MM-DD)
function getDateString(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
}

// Helper: Fetch all pages with pagination
async function fetchAllOrders(admin: any, dateFilter: string) {

  let allOrders: any[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const afterClause: string = cursor ? `, after: "${cursor}"` : "";

    // The core GraphQL query as requested
    const response = await admin.graphql(`
    #graphql
      query {
        orders(first: 250${afterClause}, query: "fulfillment_status:fulfilled created_at:>='${dateFilter}'") {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              fulfillments(first: 5) {
                trackingInfo {
                  number
                }
              }
            }
          }
        }
      }
    `);

    const json = await response.json();
    const data = json.data;

    if (!data?.orders) break;
    const orders = data.orders.edges.map((e: any) => e.node);
    allOrders = [...allOrders, ...orders];

    hasNextPage = data.orders.pageInfo.hasNextPage;
    cursor = data.orders.pageInfo.endCursor;

    if (allOrders.length >= 2500) break;
  }

  return allOrders;
}

// Helper: Count tracking numbers
function countTrackingNumbers(orders: any[]): number {
  return orders.reduce((count, order) => {
    const hasTracking = order.fulfillments?.some(
      (f: any) => f.trackingInfo && f.trackingInfo.length > 0 && f.trackingInfo[0].number
    );
    return count + (hasTracking ? 1 : 0);
  }, 0);
}

// Cache storage
const cache = new Map<string, { count: number; timestamp: number }>();

async function getOrdersCount(admin: any, dateFilter: string, shop: string): Promise<number> {
  const cacheKey = `${shop}_orders_${dateFilter}`;

  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.count;
    }
  }

  try {
    const orders = await fetchAllOrders(admin, dateFilter);
    const count = countTrackingNumbers(orders);

    cache.set(cacheKey, { count, timestamp: Date.now() });
    return count;
  } catch (error) {
    console.error(`Error fetching orders for ${dateFilter}:`, error);
    return cache.get(cacheKey)?.count || 0;
  }
}

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

  const shopData = await db.shop.findUnique({
    where: { shop_domain: session.shop },
    select: { install_date: true },
  });

  const installDate = shopData?.install_date
  ? shopData.install_date.toISOString().split("T")[0]
  : null;

  const [sinceInstallCount, last30DaysCount] = await Promise.all([
    installDate ? getOrdersCount(admin, installDate,shop) : Promise.resolve(0), 
    getOrdersCount(admin, getDateString(30),shop),
  ]);

  return { sinceInstallCount, last30DaysCount };
};

const features = [
  "Shenzhen & Ningbo warehouses — worldwide shipping",
  "Quality control on every shipment before dispatch",
  "Dedicated account manager ",
  "Worldwide delivery — USA, EU, UK, AU and more",
];

export default function AppHome() {
  const { sinceInstallCount, last30DaysCount } = useLoaderData<typeof loader>();
  const [whatsappHovered, setWhatsappHovered] = useState(false);
  const [sourcingHovered, setSourcingHovered] = useState(false);

  const stats = [
    {
      label: "Orders shipped by PSF",
      value: sinceInstallCount.toString(),
      badge: "Since you joined",
      badgeColor: "#1D4ED8",
      badgeBg: "#e8f0fe",
    },
    {
      label: "Orders with tracking",
      value: last30DaysCount.toString(),
      badge: "Last 30 days",
      badgeColor: "#059669",
      badgeBg: "#e6f7f1",
    },
  ];

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        maxWidth: "420px",
        padding: "16px",
        margin: "0 auto",
        boxSizing: "border-box",
        borderTop: "none",
        borderRadius: "0 0 15px 15px",
        background: "#ffffff",
      }}
    >
      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 14,
          background: "#F9FAFB",
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "16px 14px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid #e8ecf0",
            }}
          >
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 12,
                color: "#6B7280",
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 25,
                fontWeight: 700,
                color: stat.badgeColor,
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </p>
            <span
              style={{
                display: "inline-block",
                fontSize: 12,
                fontWeight: 600,
                color: stat.badgeColor,
                background: stat.badgeBg,
                borderRadius: 20,
                padding: "3px 9px",
              }}
            >
              {stat.badge}
            </span>
          </div>
        ))}
      </div>

      {/* Delivery Speed Card */}
      <div
        style={{
          background: "#F9FAFB",
          borderRadius: 16,
          padding: "14px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #e8ecf0",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 16 }}>⚡</span>
          <span
            style={{
              fontWeight: 700,
              fontSize: 13.5,
              color: "#059669",
              letterSpacing: "-0.2px",
            }}
          >
            Delivery speed — China to your customers
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {shippingMethods.map((method: any) => (
            <div key={method.name}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: method.textColor,
                  }}
                >
                  {method.name}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: method.textColor,
                  }}
                >
                  {method.range}
                </span>
              </div>
              <div
                style={{
                  background: "#f1f5f9",
                  borderRadius: 999,
                  height: 8,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: method.width,
                    height: "100%",
                    background: method.color,
                    borderRadius: 999,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            margin: "14px 0 0",
            fontSize: 11,
            color: "#94a3b8",
            fontStyle: "italic",
          }}
        >
          Typical times based on publicly available data.
        </p>
      </div>

      {/* Features List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: "14px",
        }}
      >
        {features.map((feature) => (
          <div
            key={feature}
            style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
          >
            <span
              style={{
                color: "#22c55e",
                fontWeight: 800,
                fontSize: 15,
                lineHeight: 1.4,
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid #F3F4F6", margin: "12px 0" }}></div>

      {/* CTA Section */}
      <div>
        <p
          style={{
            margin: "0 0 4px",
            fontWeight: 800,
            fontSize: 14,
            color: "#0f172a",
            letterSpacing: "-0.3px",
          }}
        >
          Ready to get started?
        </p>
        <p
          style={{
            margin: "0 0 16px",
            fontSize: 13,
            color: "#6B7280",
            lineHeight: 1.5,
          }}
        >
          Send us a product link on WhatsApp. We'll quote it and walk you through next steps.
        </p>

        <a
          style={{ textDecoration: "none" }}
          href="https://wa.me/31853332376?text=Hi%2C%20I%27d%20like%20a%20free%20quote"
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
              padding: "15px",
              background: whatsappHovered ? "#16a34a" : "#22c55e",
              border: "none",
              borderRadius: 12,
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              marginBottom: 10,
              transition: "background 0.18s ease, transform 0.12s ease",
              transform: whatsappHovered ? "scale(0.99)" : "scale(1)",
              letterSpacing: "-0.2px",
            }}
          >
            <WhatsAppIcon />
            Get a quote on WhatsApp
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
              borderRadius: 12,
              color: "#16a34a",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              transition: "background 0.18s ease",
              letterSpacing: "-0.2px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" style={{fill:'#16A34A'}}><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
            Source a product
          </button>
        </Link>
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
