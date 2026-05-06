import { useState } from "react";

// ─────────────────────────── INITIAL DATA ───────────────────────────
let _id = 1;
const uid = () => `id_${_id++}`;

const INIT_PRODUCTS = [
  {
    id: "p1",
    name: "Pears Original Soap",
    category: "Nonwoven",
    hsn: "19523010",
    gst: "18%",
    isPackaged: true,
    isRice: false,
    batches: [
      { id: "b1", upc: "1234567890", batch: "-",  price: "20,000", weight: "200g Pack of 3", offlinePrice: "200", qty: 800, channel: "Offline", addedByYou: true,  approval: "pending", hnc: false },
      { id: "b2", upc: "1234567890", batch: "1",  price: "20,000", weight: "200g",           offlinePrice: "200", qty: 800, channel: "Offline", addedByYou: true,  approval: "pending", hnc: false },
      { id: "b3", upc: "",           batch: "2",  price: "20,000", weight: "200g",           offlinePrice: "200", qty: 800, channel: "Offline", addedByYou: false, approval: null,      hnc: false },
      { id: "b4", upc: "",           batch: "3",  price: "20,000", weight: "200g",           offlinePrice: "200", qty: 800, channel: "Offline", addedByYou: false, approval: null,      hnc: false },
      { id: "b5", upc: "1234567890", batch: "-",  price: "20,000", weight: "200g",           offlinePrice: "200", qty: 800, channel: "Offline", addedByYou: false, approval: null,      hnc: true  },
      { id: "b6", upc: "1234567890", batch: "-",  price: "20,000", weight: "200g",           offlinePrice: "200", qty: 800, channel: "Offline", addedByYou: false, approval: null,      hnc: true,  pack4: true },
    ],
    totalQty: "650",
  },
  {
    id: "p2",
    name: "Basmati Rice",
    category: "Grains",
    hsn: "19023010",
    gst: "18%",
    isPackaged: false,
    isRice: true,
    batches: [
      { id: "r1", upc: "1234567890", batch: "-", sellingPrice: "200", qtyKg: 800, channel: "Offline", addedByYou: true,  approval: null },
      { id: "r2", upc: "1234567890", batch: "1", sellingPrice: "200", qtyKg: 800, channel: "Offline", addedByYou: true,  approval: null },
      { id: "r3", upc: "",           batch: "2", sellingPrice: "200", qtyKg: 800, channel: "Offline", addedByYou: false, approval: null },
      { id: "r4", upc: "",           batch: "3", sellingPrice: "200", qtyKg: 800, channel: "Offline", addedByYou: false, approval: null },
    ],
    totalQty: "650",
  },
];

const INIT_APPROVAL = [
  {
    id: "ap1", name: "Pears Original Soap", category: "Nonwoven", hsn: "19523010", gst: "18%", isPackaged: true,
    approvalStatus: "rejected", rejectionReason: "Rejected due to XYZ.",
    batches: [
      { id: "a1b1", upc: "1234567890", batch: "-", price: "20,000", weight: "200g Pack of 3", offlinePrice: "200", qty: 800, channel: "Offline" },
      { id: "a1b2", upc: "",           batch: "2", price: "20,000", weight: "200g",           offlinePrice: "200", qty: 800, channel: "Offline" },
      { id: "a1b3", upc: "",           batch: "3", price: "20,000", weight: "200g",           offlinePrice: "200", qty: 800, channel: "Offline" },
    ], totalQty: "650",
  },
  {
    id: "ap2", name: "Pears Original Soap", category: "Nonwoven", hsn: "19523010", gst: "18%", isPackaged: true,
    approvalStatus: "pending", rejectionReason: null,
    batches: [
      { id: "a2b1", upc: "1234567890", batch: "-", price: "20,000", weight: "200g Pack of 3", offlinePrice: "200", qty: 800, channel: "Offline" },
    ], totalQty: "800",
  },
  {
    id: "ap3", name: "Pears Original Soap", category: "Nonwoven", hsn: "19523010", gst: "18%", isPackaged: true,
    approvalStatus: "approved", rejectionReason: null,
    batches: [
      { id: "a3b1", upc: "1234567890", batch: "-", price: "20,000", weight: "200g Pack of 3", offlinePrice: "200", qty: 800, channel: "Offline" },
    ], totalQty: "800",
  },
];

