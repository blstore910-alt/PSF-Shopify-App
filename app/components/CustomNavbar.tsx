// app/components/CustomNavbar.tsx
import { Link, useLocation } from "react-router";
import logo from "../assets/App_Icon.png";

export function CustomNavbar() {
  const location = useLocation();

  const navItemStyle = (path: string) => ({
    color: location.pathname === path ? "#ffffff" : "#94A3B8",
    fontSize: 12,
    fontWeight: 600,
    textDecoration: "none",
    textDecorationColor: "#056f1e",
    padding: "8px 9px 7px",
    borderBottom: location.pathname === path ? "2px solid #96BF48" : "none",
  });

  return (
    <div
      style={{
        width: "420px",
        margin: "10px auto 0",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <div
        style={{
          background: "#1c2b33",
          color: "white",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderRadius: "15px 15px 0 0",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={logo}
            alt="App Logo"
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "4px",
              objectFit: "cover" 
            }}
          />
        </div>
        {
        location.pathname=== "/app" ?
        <div style={{display:'flex',flexDirection:'column',gap:'3px'}}>
            <div style={{ fontSize: "12px", fontWeight: "700" }}>
            Prime Scale China Fulfillment
            </div>
            <span style={{fontSize:'10px',color:'#94A3B8'}}>Just installed</span>
        </div>
        :
        <>
        <div style={{ fontSize: "12px", fontWeight: "700" }}>
          Prime Scale China Fulfillment
        </div>
        
      </>
      }
      </div>
      {location.pathname !== '/app' && <>
      <div
            style={{
            display: "flex",
            padding: "0 8px",
            background: "#243541",
            borderBottom: "1px solid #e8ecf0",
            position: "sticky",
            top: 0,
            zIndex: 10,
            }}
            >
                <Link to="/app/home" style={navItemStyle("/app/home")}>
                Home
                </Link>
                <Link to="/app/orders" style={navItemStyle("/app/orders")}>
                Orders
                </Link>
                <Link to="/app/compare" style={navItemStyle("/app/compare")}>
                Compare
                </Link>
                <Link to="/app/source" style={navItemStyle("/app/source")}>
                Source
                </Link>
                <Link to="/app/support" style={navItemStyle("/app/support")}>
                Support
                </Link>
        </div></>}
      
      
    </div>
  );
}
