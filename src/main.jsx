import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { dateInputValue, formatDate, menuForDate, weekdays } from "./menu";
import "./styles.css";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const iconPaths = {
  cart: <><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.7 11h10.7l2-7H7"/></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  plus: <path d="M12 5v14M5 12h14"/>, minus: <path d="M5 12h14"/>,
  close: <path d="M6 6l12 12M18 6 6 18"/>,
  leaf: <><path d="M4 20c5-1 9-5 12-12"/><path d="M7 14C5 8 10 3 20 4c1 10-5 14-13 10Z"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z"/>,
};

function Icon({ name, size = 20 }) {
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>;
}

function App() {
  const today = new Date();
  const minDate = new Date(today); minDate.setDate(today.getDate() + 2);
  const maxDate = new Date(today); maxDate.setDate(today.getDate() + 14);
  const [page, setPage] = useState("menu");
  const [date, setDate] = useState(dateInputValue(minDate));
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("hearth-cart") || "[]"));
  const [detail, setDetail] = useState(null);
  const [notice, setNotice] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const menu = menuForDate(date);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => localStorage.setItem("hearth-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setMobileOpen(false); }, [page]);
  useEffect(() => { if (!notice) return; const id = setTimeout(() => setNotice(""), 2600); return () => clearTimeout(id); }, [notice]);

  function navigate(next) { setPage(next); }
  function add(item, quantity = 6) {
    setCart(current => {
      const found = current.find(entry => entry.id === item.id && entry.date === date);
      if (found) return current.map(entry => entry === found ? { ...entry, quantity: Math.min(30, entry.quantity + quantity) } : entry);
      return [...current, { ...item, quantity, date }];
    });
    setDetail(null); setNotice(`${item.name} added for ${quantity} guests.`);
  }
  function updateCart(index, quantity) { setCart(current => current.map((item, i) => i === index ? { ...item, quantity: Math.max(6, Math.min(30, quantity)) } : item)); }
  function removeCart(index) { setCart(current => current.filter((_, i) => i !== index)); }

  return <div className="app">
    <a className="skip-link" href="#main">Skip to content</a>
    <Header page={page} navigate={navigate} count={count} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
    <main id="main">
      {page === "menu" && <MenuPage date={date} setDate={setDate} min={dateInputValue(minDate)} max={dateInputValue(maxDate)} menu={menu} add={add} setDetail={setDetail} navigate={navigate} />}
      {page === "cart" && <CartPage cart={cart} update={updateCart} remove={removeCart} navigate={navigate} />}
      {page === "checkout" && <Checkout cart={cart} setCart={setCart} navigate={navigate} />}
      {page === "about" && <About navigate={navigate} />}
      {page === "contact" && <Contact />}
      {page === "invoice" && <Invoice navigate={navigate} />}
    </main>
    <Footer navigate={navigate} />
    {detail && <ItemDialog item={detail} date={date} close={() => setDetail(null)} add={add} />}
    <div className={`toast ${notice ? "visible" : ""}`} role="status" aria-live="polite"><Icon name="check" />{notice}</div>
  </div>;
}

function Header({ page, navigate, count, mobileOpen, setMobileOpen }) {
  const links = [["menu", "Menu"], ["about", "Our story"], ["contact", "Contact"]];
  return <header className="site-header">
    <button className="brand" onClick={() => navigate("menu")} aria-label="Hearth and Harvest home">
      <span className="brand-mark"><Icon name="leaf" size={25} /></span><span><strong>Hearth &amp; Harvest</strong><small>homemade catering</small></span>
    </button>
    <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="site-nav"><Icon name={mobileOpen ? "close" : "menu"} /><span className="sr-only">Menu</span></button>
    <nav id="site-nav" className={mobileOpen ? "open" : ""} aria-label="Main navigation">
      {links.map(([key, label]) => <button key={key} className={page === key ? "active" : ""} onClick={() => navigate(key)}>{label}</button>)}
    </nav>
    <button className="cart-button" onClick={() => navigate("cart")} aria-label={`View cart, ${count} total servings`}><Icon name="cart"/><span>Cart</span>{count > 0 && <b>{count}</b>}</button>
  </header>;
}