// ─────────────────────────── STYLE TOKENS ───────────────────────────
const C = {
  sidebarBg: "#0e1e4b",
  sidebarText: "#c5cde8",
  sidebarActive: "#1a3466",
  headerBg: "#fff",
  mainBg: "#f4f6fa",
  tabActive: "#1a55fb",
  tabActiveTxt: "#fff",
  tabInactive: "#6b7280",
  blue: "#1a55fb",
  orange: "#f59e0b",
  orangeBorder: "#f59e0b",
  red: "#ef4444",
  green: "#22c55e",
  teal: "#0891b2",
  navy: "#0f1f48",
  border: "#e5e7eb",
  badge: { addedByYou: { bg: "#dbeafe", text: "#1d4ed8", dot: "#22c55e" }, pending: { bg: "#fef3c7", text: "#b45309", dot: "#f59e0b" }, rejected: { bg: "#fee2e2", text: "#b91c1c", dot: "#ef4444" }, approved: { bg: "#dcfce7", text: "#15803d", dot: "#22c55e" }, hnc: { bg: "#fff7ed", text: "#c2410c", dot: "#f97316" } },
};

const s = {
  app: { display: "flex", height: "100vh", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", fontSize: 13, background: C.mainBg, overflow: "hidden" },
  sidebar: { width: 210, background: C.sidebarBg, display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto", overflowX: "hidden" },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  purpleBar: { height: 4, background: "linear-gradient(90deg,#7c3aed 0%,#ec4899 60%,#f59e0b 100%)", flexShrink: 0 },
  topBar: { background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 },
  content: { flex: 1, overflowY: "auto", padding: "16px 20px" },
};

// ─────────────────────────── HELPERS ────────────────────────────────
function calculateTotalQty(batches, isRice) {
  return batches.reduce((sum, b) => sum + (Number(isRice ? b.qtyKg : b.qty) || 0), 0).toString();
}

function Badge({ color, dot, children, style = {} }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: color.bg, color: color.text, whiteSpace: "nowrap", ...style }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: color.dot }} />}
      {children}
    </span>
  );
}

function Btn({ children, variant = "outline", onClick, style = {}, small }) {
  const base = { cursor: "pointer", border: "none", borderRadius: 6, fontFamily: "inherit", fontWeight: 600, transition: "opacity .15s", display: "inline-flex", alignItems: "center", gap: 4 };
  const variants = {
    primary: { background: C.blue, color: "#fff", padding: small ? "4px 10px" : "7px 14px", fontSize: small ? 11 : 13 },
    outline: { background: "#fff", color: "#374151", border: `1px solid ${C.border}`, padding: small ? "4px 10px" : "7px 14px", fontSize: small ? 11 : 13 },
    orange: { background: "none", color: C.orange, border: `1px solid ${C.orange}`, padding: small ? "3px 8px" : "5px 12px", fontSize: small ? 11 : 12, borderRadius: 4 },
    amber: { background: "#fff7ed", color: "#c2410c", border: `1px solid #fed7aa`, padding: small ? "3px 8px" : "5px 12px", fontSize: small ? 11 : 12, borderRadius: 4 },
    ghost: { background: "none", color: C.tabInactive, padding: small ? "4px 8px" : "6px 10px", fontSize: 12 },
    danger: { background: C.red, color: "#fff", padding: "5px 8px", borderRadius: "50%", fontSize: 13, width: 28, height: 28, justifyContent: "center" },
    edit: { background: "#fff", color: "#374151", border: `1px solid ${C.border}`, padding: "3px 10px", fontSize: 11, borderRadius: 4 },
  };
  return <button style={{ ...base, ...variants[variant], ...style }} onClick={onClick}>{children}</button>;
}

function Input({ value, onChange, placeholder, style = {} }) {
  return <input value={value} onChange={onChange} placeholder={placeholder} style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", fontSize: 12, fontFamily: "inherit", outline: "none", background: "#fff", ...style }} />;
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: 12, width: 520, maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.navy }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b7280" }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────── SIDEBAR ────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "inventory", label: "Inventory", icon: "📦", children: [{ id: "my-inventory", label: "My inventory" }, { id: "purchase", label: "Purchase" }, { id: "inv-adj", label: "Inventory adjustment" }] },
  { id: "online-store", label: "Online store", icon: "🛒", children: [{ id: "online-orders", label: "Online Orders" }, { id: "settlement", label: "Settlement & payout" }, { id: "order-history", label: "Order history" }] },
  { id: "pos", label: "POS & Billing", icon: "🖨️" },
  { id: "discrepancies", label: "Discrepancies", icon: "⚠️", badge: 4 },
  { id: "transaction", label: "Transaction History", icon: "📄" },
];

