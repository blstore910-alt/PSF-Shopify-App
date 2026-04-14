import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { Link, useLoaderData } from "react-router";

function getDateString(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const thirtyDaysAgo = getDateString(30);

  const response = await admin.graphql(`
    #graphql
    query {
      orders(
        first: 50, 
        sortKey: CREATED_AT, 
        reverse: true, 
        query: "fulfillment_status:fulfilled created_at:>='${thirtyDaysAgo}'"
      ) {
        edges {
          node {
            name
            createdAt
            fulfillments(first: 5) {
              id
              trackingInfo {
                number
                url
                company
              }
              displayStatus
            }
            shippingAddress {
              country
            }
          }
        }
      }
    }
  `);


  const data = await response.json();
  return { orders: data.data?.orders?.edges || [] };
};

interface Shipment {
  id: string;
  orderName: string;
  trackingNumber: string;
  carrier: string;
  destination: string;
  status: "FULFILLED" | "IN_PROGRESS" | "ON_HOLD" | "CANCELLED";
  createdAt: string;
  trackingUrl?: string;
}

const styles = {
  container: {
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    // minHeight: "100vh",
    maxWidth: "420px",
    padding: "16px",
    margin: "0 auto",
    boxSizing: "border-box" as const,
    backgroundColor: "#fafbfc",
    borderRadius:'0 0 15px 15px',
  },
  header: {
    marginBottom: 24,
    display: "flex" as const,
    gap: 16,
    alignItems: "center" as const,
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 16,
  },
  nav: {
    display: "flex" as const,
    gap: 24,
    flex: 1,
  },
  navLink: (isActive: boolean) => ({
    color: isActive ? "#056f1e" : "#6b7280",
    fontSize: 14,
    fontWeight: isActive ? 600 : 500,
    display: "inline-flex" as const,
    alignItems: "center" as const,
    gap: 6,
    textDecoration: isActive ? "underline" : "none",
    textDecorationColor: "#056f1e",
    cursor: "pointer" as const,
    transition: "all 0.2s ease",
  }),
  pageTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  statsContainer: {
    display: "grid" as const,
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 20,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s ease",
  },
  statCardHover: {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
  },
  shipmentCard: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: '10px 12px',
    marginBottom: 10,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s ease",
  },
  shipmentCardHover: {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    borderColor: "#d1d5db",
  },
  cardHeader: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: "1px solid #E5E7EB",
  },
  shipmentId: {
    fontSize: 14,
    fontWeight: 700,
    color: "#111827",
  },
  date: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: 500,
  },
  cardGrid: {
    display: "grid" as const,
    gridTemplateColumns: "repeat(2, 1fr)" as const,
    gap: 20,
  },
  field: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: 700,
    color: "#9CA3AF",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 12,
    fontWeight: 600,
    color: "#111827",
  },
  trackingLink: {
    color: "#1D4ED8",
    // textDecoration: "none",
    fontWeight: 600,
    fontSize: 13,
    transition: "all 0.2s ease",
    cursor: "pointer",
  },
  trackingLinkHover: {
    textDecoration: "underline",
    color: "#1d4ed8",
  },
  statusBadge: (status: string) => ({
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: getStatusColor(status).bg,
    color: getStatusColor(status).text,
    width: "fit-content",
  }),
  emptyState: {
    textAlign: "center" as const,
    padding: 40,
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    color: "#6b7280",
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 8,
  },
  footerText: {
    textAlign: "center" as const,
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 24,
    marginBottom: 8,
  },
  hr:{
    borderTop:'1px solid #F3F4F6',
    margin:'12px 0'
  },
  footerAction: {
    textAlign: "center" as const,
    fontSize: 13,
    color: "#6B7280",
  },
  contactLink: {
    fontSize:14,
    color: "#25D366",
    textDecoration: "none",
    fontWeight: 600,
    marginLeft: 4,
    transition: "color 0.2s ease",
  },
};

function getStatusColor(status: string) {
  switch (status?.toUpperCase()) {
    case "FULFILLED":
      return { bg: "#ecfdf5", text: "#059669" };
    case "IN_PROGRESS":
      return { bg: "#eff6ff", text: "#2563eb" };
    case "ON_HOLD":
      return { bg: "#fef3c7", text: "#b45309" };
    case "CANCELLED":
      return { bg: "#fee2e2", text: "#dc2626" };
    default:
      return { bg: "#f3f4f6", text: "#6b7280" };
  }
}