function MenuPage({ date, setDate, min, max, menu, add, setDetail, navigate }) {
  const [category, setCategory] = useState("All");
  const filtered = category === "All" ? menu : menu.filter(item => item.category === category);
  return <>
    <section className="hero">
      <div className="eyebrow"><span></span> Small batch, big heart</div>
      <h1>Food that feels<br />like <em>coming home.</em></h1>
      <p>Seasonal, scratch-made dishes prepared with care for your table. Choose your day, build your spread, and we'll have it ready.</p>
      <div className="hero-actions"><a className="primary-btn" href="#daily-menu">Explore the menu <Icon name="arrow" /></a><button className="text-btn" onClick={() => navigate("about")}>Our kitchen story</button></div>
      <div className="hero-note"><Icon name="clock"/><span><strong>Fresh for your gathering</strong>Order 2-14 days ahead · Serves 6-30</span></div>
    </section>
    <section id="daily-menu" className="menu-section">
      <div className="section-heading">
        <div><p className="kicker">Plan your gathering</p><h2>What's cooking?</h2><p>Every day brings a different table. Pick your pickup date to see the full menu.</p></div>
        <label className="date-picker" htmlFor="pickup-date"><span>Pickup date</span><input id="pickup-date" type="date" value={date} min={min} max={max} onChange={e => setDate(e.target.value)} /></label>
      </div>
      <div className="menu-toolbar">
        <div><span className="day-dot"></span><strong>{weekdays[new Date(`${date}T12:00:00`).getDay()]}'s menu</strong><small>{formatDate(date, { weekday: undefined, year: "numeric" })} · 10 dishes</small></div>
        <div className="filters" aria-label="Filter menu">{["All", "Protein", "Vegetarian", "Side"].map(item => <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item === "Side" ? "Sides" : item}</button>)}</div>
      </div>
      <div className="menu-grid">{filtered.map((item, index) => <FoodCard item={item} key={item.id} index={index} add={add} detail={() => setDetail(item)} />)}</div>
    </section>
    <section className="process-strip"><p className="kicker">From our kitchen to your table</p><h2>Gathering made simple.</h2><div className="steps">{[["01", "Choose your day", "Browse the menu made especially for your pickup date."], ["02", "Build your spread", "Select dishes and portions for groups of 6 to 30."], ["03", "Pick up & enjoy", "We'll have everything packed, warm, and ready to share."]].map(step => <article key={step[0]}><span>{step[0]}</span><h3>{step[1]}</h3><p>{step[2]}</p></article>)}</div></section>
  </>;
}

function FoodCard({ item, index, add, detail }) {
  return <article className={`food-card ${index === 0 ? "featured" : ""}`}>
    <button className="food-image" onClick={detail} aria-label={`View details for ${item.name}`}><img src={item.image} alt={`${item.name}, freshly prepared`} /><span>{item.category}</span></button>
    <div className="food-copy"><div><button className="food-title" onClick={detail}>{item.name}</button><p>{item.description}</p></div><div className="food-bottom"><strong>{money.format(item.price)} <small>/ guest</small></strong><button className="add-button" onClick={() => add(item)} aria-label={`Add ${item.name} for 6 guests`}><Icon name="plus" /></button></div></div>
  </article>;
}

function ItemDialog({ item, date, close, add }) {
  const [quantity, setQuantity] = useState(6); const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); document.body.classList.add("locked"); return () => document.body.classList.remove("locked"); }, []);
  useEffect(() => { const handler = e => e.key === "Escape" && close(); document.addEventListener("keydown", handler); return () => document.removeEventListener("keydown", handler); }, [close]);
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && close()}><section className="item-modal" role="dialog" aria-modal="true" aria-labelledby="item-title" ref={ref} tabIndex="-1">
    <button className="modal-close" onClick={close} aria-label="Close item details"><Icon name="close" /></button><img src={item.image} alt={`${item.name}, freshly prepared`} />
    <div className="modal-content"><p className="kicker">{item.category} · {formatDate(date)}</p><h2 id="item-title">{item.name}</h2><p className="description">{item.description}</p><h3>What's inside</h3><p>{item.ingredients}</p>
      <h3>Nutrition facts <small>per serving</small></h3><div className="nutrition">{Object.entries(item.nutrition).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}{key === "calories" ? "" : "g"}</strong></div>)}</div>
      <div className="modal-order"><div className="stepper"><button onClick={() => setQuantity(Math.max(6, quantity - 1))} disabled={quantity === 6} aria-label="Decrease guests"><Icon name="minus" /></button><span><strong>{quantity}</strong><small>guests</small></span><button onClick={() => setQuantity(Math.min(30, quantity + 1))} disabled={quantity === 30} aria-label="Increase guests"><Icon name="plus" /></button></div><button className="primary-btn" onClick={() => add(item, quantity)}>Add · {money.format(item.price * quantity)}</button></div>
    </div></section></div>;
}

