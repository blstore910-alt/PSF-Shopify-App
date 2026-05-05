import { useState,useCallback, type FormEvent } from "react";
import type {  LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "react-router";
import db from "../db.server";
import "../styles/source.css";
import { Toast, Frame } from "@shopify/polaris";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  try {
    await db.shop.updateMany({
      where: {
        shop_domain: shop,
        onboarding_seen: false,
      },
      data: { onboarding_seen: true },
    });
    console.log("DB Update Success for:", shop);
  } catch (e) {
    console.error("DB Update Failed:", e);
  }
  return { shop }; 
};

export default function AppSource() {
    const { shop } = useLoaderData() as { shop: string };

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherRegionValue, setOtherRegionValue] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const toggleToastActive = useCallback(() => setToastActive((active) => !active), []);

  const PSF_WHATSAPP = "31621917932";
  const SHOP_NAME = shop;

  const toggleRegion = (region: string) => {
    if (region === "other") {
      setIsOtherSelected(!isOtherSelected);
    }
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region],
    );
  };

  const submitSourcingRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const product = (formData.get("product") as string)?.trim();
    const quantity = (formData.get("quantity") as string)?.trim();
    const targetPrice = (formData.get("targetPrice") as string)?.trim();
    const notes = (formData.get("notes") as string)?.trim();
    
    const finalizedRegions = selectedRegions
      .map((region) => {
        if (region === "other") return otherRegionValue.trim();
        return region;
      })
      .filter(Boolean);

    if (!product || !quantity) {
        setToastMessage("Please fill in product and quantity.");
        setToastActive(true);
    //   alert("Please fill in product and quantity.");
      return;
    }
    if (finalizedRegions.length === 0) {
        setToastMessage("Please select at least one shipping region.");
        setToastActive(true);
    //   alert("Please select at least one shipping region.");
      return;
    }

    let lines = [];
    lines.push("Hi Prime Scale, I'd like a sourcing quote:");
    lines.push("");
    lines.push("Product: " + product);
    lines.push("Quantity: " + quantity + " units");
    lines.push("Shipping to: " + finalizedRegions.join(", "));
    if (targetPrice) lines.push("Target price: " + targetPrice);
    if (notes) lines.push("Notes: " + notes);
    lines.push("");
    lines.push("Store: " + SHOP_NAME);
    
    const message = lines.join("\n");

    const url = `https://wa.me/${PSF_WHATSAPP}?text=${encodeURIComponent(message)}`;
    
    window.open(url, "_blank", "noopener,noreferrer");
    setFormSubmitted(true);
  };

  const resetSourcingForm = () => {
    setSelectedRegions([]);
    setIsOtherSelected(false);
    setOtherRegionValue("");
    setFormSubmitted(false);
  };

  const regionsList = [
     {id: "USA", flag: "🇺🇸", name: "United States" },
     { id: "EU", flag: "🇪🇺", name: "Europe" },
     { id: "UK", flag: "🇬🇧", name: "United Kingdom" },
     { id: "Australia", flag: "🇦🇺", name: "Australia" },
     { id: "Canada", flag: "🇨🇦", name: "Canada" },
     { id: "other", flag: "🌐", name: "Other" },
    ];
  return (
    <Frame>
    <div
      style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        // minHeight: "100vh",
        maxWidth: "420px",
        // padding: "16px",
        margin: "0 auto",
        boxSizing: "border-box",
        background: "#ffffff",
        borderRadius: "0 0 15px 15px",
      }}
    >
        {toastActive && (
          <Toast content={toastMessage} onDismiss={toggleToastActive} duration={10000}/>
        )}
      <div className="screen s-body" id="screen-source">
        {/* <!-- Hero card with gradient + animated globe --> */}
        <div className="source-hero">
          <div className="source-hero-bg">
            <div className="hero-orb orb-1"></div>
            <div className="hero-orb orb-2"></div>
            <div className="hero-grid"></div>
          </div>
          <div className="source-hero-content">
            <div className="hero-badge">
              <span className="hero-dot"></span>SOURCING
            </div>
            <div className="hero-title">
              Source any product
              <br />
              from China.
            </div>
            <div className="hero-sub">
              Quote in hours · Quality controlled · Worldwide shipping
            </div>
          </div>
          <div className="hero-icon-wrap">
            <svg className="hero-icon" viewBox="0 0 64 64" fill="none">
              <defs>
                <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#f0d4a0" />
                  <stop offset="100%" stop-color="#a07e58" />
                </linearGradient>
              </defs>
              <polygon
                points="32,8 56,20 32,32 8,20"
                fill="url(#boxGrad)"
                stroke="#25D366"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <polygon
                points="56,20 56,44 32,56 32,32"
                fill="#a07e58"
                stroke="#25D366"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <polygon
                points="8,20 8,44 32,56 32,32"
                fill="#c8a070"
                stroke="#25D366"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <line
                x1="20"
                y1="14"
                x2="44"
                y2="26"
                stroke="#f0d4a0"
                stroke-width="1.5"
              />
            </svg>
          </div>
        </div>

        {/* <!-- Source platforms pills --> */}
        <div className="source-platforms">
          <div className="sp-label">We source from</div>
          <div className="sp-pills">
            <span className="sp-pill">
              <span className="sp-pill-dot orange"></span>Alibaba
            </span>
            <span className="sp-pill">
              <span className="sp-pill-dot red"></span>1688
            </span>
            <span className="sp-pill">
              <span className="sp-pill-dot orange"></span>AliExpress
            </span>
            <span className="sp-pill">
              <span className="sp-pill-dot blue"></span>Factories
            </span>
          </div>
        </div>

        {/* <!-- Process steps --> */}
        <div className="process-steps">
          <div className="step">
            <div className="step-num">1</div>
            <div className="step-line"></div>
            <div className="step-label">Submit</div>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <div className="step-line"></div>
            <div className="step-label">We quote</div>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <div className="step-line"></div>
            <div className="step-label">Stock</div>
          </div>
          <div className="step">
            <div className="step-num">4</div>
            <div className="step-label">Ship</div>
          </div>
        </div>

        {/* <!-- Form card with header --> */}
        <div className="source-form-card">
          <div className="form-card-header">
            <div className="form-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <div className="form-card-title">New sourcing request</div>
              <div className="form-card-sub">Fill in the details below</div>
            </div>
          </div>

        {!formSubmitted ? (
          <form id="sourcing-form" onSubmit={submitSourcingRequest}>
            <div className="form-row">
              <label htmlFor="src-product">
                <span className="form-icon-mini">🔗</span>
                Product link or name <span className="req">*</span>
              </label>
              <input
                type="text"
                id="src-product"
                name="product"
                placeholder="https://www.aliexpress.com/item/... or product name"
                // required
              />
              <span className="hint">
                Paste any product URL or describe what you're looking for
              </span>
            </div>

            <div className="form-row">
              <label htmlFor="src-quantity">
                <span className="form-icon-mini">📦</span>
                Quantity per order <span className="req">*</span>
              </label>
              <input
                type="number"
                id="src-quantity"
                name="quantity"
                min="1"
                placeholder="500"
                // required
              />
              <span className="hint">
                Approximate units you ship per month is fine
              </span>
            </div>

            <div className="form-row">
              <label>
                <span className="form-icon-mini">🌍</span>
                Shipping to <span className="req">*</span>
              </label>
              <div className="region-picker" id="src-regions">
                {regionsList.map((region) => (
                    <button
                    key={region.id}
                    type="button"
                    className={`region-chip ${selectedRegions.includes(region.id) ? "selected" : ""}`}
                    onClick={() => toggleRegion(region.id)}
                    >
                    <span className="region-flag">{region.flag}</span>
                    <span className="region-name">{region.name}</span>
                    <span className="region-check">✓</span>
                    </button>
                ))}
                </div>
              {isOtherSelected && (
                <input
                type="text"
                id="src-region-other"
                placeholder="Specify other countries..."
                value={otherRegionValue}
                onChange={(e) => setOtherRegionValue(e.target.value)}
                style={{ marginTop: "8px" }}
                />
            )}
              <span className="hint">Tap one or more regions you ship to</span>
            </div>

            <div className="form-row">
              <label htmlFor="src-target-price">
                <span className="form-icon-mini">💰</span>
                Target price per unit
                <span className="opt-tag">Optional</span>
              </label>
              <input
                type="text"
                id="src-target-price"
                name="targetPrice"
                placeholder="e.g. $4.50 or €5"
              />
            </div>

            <div className="form-row">
              <label htmlFor="src-notes">
                <span className="form-icon-mini">📝</span>
                Notes
                <span className="opt-tag">Optional</span>
              </label>
              <textarea
                id="src-notes"
                name="notes"
                rows={3}
                placeholder="Branded packaging, custom labels, specific colors, etc."
              ></textarea>
            </div>

            <button type="submit" className="btn-source-submit">
              <span className="btn-source-shine"></span>
              <svg viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="btn-text">Send request via WhatsApp</span>
              <svg
                className="btn-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        ):(
             <div
          className="success-msg"
          id="source-success"
        >
          <div className="success-confetti">
            <span className="confetti c1">✦</span>
            <span className="confetti c2">✧</span>
            <span className="confetti c3">✦</span>
            <span className="confetti c4">✧</span>
          </div>
          <div className="check-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="success-title">Request sent</div>
          <div className="success-text">
            WhatsApp opened in a new tab with your request pre-filled. Tap{" "}
            <strong>Send</strong> there to deliver it to our team — we'll reply
            with a quote within a few hours.
          </div>
          <button
            type="button"
            className="btn-reset"
            onClick={resetSourcingForm}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                width: "14px",
                height: "14px",
                marginRight: "6px",
                verticalAlign: "-2px",
              }}
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Send another request
          </button>
        </div>
        )}
        </div>

        {/* <!-- What we source --> */}
        <div className="source-features">
          <div className="sf-title">What we can source</div>
          <div className="sf-grid">
            <div className="sf-card">
              <div className="sf-icon-wrap green">
                <span>🔍</span>
              </div>
              <div className="sf-text">
                <div className="sf-name">Any product</div>
                <div className="sf-desc">
                  Alibaba, 1688, AliExpress or any factory
                </div>
              </div>
            </div>
            <div className="sf-card">
              <div className="sf-icon-wrap blue">
                <span>📦</span>
              </div>
              <div className="sf-text">
                <div className="sf-name">Custom packaging</div>
                <div className="sf-desc">Branded boxes, labels, inserts</div>
              </div>
            </div>
            <div className="sf-card">
              <div className="sf-icon-wrap amber">
                <span>📊</span>
              </div>
              <div className="sf-text">
                <div className="sf-name">Bulk inventory</div>
                <div className="sf-desc">
                  Stock at our Shenzhen &amp; Ningbo warehouses
                </div>
              </div>
            </div>
            <div className="sf-card">
              <div className="sf-icon-wrap purple">
                <span>✓</span>
              </div>
              <div className="sf-text">
                <div className="sf-name">Sample first</div>
                <div className="sf-desc">Test before committing to volume</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Frame>
  );
}