function formatStatus(status: string): string {
  switch (status?.toUpperCase()) {
    case "FULFILLED":
      return "Delivered";
    case "IN_PROGRESS":
      return "In transit";
    case "ON_HOLD":
      return "Processing";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

export default function AppShipments() {
  const { orders } = useLoaderData<typeof loader>();
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [hoveredTrackingId, setHoveredTrackingId] = useState<string | null>(null);

  // Transform orders into shipments
  const shipments: Shipment[] = [];
  orders.forEach((order: any) => {
    if (order.node.fulfillments && order.node.fulfillments.length > 0) {
      order.node.fulfillments.forEach((fulfillment: any, idx: number) => {
        if (fulfillment.trackingInfo) {
          console.log(order.node);
          shipments.push({
            id: `${order.node.id}-${idx}`,
            orderName: order.node.name,
            trackingNumber: fulfillment.trackingInfo[0].number || "—",
            carrier: fulfillment.trackingInfo[0].company || "—",
            destination: order.node.shippingAddress?.country || "Unknown",
            status: fulfillment.displayStatus,
            createdAt: fulfillment.createdAt || order.node.createdAt,
            trackingUrl: fulfillment.trackingInfo[0].url,
          });
        }
      });
      console.log("shipments",shipments);
    }
  });

  const totalShipments = shipments.length;
  const deliveredShipments = shipments.filter(
    (s) => s.status === "FULFILLED"
  ).length;
  const inTransitShipments = shipments.filter(
    (s) => s.status === "IN_PROGRESS"
  ).length;
  const processingShipments = shipments.filter(
    (s) => s.status === "ON_HOLD"
  ).length;


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div style={styles.container}>

      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
        <span style={{fontSize:'14px',fontWeight:'700'}}>Your Shipments</span>
        <span style={{fontSize:'11px',color:'#6B7280',padding:'3px 8px',borderRadius:'10px',backgroundColor:'#F3F4F6'}}>Last 30 days</span>
      </div>

      {/* Shipments List */}
      {shipments.length > 0 ? (
        <div>
          {shipments.map((shipment) => (
            <div
              key={shipment.id}
              style={{
                ...styles.shipmentCard,
                ...(hoveredCardId === shipment.id && styles.shipmentCardHover),
              }}
              onMouseEnter={() => setHoveredCardId(shipment.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              {/* Card Header */}
              <div style={styles.cardHeader}>
                <span style={styles.shipmentId}>{shipment.orderName}</span>
                <span style={styles.date}>{formatDate(shipment.createdAt)}</span>
              </div>

              {/* Card Grid */}
              <div style={styles.cardGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>TRACKING</label>
                  {shipment.trackingUrl ? (
                    <a
                      href={shipment.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        ...styles.trackingLink,
                        ...(hoveredTrackingId === shipment.id &&
                          styles.trackingLinkHover),
                      }}
                      onMouseEnter={() => setHoveredTrackingId(shipment.id)}
                      onMouseLeave={() => setHoveredTrackingId(null)}
                    >
                      {shipment.trackingNumber}
                    </a>
                  ) : (
                    <span style={styles.value}>{shipment.trackingNumber}</span>
                  )}
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>CARRIER</label>
                  <span style={styles.value}>{shipment.carrier}</span>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>DESTINATION</label>
                  <span style={styles.value}>{shipment.destination}</span>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>STATUS</label>
                  <div style={styles.statusBadge(shipment.status)}>
                    {formatStatus(shipment.status)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Footer */}
          <div style={styles.footerText}>
            Showing {shipments.length} of {shipments.length} · tap tracking number
            to track
          </div>
          <div style={styles.hr}></div>
          <div style={styles.footerAction}>
            Order issue?{" "}
            <Link to="/app/support" style={styles.contactLink}>Contact your team →</Link>
          </div>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyStateTitle}>No shipments yet</div>
          <p>Shipments will appear here as orders are fulfilled and shipped.</p>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  change: string;
}

function StatCard({ label, value, change }: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.statCard,
        ...(isHovered && styles.statCardHover),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
      <div style={{ fontSize: 12, color: "#059669", marginTop: 8 }}>
        {change}
      </div>
    </div>
  );
}