function CartPage({ cart, update, remove, navigate }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <section className="page-shell cart-page"><p className="kicker">Your gathering</p><h1>Your cart</h1>{!cart.length ? <EmptyCart navigate={navigate} /> : <div className="cart-layout"><div className="cart-list">{cart.map((item, index) => <article className="cart-row" key={`${item.id}-${item.date}`}><img src={item.image} alt={`${item.name}, freshly prepared`}/><div className="cart-info"><small>{item.category} · {formatDate(item.date, { weekday: undefined })}</small><h2>{item.name}</h2><p>{money.format(item.price)} per guest</p><button className="remove-link" onClick={() => remove(index)}><Icon name="trash" size={17}/> Remove</button></div><label className="quantity-input" htmlFor={`cart-quantity-${index}`}><span>Guests</span><input id={`cart-quantity-${index}`} type="number" min="6" max="30" value={item.quantity} onChange={e => update(index, Number(e.target.value))}/></label><strong>{money.format(item.price * item.quantity)}</strong></article>)}</div><aside className="summary-card"><h2>Order summary</h2><div><span>Subtotal</span><strong>{money.format(subtotal)}</strong></div><div><span>Pickup</span><strong>Free</strong></div><div className="total"><span>Estimated total</span><strong>{money.format(subtotal)}</strong></div><p>Final payment is collected at pickup. No card will be charged online.</p><button className="primary-btn full" onClick={() => navigate("checkout")}>Continue to checkout <Icon name="arrow"/></button><button className="text-btn full" onClick={() => navigate("menu")}>Keep browsing</button></aside></div>}</section>;
}

function EmptyCart({ navigate }) { return <div className="empty-state"><span><Icon name="leaf" size={38}/></span><h2>Your table is waiting</h2><p>Add a few homemade favorites to start planning your gathering.</p><button className="primary-btn" onClick={() => navigate("menu")}>Browse the menu</button></div>; }