function Sidebar({ activeNav, setActiveNav }) {
  const [expanded, setExpanded] = useState({ inventory: true, "online-store": true });
  return (
    <div style={s.sidebar}>
      {/* Logo */}
      <div style={{ padding: "18px 16px 12px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>●</div>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Shelf OS</span>
      </div>
      {/* Nav */}
      <nav style={{ flex: 1, padding: "4px 0" }}>
        {NAV.map(item => (
          <div key={item.id}>
            <div
              onClick={() => {
                if (item.children) setExpanded(e => ({ ...e, [item.id]: !e[item.id] }));
                else setActiveNav(item.id);
              }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", cursor: "pointer", background: !item.children && activeNav === item.id ? C.sidebarActive : "none", borderRadius: 6, margin: "1px 6px", color: !item.children && activeNav === item.id ? "#fff" : C.sidebarText }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {item.badge && <span style={{ background: C.red, color: "#fff", borderRadius: 999, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{item.badge}</span>}
                {item.children && <span style={{ fontSize: 10, color: C.sidebarText }}>{expanded[item.id] ? "▾" : "▸"}</span>}
              </span>
            </div>
            {item.children && expanded[item.id] && (
              <div style={{ paddingLeft: 20 }}>
                {item.children.map(child => (
                  <div
                    key={child.id}
                    onClick={() => setActiveNav(child.id)}
                    style={{ padding: "6px 16px", cursor: "pointer", color: activeNav === child.id ? "#fff" : C.sidebarText, fontWeight: activeNav === child.id ? 600 : 400, fontSize: 12, borderRadius: 6, margin: "1px 6px", background: activeNav === child.id ? C.sidebarActive : "none", borderLeft: activeNav === child.id ? `2px solid ${C.blue}` : "2px solid transparent" }}
                  >
                    {child.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      {/* Bottom */}
      <div style={{ padding: "8px 0 12px", borderTop: "1px solid rgba(255,255,255,.1)" }}>
        {[{ id: "help", icon: "❓", label: "Help" }, { id: "settings", icon: "⚙️", label: "Settings" }].map(item => (
          <div key={item.id} onClick={() => setActiveNav(item.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 22px", cursor: "pointer", color: activeNav === item.id ? "#fff" : C.sidebarText, fontSize: 13 }}>
            <span>{item.icon}</span>{item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────── TOP BAR ────────────────────────────────
function TopBar({ search, setSearch, storeActive, setStoreActive }) {
  return (
    <div style={s.topBar}>
      <span style={{ fontWeight: 700, fontSize: 15, color: C.navy, marginRight: 8 }}>My inventory</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, background: "#f4f6fa", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px" }}>
        <span style={{ color: "#9ca3af", fontSize: 13 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" style={{ border: "none", background: "none", outline: "none", fontSize: 12, fontFamily: "inherit", width: 160 }} />
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, color: "#6b7280" }}>
          <div onClick={() => setStoreActive(!storeActive)} style={{ width: 36, height: 20, borderRadius: 999, background: storeActive ? C.blue : "#d1d5db", position: "relative", transition: ".2s" }}>
            <div style={{ position: "absolute", width: 16, height: 16, borderRadius: "50%", background: "#fff", top: 2, left: storeActive ? 18 : 2, transition: ".2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
          </div>
          Store {storeActive ? "active" : "inactive"}
        </label>
        <span style={{ fontSize: 18, color: "#6b7280", cursor: "pointer" }}>🔔</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>JL</div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>Jose Less</div>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>name@shelfos.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── PRODUCT CARD ────────────────────────────
function ProductCard({ product, onDeleteBatch, onEditBatch, showStatus, showAddedByYou }) {
  const [expanded, setExpanded] = useState(true);
  const SHOW_COLLAPSED = 2;
  const visibleBatches = expanded ? product.batches : product.batches.slice(0, SHOW_COLLAPSED);
  const isRice = product.isRice;

  return (
    <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
      {/* Product Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${C.border}`, gap: 10, flexWrap: "wrap" }}>
        <div style={{ width: 32, height: 32, borderRadius: 6, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
          {isRice ? "🌾" : "🧼"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: C.blue, fontSize: 13 }}>{product.name}</div>
          {product.category && <div style={{ fontSize: 11, color: "#6b7280" }}>{product.category}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {product.category && <span style={{ fontSize: 11, color: "#6b7280" }}>CATEGORY: <b style={{ color: "#374151" }}>{product.category}</b></span>}
          <span style={{ fontSize: 11, color: "#6b7280" }}>HSN <b style={{ color: "#374151" }}>{product.hsn}</b></span>
          <span style={{ fontSize: 11, color: "#6b7280" }}>GST <b style={{ color: "#374151" }}>{product.gst}</b></span>
          {product.isPackaged !== undefined && (
            product.isPackaged
              ? <Btn variant="orange" small>📦 Packaged Item</Btn>
              : <Btn variant="amber" small>+ Create Item</Btn>
          )}
        </div>
      </div>

      {/* Batch Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={th}>UPC Number</th>
              <th style={th}>Batch</th>
              {!isRice && <><th style={th}>Price</th><th style={th}>Weight</th><th style={th}>Offline Selling Price</th></>}
              {isRice && <><th style={th}>Selling Price/Kg</th></>}
              <th style={th}>Quantity{isRice ? "(kg)" : ""}</th>
              <th style={th}>Sales channel ⓘ</th>
              {showStatus && <th style={th}>Status ⓘ</th>}
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {visibleBatches.map((batch, idx) => (
              <BatchRow
                key={batch.id}
                batch={batch}
                isRice={isRice}
                productId={product.id}
                onDelete={onDeleteBatch}
                onEdit={onEditBatch}
                showStatus={showStatus}
                showAddedByYou={showAddedByYou}
                approvalStatus={product.approvalStatus}
                last={idx === visibleBatches.length - 1}
              />
            ))}
          </tbody>
        </table>

        {/* View more/less */}
        {product.batches.length > SHOW_COLLAPSED && (
          <div style={{ padding: "6px 16px" }}>
            <button onClick={() => setExpanded(!expanded)} style={{ background: "none", border: "none", color: C.blue, fontSize: 11, cursor: "pointer", fontWeight: 600, padding: 0 }}>
              {expanded ? "View less ▲" : `View more ▼ (+${product.batches.length - SHOW_COLLAPSED} batches)`}
            </button>
          </div>
        )}

        {/* Total Quantity */}
        <div style={{ padding: "8px 16px 10px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>Total Quantity <span style={{ color: C.blue }}>{product.totalQty}{isRice ? "kg" : ""}</span></span>
        </div>

        {/* Rejection banner */}
        {product.approvalStatus === "rejected" && product.rejectionReason && (
          <div style={{ margin: "0 16px 12px", padding: "8px 12px", background: "#fef2f2", border: `1px solid #fca5a5`, borderRadius: 6, color: C.red, fontSize: 12, fontWeight: 600 }}>
            {product.rejectionReason}
          </div>
        )}
      </div>

      {/* Generate Barcode row (only for Basmati-like products) */}
      {isRice && (
        <div style={{ padding: "8px 16px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
          <Btn variant="ghost" small onClick={() => {}}>+ Generate Barcode</Btn>
        </div>
      )}
    </div>
  );
}

const th = { textAlign: "left", padding: "8px 12px", fontWeight: 600, color: "#6b7280", fontSize: 11, whiteSpace: "nowrap", borderBottom: "1px solid #f3f4f6" };
const td = { padding: "9px 12px", borderBottom: "1px solid #f9fafb", color: "#374151", verticalAlign: "middle" };

function BatchRow({ batch, isRice, productId, onDelete, onEdit, showStatus, showAddedByYou, approvalStatus, last }) {
  return (
    <tr style={{ background: last ? "none" : "none" }}>
      <td style={td}>
        <div>{batch.upc || <span style={{ color: "#d1d5db" }}>—</span>}</div>
        {batch.pack4 && <div style={{ fontSize: 10, color: "#6b7280" }}>Also sent in pack(4)</div>}
      </td>
      <td style={td}>{batch.batch || "—"}</td>
      {!isRice && (
        <>
          <td style={td}>{batch.price ? `₹${batch.price}` : "—"}</td>
          <td style={td}>{batch.weight || "—"}</td>
          <td style={td}>{batch.offlinePrice ? `₹${batch.offlinePrice}` : "—"}</td>
        </>
      )}
      {isRice && <td style={td}>{batch.sellingPrice ? `₹${batch.sellingPrice}` : "—"}</td>}
      <td style={td}>{isRice ? batch.qtyKg : batch.qty}</td>
      <td style={td}>{batch.channel || "—"}</td>
      {showStatus && (
        <td style={td}>
          {approvalStatus === "rejected" && (
            <div>
              <Badge color={C.badge.rejected} dot>● Rejected</Badge>
              <div><a href="#" style={{ fontSize: 10, color: C.blue }}>View details ▼</a></div>
            </div>
          )}
          {approvalStatus === "pending" && <Badge color={C.badge.pending} dot>Pending quantity...</Badge>}
          {approvalStatus === "approved" && <Badge color={C.badge.approved} dot>● Approved</Badge>}
        </td>
      )}
      {!showStatus && (
        <td style={td}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {batch.addedByYou && showAddedByYou && (
              <>
                <Badge color={C.badge.addedByYou} dot>Added by you</Badge>
                {batch.approval === "pending" && <Badge color={C.badge.pending} dot style={{ fontSize: 10 }}>Approval pending</Badge>}
              </>
            )}
            {batch.hnc && <Badge color={C.badge.hnc} dot>HNC</Badge>}
          </div>
        </td>
      )}
      <td style={{ ...td, whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Btn variant="edit" onClick={() => onEdit(productId, batch.id, batch)}>✏️ Edit</Btn>
          <Btn variant="danger" onClick={() => onDelete(productId, batch.id)}>🗑️</Btn>
        </div>
      </td>
    </tr>
  );
}

// ─────────────────────────── EDIT MODAL ────────────────────────────
function EditModal({ editData, onSave, onClose }) {
  const { productId, batchId, batch, isRice } = editData;
  const [form, setForm] = useState({ ...batch });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal title="Edit Batch" onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={lbl}>UPC Number</label>
          <Input value={form.upc || ""} onChange={e => set("upc", e.target.value)} style={{ width: "100%" }} />
        </div>
        <div>
          <label style={lbl}>Batch</label>
          <Input value={form.batch || ""} onChange={e => set("batch", e.target.value)} style={{ width: "100%" }} />
        </div>
        {!isRice && (
          <>
            <div>
              <label style={lbl}>Price (₹)</label>
              <Input value={form.price || ""} onChange={e => set("price", e.target.value)} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={lbl}>Weight</label>
              <Input value={form.weight || ""} onChange={e => set("weight", e.target.value)} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={lbl}>Offline Selling Price (₹)</label>
              <Input value={form.offlinePrice || ""} onChange={e => set("offlinePrice", e.target.value)} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={lbl}>Quantity</label>
              <Input value={form.qty || ""} onChange={e => set("qty", Number(e.target.value))} style={{ width: "100%" }} />
            </div>
          </>
        )}
        {isRice && (
          <>
            <div>
              <label style={lbl}>Selling Price/Kg (₹)</label>
              <Input value={form.sellingPrice || ""} onChange={e => set("sellingPrice", e.target.value)} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={lbl}>Quantity (kg)</label>
              <Input value={form.qtyKg || ""} onChange={e => set("qtyKg", Number(e.target.value))} style={{ width: "100%" }} />
            </div>
          </>
        )}
        <div>
          <label style={lbl}>Sales Channel</label>
          <select value={form.channel || "Offline"} onChange={e => set("channel", e.target.value)} style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", fontSize: 12, fontFamily: "inherit", outline: "none", width: "100%" }}>
            <option>Offline</option>
            <option>Online</option>
            <option>Both</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
        <Btn variant="outline" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={() => onSave(productId, batchId, form)}>Save Changes</Btn>
      </div>
    </Modal>
  );
}

const lbl = { display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 4 };

// ─────────────────────────── ADD PRODUCT MODAL ──────────────────────
function AddProductModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name: "", category: "", hsn: "", gst: "18%", isPackaged: true });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) return alert("Product name is required");
    const isRice = !form.isPackaged;
    const initialBatch = isRice 
      ? { id: uid(), upc: "", batch: "-", sellingPrice: "0", qtyKg: 0, channel: "Offline", addedByYou: true, approval: "pending", hnc: false }
      : { id: uid(), upc: "", batch: "-", price: "0", weight: "—", offlinePrice: "0", qty: 0, channel: "Offline", addedByYou: true, approval: "pending", hnc: false };
    onSave({ ...form, id: uid(), isRice, batches: [initialBatch], totalQty: "0" });
  };

  return (
    <Modal title="Add New Product" onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={lbl}>Product Name *</label>
          <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Dove Soap" style={{ width: "100%" }} />
        </div>
        <div>
          <label style={lbl}>Category</label>
          <Input value={form.category} onChange={e => set("category", e.target.value)} placeholder="e.g. Personal Care" style={{ width: "100%" }} />
        </div>
        <div>
          <label style={lbl}>HSN Code</label>
          <Input value={form.hsn} onChange={e => set("hsn", e.target.value)} placeholder="e.g. 19523010" style={{ width: "100%" }} />
        </div>
        <div>
          <label style={lbl}>GST %</label>
          <select value={form.gst} onChange={e => set("gst", e.target.value)} style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", fontSize: 12, width: "100%", fontFamily: "inherit" }}>
            {["5%", "12%", "18%", "28%"].map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Product Type</label>
          <select value={form.isPackaged ? "packaged" : "loose"} onChange={e => set("isPackaged", e.target.value === "packaged")} style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", fontSize: 12, width: "100%", fontFamily: "inherit" }}>
            <option value="packaged">Packaged Item</option>
            <option value="loose">Loose / Bulk</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
        <Btn variant="outline" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={handleSave}>Add Product</Btn>
      </div>
    </Modal>
  );
}

// ─────────────────────────── MAIN APP ───────────────────────────────
export default function App() {
  const [activeNav, setActiveNav] = useState("my-inventory");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "added" | "approval"
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [approvalItems, setApprovalItems] = useState(INIT_APPROVAL);
  const [search, setSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [storeActive, setStoreActive] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addedByYouSubTab, setAddedByYouSubTab] = useState("inventory");
  const [showPackaged, setShowPackaged] = useState(true);
  const [promotions] = useState(3);

  // Handlers
  const deleteBatch = (productId, batchId) => {
    setProducts(ps => ps.map(p => {
      if (p.id === productId) {
        const newBatches = p.batches.filter(b => b.id !== batchId);
        return { ...p, batches: newBatches, totalQty: calculateTotalQty(newBatches, p.isRice) };
      }
      return p;
    }));
  };
  const editBatch = (productId, batchId, updated) => {
    setProducts(ps => ps.map(p => {
      if (p.id === productId) {
        const newBatches = p.batches.map(b => b.id === batchId ? updated : b);
        return { ...p, batches: newBatches, totalQty: calculateTotalQty(newBatches, p.isRice) };
      }
      return p;
    }));
    setEditModal(null);
  };
  const addProduct = (newProduct) => {
    setProducts(ps => [newProduct, ...ps]);
    setShowAddModal(false);
  };

  const deleteApprovalBatch = (productId, batchId) => {
    setApprovalItems(as => as.map(a => {
      if (a.id === productId) {
        const newBatches = a.batches.filter(b => b.id !== batchId);
        return { ...a, batches: newBatches, totalQty: calculateTotalQty(newBatches, a.isRice) };
      }
      return a;
    }));
  };
  const editApprovalBatch = (productId, batchId, updated) => {
    setApprovalItems(as => as.map(a => {
      if (a.id === productId) {
        const newBatches = a.batches.map(b => b.id === batchId ? updated : b);
        return { ...a, batches: newBatches, totalQty: calculateTotalQty(newBatches, a.isRice) };
      }
      return a;
    }));
    setEditModal(null);
  };

  const openEdit = (productId, batchId, batch, isRice = false) => {
    setEditModal({ productId, batchId, batch, isRice });
  };

  const filteredProducts = products.filter(p =>
    !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase())
  );
  const addedByYouProducts = filteredProducts.map(p => ({ ...p, batches: p.batches.filter(b => b.addedByYou) })).filter(p => p.batches.length > 0);

  const tabs = [
    { id: "all", label: "All items" },
    { id: "added", label: "Items added by you" },
    { id: "approval", label: "Items sent for approval" },
  ];

  return (
    <div style={s.app}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <div style={s.main}>
        <div style={s.purpleBar} />
        <TopBar search={search} setSearch={setSearch} storeActive={storeActive} setStoreActive={setStoreActive} />

        <div style={s.content}>
          {activeNav !== "my-inventory" ? (
            <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🚧</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: C.navy }}>
                {NAV.flatMap(n => n.children ? [n, ...n.children] : [n]).find(n => n.id === activeNav)?.label || activeNav} Screen
              </div>
              <div style={{ marginTop: 10 }}>This screen is under construction. Navigate to "My inventory" to view the functional prototype.</div>
            </div>
          ) : (
            <>
              {/* Tab Bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ padding: "6px 16px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 12, background: activeTab === tab.id ? C.tabActive : "transparent", color: activeTab === tab.id ? C.tabActiveTxt : C.tabInactive, transition: ".15s" }}>
                {tab.label}
              </button>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>Can't find product in list?</span>
              <Btn variant="primary" small onClick={() => setShowAddModal(true)}>+ Add new product</Btn>
            </div>
          </div>

          {/* Tab: Items added by you — extra filters */}
          {activeTab === "added" && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={showPackaged} onChange={e => setShowPackaged(e.target.checked)} /> Packaged products
              </label>
              <span style={{ fontSize: 12, color: "#6b7280" }}>Promotions: <b style={{ color: C.navy }}>{promotions}</b></span>
            </div>
          )}

          {/* Product search + filters row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 12px" }}>
              <span style={{ color: "#9ca3af", fontSize: 13 }}>🔍</span>
              <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search for Product" style={{ border: "none", background: "none", outline: "none", fontSize: 12, fontFamily: "inherit", width: "100%" }} />
            </div>
            <Btn variant="outline" small>▽ Filters</Btn>
          </div>

          {/* Items added by you — sub tabs */}
          {activeTab === "added" && (
            <div style={{ display: "flex", gap: 0, marginBottom: 14, borderBottom: `2px solid ${C.border}` }}>
              {[{ id: "inventory", label: "Items present in the inventory" }, { id: "drafts", label: "Drafts" }].map(st => (
                <button key={st.id} onClick={() => setAddedByYouSubTab(st.id)}
                  style={{ padding: "6px 16px", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 12, color: addedByYouSubTab === st.id ? C.blue : C.tabInactive, borderBottom: addedByYouSubTab === st.id ? `2px solid ${C.blue}` : "2px solid transparent", marginBottom: -2, display: "flex", alignItems: "center", gap: 5 }}>
                  {st.id === "inventory" && <span style={{ fontSize: 11 }}>📋</span>}
                  {st.label}
                </button>
              ))}
            </div>
          )}

          {/* ─── ALL ITEMS TAB ─── */}
          {activeTab === "all" && filteredProducts.map(product => (
            <ProductCard key={product.id} product={product}
              onDeleteBatch={deleteBatch}
              onEditBatch={(pid, bid, batch) => openEdit(pid, bid, batch, product.isRice)}
              showStatus={false}
              showAddedByYou={true}
            />
          ))}

          {/* ─── ITEMS ADDED BY YOU TAB ─── */}
          {activeTab === "added" && (
            addedByYouSubTab === "inventory"
              ? addedByYouProducts.map(product => (
                <ProductCard key={product.id} product={product}
                  onDeleteBatch={deleteBatch}
                  onEditBatch={(pid, bid, batch) => openEdit(pid, bid, batch, product.isRice)}
                  showStatus={false}
                  showAddedByYou={true}
                />
              ))
              : <div style={{ textAlign: "center", padding: 40, color: "#9ca3af", fontSize: 14 }}>No drafts found.</div>
          )}

          {/* ─── ITEMS SENT FOR APPROVAL TAB ─── */}
          {activeTab === "approval" && approvalItems.map(item => (
            <ProductCard key={item.id} product={item}
              onDeleteBatch={deleteApprovalBatch}
              onEditBatch={(pid, bid, batch) => openEdit(pid, bid, batch, false)}
              showStatus={true}
              showAddedByYou={false}
            />
          ))}

          {/* Empty state */}
          {activeTab === "all" && filteredProducts.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📦</div>
              <div>No products found. Add a new product to get started.</div>
            </div>
          )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {editModal && (
        <EditModal
          editData={editModal}
          onSave={editModal.productId.startsWith("ap") ? editApprovalBatch : editBatch}
          onClose={() => setEditModal(null)}
        />
      )}
      {showAddModal && <AddProductModal onSave={addProduct} onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