function Checkout({ cart, setCart, navigate }) {
  const [placed, setPlaced] = useState(false); const [error, setError] = useState("");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  function submit(e) {
    e.preventDefault(); if (!cart.length) return navigate("cart");
    const data = new FormData(e.currentTarget); const invoice = { id: `HH-${Date.now().toString().slice(-6)}`, created: new Date().toISOString(), customer: Object.fromEntries(data), items: cart, total };
    try { const invoices = JSON.parse(localStorage.getItem("hearth-invoices") || "[]"); localStorage.setItem("hearth-invoices", JSON.stringify([invoice, ...invoices])); localStorage.setItem("hearth-last-invoice", JSON.stringify(invoice)); setCart([]); setPlaced(true); window.scrollTo(0, 0); } catch { setError("We couldn't save your order on this device. Please check your browser storage and try again."); }
  }
  if (placed) return <Invoice navigate={navigate} />;
  return <section className="page-shell checkout-page"><button className="back-link" onClick={() => navigate("cart")}>← Back to cart</button><p className="kicker">Almost there</p><h1>Pickup details</h1><p className="page-intro">Tell us where to reach you. Payment is collected when you pick up.</p>{error && <p className="form-error" role="alert" aria-live="assertive">{error}</p>}<form onSubmit={submit} className="checkout-layout"><div className="form-card">
    <fieldset><legend>Contact information</legend><div className="field-grid"><label htmlFor="first-name">First name<input id="first-name" name="firstName" autoComplete="given-name" required /></label><label htmlFor="last-name">Last name<input id="last-name" name="lastName" autoComplete="family-name" required /></label><label htmlFor="checkout-email">Email<input id="checkout-email" name="email" type="email" autoComplete="email" required /></label><label htmlFor="checkout-phone">Phone<input id="checkout-phone" name="phone" type="tel" autoComplete="tel" required /></label></div></fieldset>
    <fieldset><legend>Pickup</legend><div className="pickup-box"><Icon name="pin"/><span><strong>Hearth &amp; Harvest Kitchen</strong><small>142 Willow Lane · Cedar Grove</small></span></div><label htmlFor="pickup-time">Preferred pickup time<select id="pickup-time" name="pickupTime" required defaultValue=""><option value="" disabled>Select a time</option><option>11:00 AM - 12:00 PM</option><option>12:00 PM - 1:00 PM</option><option>4:00 PM - 5:00 PM</option><option>5:00 PM - 6:00 PM</option></select></label></fieldset>
    <fieldset><legend>Payment method</legend><label className="radio-card"><input type="radio" name="payment" value="Card at pickup" defaultChecked/><span><strong>Card at pickup</strong><small>We accept all major cards in person</small></span></label><label className="radio-card"><input type="radio" name="payment" value="Cash at pickup"/><span><strong>Cash at pickup</strong><small>Exact change is appreciated</small></span></label></fieldset>
    <fieldset><legend>Special instructions <small>Optional</small></legend><label className="sr-only" htmlFor="instructions">Special instructions</label><textarea id="instructions" name="instructions" rows="4" placeholder="Allergies, packaging requests, or anything else we should know..." /></fieldset>
  </div><aside className="summary-card checkout-summary"><h2>Your order</h2>{cart.map(item => <div className="checkout-item" key={`${item.id}-${item.date}`}><span>{item.quantity}× {item.name}<small>{formatDate(item.date, { weekday: undefined })}</small></span><strong>{money.format(item.quantity * item.price)}</strong></div>)}<div className="total"><span>Total due at pickup</span><strong>{money.format(total)}</strong></div><label className="terms"><input type="checkbox" required/><span>I understand orders require 48 hours' notice and payment is due at pickup.</span></label><button className="primary-btn full" type="submit">Place order <Icon name="arrow"/></button><p className="secure-note">No online payment is processed.</p></aside></form></section>;
}

function Invoice({ navigate }) {
  const invoice = JSON.parse(localStorage.getItem("hearth-last-invoice") || "null");
  if (!invoice) return <section className="page-shell"><EmptyCart navigate={navigate}/></section>;
  return <section className="page-shell confirmation"><div className="success-mark"><Icon name="check" size={34}/></div><p className="kicker">Order received</p><h1>We'll take it from here.</h1><p>A local invoice has been created for <strong>{invoice.customer.email}</strong>. We can't wait to cook for you.</p><article className="invoice" id="invoice"><header><div><span className="brand-mark"><Icon name="leaf"/></span><strong>Hearth &amp; Harvest</strong></div><div><small>INVOICE</small><strong>#{invoice.id}</strong></div></header><div className="invoice-meta"><span><small>ORDERED</small>{new Date(invoice.created).toLocaleDateString()}</span><span><small>PICKUP TIME</small>{invoice.customer.pickupTime}</span><span><small>CUSTOMER</small>{invoice.customer.firstName} {invoice.customer.lastName}</span></div>{invoice.items.map(item => <div className="invoice-line" key={`${item.id}-${item.date}`}><span><strong>{item.name}</strong><small>{item.quantity} guests · {formatDate(item.date, { weekday: undefined })}</small></span><strong>{money.format(item.quantity * item.price)}</strong></div>)}<div className="invoice-total"><span>Total due at pickup</span><strong>{money.format(invoice.total)}</strong></div>{invoice.customer.instructions && <p><strong>Instructions:</strong> {invoice.customer.instructions}</p>}</article><div className="confirmation-actions"><button className="primary-btn" onClick={() => window.print()}>Print invoice</button><button className="text-btn" onClick={() => navigate("menu")}>Return to menu</button></div></section>;
}

function About({ navigate }) { return <>
  <section className="story-hero"><div><p className="kicker">Our kitchen story</p><h1>Made slowly.<br/><em>Shared generously.</em></h1><p>Hearth &amp; Harvest began with a crowded kitchen, a hand-me-down recipe book, and the belief that the best memories are made around a full table.</p></div><img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85" alt="Cook preparing fresh vegetables in a warm kitchen"/></section>
  <section className="story-body"><p className="kicker">A note from our founder</p><blockquote>“I cook the way my grandmother taught me: taste as you go, never rush the good parts, and always make enough for one more.”</blockquote><div className="story-columns"><p>What started as Sunday suppers for friends grew into a little neighborhood kitchen serving gatherings across Cedar Grove. Every menu is built around the seasons and prepared in small batches.</p><p>We source thoughtfully, cook from scratch, and pack every order like it's headed to our own family table. Because to us, homemade isn't a style. It's a promise.</p></div></section>
  <section className="values"><article><Icon name="leaf"/><h2>Season-led</h2><p>Menus inspired by what's fresh, local, and at its best.</p></article><article><Icon name="check"/><h2>Scratch-made</h2><p>Real ingredients, patient methods, and no shortcuts.</p></article><article><Icon name="pin"/><h2>Neighborly</h2><p>Made right here in Cedar Grove for the people around us.</p></article></section>
  <section className="story-cta"><h2>Let us cook for your next gathering.</h2><button className="primary-btn light" onClick={() => navigate("menu")}>See what's cooking <Icon name="arrow"/></button></section>
  </>; }

function Contact() {
  const [sent, setSent] = useState(false);
  return <section className="page-shell contact-page"><div className="contact-intro"><p className="kicker">Come say hello</p><h1>We'd love to<br/><em>hear from you.</em></h1><p>Questions about an order, dietary needs, or planning something special? Reach out. There's a real person on the other end.</p><div className="contact-methods"><a href="tel:+15550147287"><Icon name="phone"/><span><small>Call or text</small>(555) 014-7287</span></a><a href="https://instagram.com" target="_blank" rel="noreferrer"><Icon name="instagram"/><span><small>Follow along</small>@hearthandharvest</span></a><div><Icon name="pin"/><span><small>Pickup kitchen</small>142 Willow Lane, Cedar Grove</span></div></div></div>
    <div className="contact-form-card">{sent ? <div className="sent-state" role="status" aria-live="polite"><span><Icon name="check" size={30}/></span><h2>Message received.</h2><p>Thanks for reaching out. We'll get back to you within one business day.</p><button className="text-btn" onClick={() => setSent(false)}>Send another message</button></div> : <form onSubmit={e => { e.preventDefault(); setSent(true); }}><h2>Send a note</h2><label htmlFor="contact-name">Your name<input id="contact-name" required autoComplete="name" /></label><label htmlFor="contact-email">Email address<input id="contact-email" required type="email" autoComplete="email" /></label><label htmlFor="contact-topic">What can we help with?<select id="contact-topic" required defaultValue=""><option value="" disabled>Choose a topic</option><option>Menu question</option><option>Existing order</option><option>Dietary needs</option><option>Something else</option></select></label><label htmlFor="contact-message">Message<textarea id="contact-message" required rows="5" placeholder="Tell us a little more..." /></label><button className="primary-btn full">Send message <Icon name="arrow"/></button></form>}</div>
  </section>;
}

function Footer({ navigate }) { return <footer><div className="footer-brand"><span className="brand-mark"><Icon name="leaf"/></span><strong>Hearth &amp; Harvest</strong><p>Homemade food for<br/>gathering well.</p></div><div><strong>Explore</strong><button onClick={() => navigate("menu")}>Menu</button><button onClick={() => navigate("about")}>Our story</button><button onClick={() => navigate("contact")}>Contact</button></div><div><strong>Kitchen hours</strong><p>Mon–Fri · 9am–6pm<br/>Sat–Sun · 10am–4pm</p></div><div><strong>Find us</strong><p>142 Willow Lane<br/>Cedar Grove</p><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram ↗</a></div><small className="copyright">© {new Date().getFullYear()} Hearth &amp; Harvest. Made with care.</small></footer>; }

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
