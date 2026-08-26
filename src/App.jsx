import { useEffect, useRef, useState } from 'react';
import { categories, dateInputValue, formatDate, getMenu } from './menuData.js';

const today = new Date();
const minDate = new Date(today); minDate.setDate(today.getDate() + 2);
const maxDate = new Date(today); maxDate.setDate(today.getDate() + 14);
const MIN = dateInputValue(minDate);
const MAX = dateInputValue(maxDate);

const icons = {
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  bag: <><path d="M6 8h12l1 12H5L6 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  leaf: <><path d="M5 21c7-1 13-7 14-16-9 1-15 7-14 16Z" /><path d="M5 21c3-6 7-9 12-13" /></>,
  minus: <path d="M5 12h14" />,
  plus: <><path d="M5 12h14M12 5v14" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></>,
};

function Icon({ name, size = 20 }) {
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
}

function Button({ children, className = '', ...props }) {
  return <button className={`button ${className}`} {...props}>{children}</button>;
}

function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}

function Header({ page, navigate, count }) {
  const [open, setOpen] = useState(false);
  const links = [['menu', 'Menu'], ['about', 'Our story'], ['contact', 'Contact']];
  return <header className="site-header">
    <a className="skip-link" href="#main">Skip to main content</a>
    <div className="header-inner">
      <button className="brand" onClick={() => navigate('menu')} aria-label="Hearth and Harvest home">
        <span className="brand-mark"><Icon name="leaf" size={24} /></span>
        <span><b>Hearth <i>&</i> Harvest</b><small>Homemade catering</small></span>
      </button>
      <button className="menu-toggle" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
      <nav id="primary-nav" className={open ? 'nav open' : 'nav'} aria-label="Primary navigation">
        {links.map(([id, label]) => <button key={id} className={page === id ? 'active' : ''} aria-current={page === id ? 'page' : undefined} onClick={() => { navigate(id); setOpen(false); }}>{label}</button>)}
      </nav>
      <button className="cart-button" onClick={() => navigate('cart')} aria-label={`View cart, ${count} items`}>
        <Icon name="bag" /><span>Cart</span><strong>{count}</strong>
      </button>
    </div>
  </header>;
}

function DatePicker({ date, setDate }) {
  return <section className="date-panel" aria-labelledby="date-heading">
    <div><span className="eyebrow"><Icon name="calendar" size={16} /> Plan your table</span><h2 id="date-heading">When are you gathering?</h2><p>Order 2–14 days ahead. Every day brings a new menu.</p></div>
    <div className="date-control"><label htmlFor="catering-date">Catering date</label><input id="catering-date" type="date" min={MIN} max={MAX} value={date} onChange={(e) => setDate(e.target.value)} /></div>
  </section>;
}

function FoodCard({ item, onDetails, onAdd }) {
  return <article className="food-card">
    <button className="food-image-button" onClick={() => onDetails(item)} aria-label={`View details for ${item.name}`}><img src={item.image} alt={item.imageAlt} /></button>
    <div className="food-content">
      <div className="food-title-row"><div><span className="dietary">{item.dietary || 'House favorite'}</span><h3>{item.name}</h3></div><p className="price">${item.price}<small>/ person</small></p></div>
      <p>{item.description}</p>
      <div className="card-actions"><button className="text-link" onClick={() => onDetails(item)}>View details <span aria-hidden="true">→</span></button><Button onClick={() => onAdd(item)}><Icon name="plus" size={18} /> Add</Button></div>
    </div>
  </article>;
}

function DetailDialog({ item, onClose, onAdd }) {
  const closeRef = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    const close = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [onClose]);
  return <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <button ref={closeRef} className="icon-button dialog-close" onClick={onClose} aria-label="Close food details"><Icon name="close" /></button>
      <div className="dialog-image"><img src={item.image} alt={item.imageAlt} /></div>
      <div className="dialog-body"><span className="eyebrow">{item.category} · {item.dietary || 'House favorite'}</span><h2 id="detail-title">{item.name}</h2><p className="lead">{item.description}</p>
        <h3>What’s inside</h3><p>{item.ingredients}</p>
        <h3>Nutrition facts</h3><p className="nutrition-note">Approximate values per serving</p>
        <dl className="nutrition"><div><dt>Calories</dt><dd>{item.nutrition.calories}</dd></div><div><dt>Protein</dt><dd>{item.nutrition.protein}g</dd></div><div><dt>Carbs</dt><dd>{item.nutrition.carbs}g</dd></div><div><dt>Total fat</dt><dd>{item.nutrition.fat}g</dd></div><div><dt>Sodium</dt><dd>{item.nutrition.sodium}mg</dd></div></dl>
        <div className="dialog-footer"><p><strong>${item.price}</strong> per person<br /><small>6 portion minimum</small></p><Button onClick={() => { onAdd(item); onClose(); }}><Icon name="plus" /> Add 6 portions</Button></div>
      </div>
    </section>
  </div>;
}

function MenuPage({ date, setDate, onAdd }) {
  const [detail, setDetail] = useState(null);
  const menu = getMenu(date);
  return <>
    <section className="hero"><div className="hero-copy"><span className="eyebrow">Portland, Oregon · Since 2018</span><h1>Food that feels<br /><em>like coming home.</em></h1><p>Seasonal, generous meals cooked from scratch for the people around your table.</p><a className="button" href="#daily-menu">Explore today’s menu <Icon name="arrow" /></a></div><div className="hero-image"><img src="https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1400&q=85" alt="A warmly lit table set with a homemade meal" /><span className="hand-note">Made slowly,<br />shared gladly.</span></div></section>
    <DatePicker date={date} setDate={setDate} />
    <section id="daily-menu" className="menu-section" aria-labelledby="menu-heading">
      <div className="section-heading"><div><span className="eyebrow">The daily spread</span><h2 id="menu-heading">Menu for {formatDate(date, { year: undefined })}</h2></div><p>Choose portions for 6–30 guests.<br />Mix, match, and make it yours.</p></div>
      {categories.map((category) => <section className="category" key={category.id} aria-labelledby={`${category.id}-heading`}><div className="category-heading"><h2 id={`${category.id}-heading`}>{category.label}</h2><span>{category.note}</span></div><div className="food-grid">{menu.filter(item => item.category === category.id).map(item => <FoodCard key={item.id} item={item} onDetails={setDetail} onAdd={onAdd} />)}</div></section>)}
    </section>
    <section className="promise"><Icon name="leaf" size={34} /><p>Season-led menus · Thoughtful sourcing · Cooked in small batches</p></section>
    {detail && <DetailDialog item={detail} onClose={() => setDetail(null)} onAdd={onAdd} />}
  </>;
}

function Stepper({ value, onChange, label }) {
  return <div className="stepper" aria-label={`${label} quantity`}><button onClick={() => onChange(value - 1)} disabled={value <= 6} aria-label={`Decrease ${label} portions`}><Icon name="minus" /></button><span aria-live="polite"><strong>{value}</strong><small> portions</small></span><button onClick={() => onChange(value + 1)} disabled={value >= 30} aria-label={`Increase ${label} portions`}><Icon name="plus" /></button></div>;
}

function OrderSummary({ cart, date, compact = false }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const service = subtotal * 0.08;
  return <aside className={`order-summary ${compact ? 'compact' : ''}`} aria-label="Order summary"><span className="eyebrow">Your gathering</span><h2>Order summary</h2><p className="summary-date"><Icon name="calendar" /> {formatDate(date, { year: undefined })}</p><dl>{cart.map(item => <div key={item.id}><dt>{item.name} × {item.quantity}</dt><dd>${(item.price * item.quantity).toFixed(2)}</dd></div>)}<div><dt>Service & preparation</dt><dd>${service.toFixed(2)}</dd></div><div className="total"><dt>Total</dt><dd>${(subtotal + service).toFixed(2)}</dd></div></dl>{!compact && <p className="summary-note">No payment is taken online. We’ll confirm your order and payment details by phone.</p>}</aside>;
}

function CartPage({ cart, date, updateQuantity, remove, navigate }) {
  if (!cart.length) return <section className="empty-state"><span className="brand-mark"><Icon name="bag" /></span><h1>Your basket is waiting</h1><p>Pick a date and add homemade favorites for your gathering.</p><Button onClick={() => navigate('menu')}>Browse the menu <Icon name="arrow" /></Button></section>;
  return <section className="page cart-page"><div className="breadcrumb"><button onClick={() => navigate('menu')}>Menu</button><span aria-hidden="true">/</span><span>Cart</span></div><div className="page-title"><span className="eyebrow">Nearly there</span><h1>Your catering cart</h1><p>Review portions before sharing your pickup details.</p></div><div className="cart-layout"><div className="cart-items">{cart.map(item => <article className="cart-item" key={item.id}><img src={item.image} alt="" /><div className="cart-item-info"><span className="dietary">{item.category}</span><h2>{item.name}</h2><p>${item.price} per person</p><button className="remove" onClick={() => remove(item.id)}><Icon name="trash" size={17} /> Remove {item.name}</button></div><Stepper value={item.quantity} label={item.name} onChange={(quantity) => updateQuantity(item.id, quantity)} /><strong className="line-price">${(item.price * item.quantity).toFixed(2)}</strong></article>)}<div className="cart-continue"><button className="text-link" onClick={() => navigate('menu')}>← Add more dishes</button><span>Portion limits: 6 minimum · 30 maximum</span></div></div><div><OrderSummary cart={cart} date={date} /><Button className="checkout-button" onClick={() => navigate('checkout')}>Continue to checkout <Icon name="arrow" /></Button></div></div></section>;
}

function Field({ label, id, required = false, hint, children }) {
  return <div className="field"><label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>{hint && <small id={`${id}-hint`}>{hint}</small>}{children}</div>;
}

function CheckoutPage({ cart, date, navigate, placeOrder }) {
  const [submitted, setSubmitted] = useState(false);
  if (!cart.length) return <section className="empty-state"><h1>Your cart is empty</h1><p>Add dishes before continuing to checkout.</p><Button onClick={() => navigate('menu')}>Browse the menu</Button></section>;
  const submit = (e) => {
    e.preventDefault(); setSubmitted(true);
    if (!e.currentTarget.checkValidity()) { e.currentTarget.reportValidity(); return; }
    placeOrder(Object.fromEntries(new FormData(e.currentTarget)));
  };
  return <section className="page checkout-page"><div className="breadcrumb"><button onClick={() => navigate('cart')}>Cart</button><span aria-hidden="true">/</span><span>Checkout</span></div><div className="page-title"><span className="eyebrow">Final details</span><h1>Let’s plan your pickup</h1><p>Fields marked with an asterisk are required.</p></div><div className="checkout-layout"><form id="checkout-form" noValidate={false} onSubmit={submit} className={submitted ? 'was-submitted' : ''}>
    <fieldset><legend><span>01</span> Contact information</legend><div className="field-grid"><Field label="First name" id="firstName" required><input id="firstName" name="firstName" autoComplete="given-name" required /></Field><Field label="Last name" id="lastName" required><input id="lastName" name="lastName" autoComplete="family-name" required /></Field><Field label="Email address" id="email" required><input id="email" name="email" type="email" autoComplete="email" required /></Field><Field label="Phone number" id="phone" required><input id="phone" name="phone" type="tel" autoComplete="tel" required /></Field></div></fieldset>
    <fieldset><legend><span>02</span> Pickup</legend><div className="pickup-card"><Icon name="calendar" /><div><strong>{formatDate(date)}</strong><p>Hearth & Harvest Kitchen<br />1824 SE Alder Street, Portland, OR</p></div></div><Field label="Pickup time" id="pickupTime" required><select id="pickupTime" name="pickupTime" required defaultValue=""><option value="" disabled>Choose a time</option><option>10:00 AM</option><option>11:00 AM</option><option>12:00 PM</option><option>1:00 PM</option><option>2:00 PM</option><option>3:00 PM</option><option>4:00 PM</option></select></Field></fieldset>
    <fieldset><legend><span>03</span> Payment preference</legend><p className="legend-note">No payment is processed on this website.</p><div className="radio-cards"><label><input type="radio" name="payment" value="Card by phone" required /><span><strong>Card by phone</strong><small>We’ll call to securely collect payment.</small></span></label><label><input type="radio" name="payment" value="Pay at pickup" required /><span><strong>Pay at pickup</strong><small>Card or cash accepted at collection.</small></span></label></div></fieldset>
    <fieldset><legend><span>04</span> A few final notes</legend><Field label="Special instructions" id="instructions" hint="Tell us about allergies, access needs, or pickup notes."><textarea id="instructions" name="instructions" rows="5" aria-describedby="instructions-hint" /></Field><label className="check-field"><input type="checkbox" name="terms" required /><span>I’ve reviewed my order and understand Hearth & Harvest will contact me to confirm it. *</span></label></fieldset>
    <Button type="submit" className="place-order">Place order <Icon name="arrow" /></Button>
  </form><OrderSummary cart={cart} date={date} compact /></div></section>;
}

function InvoicePage({ order, navigate }) {
  if (!order) return <section className="empty-state"><h1>No recent invoice</h1><Button onClick={() => navigate('menu')}>Return to menu</Button></section>;
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0); const service = subtotal * .08;
  return <section className="page invoice-page"><div className="success-heading"><span className="success-icon"><Icon name="check" size={32} /></span><span className="eyebrow">Order received</span><h1>Your table is on our calendar.</h1><p>A confirmation has been prepared for {order.customer.email}. We’ll call within one business day to confirm payment.</p></div><article className="invoice"><header><div className="brand invoice-brand"><span className="brand-mark"><Icon name="leaf" /></span><span><b>Hearth <i>&</i> Harvest</b><small>Homemade catering</small></span></div><div><span>Invoice</span><strong>#{order.number}</strong></div></header><div className="invoice-meta"><div><span>Prepared for</span><strong>{order.customer.firstName} {order.customer.lastName}</strong><p>{order.customer.email}<br />{order.customer.phone}</p></div><div><span>Pickup</span><strong>{formatDate(order.date, { year: undefined })}</strong><p>{order.customer.pickupTime}<br />1824 SE Alder Street</p></div></div><table><caption>Ordered food items</caption><thead><tr><th scope="col">Dish</th><th scope="col">Portions</th><th scope="col">Price</th></tr></thead><tbody>{order.items.map(item => <tr key={item.id}><th scope="row">{item.name}<small>${item.price} per person</small></th><td>{item.quantity}</td><td>${(item.price * item.quantity).toFixed(2)}</td></tr>)}</tbody><tfoot><tr><th colSpan="2">Subtotal</th><td>${subtotal.toFixed(2)}</td></tr><tr><th colSpan="2">Service & preparation</th><td>${service.toFixed(2)}</td></tr><tr><th colSpan="2">Total</th><td>${(subtotal + service).toFixed(2)}</td></tr></tfoot></table>{order.customer.instructions && <div className="invoice-notes"><strong>Special instructions</strong><p>{order.customer.instructions}</p></div>}<footer>Payment preference: {order.customer.payment} · Confirmation pending</footer></article><div className="invoice-actions"><Button onClick={() => window.print()}>Print invoice</Button><button className="text-link" onClick={() => navigate('menu')}>Return to menu</button></div></section>;
}

function AboutPage({ navigate }) {
  return <section className="story-page"><div className="story-hero"><div><span className="eyebrow">Our story</span><h1>A neighborhood kitchen with a seat saved for you.</h1><p>We believe the best meals aren’t complicated. They’re generous, seasonal, and made by someone who cares.</p></div><img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85" alt="A cook preparing vegetables in a bright home kitchen" /></div><div className="story-body"><div className="story-quote"><span>“</span><blockquote>Food should make people feel looked after.</blockquote><p>— Maya Bennett, founder & head cook</p></div><div className="story-copy"><h2>From our stove to your table</h2><p>Hearth & Harvest began in 2018, after years of feeding neighbors from a little yellow kitchen in southeast Portland. What started as Sunday suppers grew through word of mouth, one shared table at a time.</p><p>Today, we’re still a small team. We source thoughtfully, cook in small batches, and build each daily menu around what’s best at the market. No shortcuts, no mystery ingredients—just honest food made for gathering.</p><h2>What guides us</h2><ul className="values"><li><Icon name="leaf" /><span><strong>Season first</strong>We follow local harvests for better flavor and less waste.</span></li><li><Icon name="check" /><span><strong>Made here</strong>Every sauce, roast, and side starts from scratch in our kitchen.</span></li><li><Icon name="bag" /><span><strong>Gather generously</strong>Portions are abundant and menus are meant for sharing.</span></li></ul><Button onClick={() => navigate('menu')}>See what’s cooking <Icon name="arrow" /></Button></div></div></section>;
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  return <section className="page contact-page"><div className="contact-intro"><span className="eyebrow">Get in touch</span><h1>We’d love to hear what you’re planning.</h1><p>Questions about a menu, allergies, or a particularly special table? Reach out. A real person from our kitchen will respond within one business day.</p><div className="contact-methods"><a href="tel:+15035550184"><span>Call us</span><strong>(503) 555-0184</strong></a><a href="mailto:hello@hearthandharvest.com"><span>Email us</span><strong>hello@hearthandharvest.com</strong></a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><span>Follow along</span><strong>@hearthandharvest</strong></a></div><p className="hours"><strong>Kitchen hours</strong><br />Monday–Saturday, 8:00 AM–5:00 PM<br />Sunday, 9:00 AM–2:00 PM</p></div><div className="contact-form-wrap">{sent ? <div className="sent-message" role="status"><span className="success-icon"><Icon name="check" /></span><h2>Your note is on its way.</h2><p>Thanks for reaching out. We’ll be in touch within one business day.</p><Button onClick={() => setSent(false)}>Send another message</Button></div> : <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}><h2>Send a note</h2><Field label="Your name" id="contact-name" required><input id="contact-name" name="name" autoComplete="name" required /></Field><Field label="Email address" id="contact-email" required><input id="contact-email" name="email" type="email" autoComplete="email" required /></Field><Field label="Phone number" id="contact-phone"><input id="contact-phone" name="phone" type="tel" autoComplete="tel" /></Field><Field label="What can we help with?" id="topic" required><select id="topic" name="topic" required defaultValue=""><option value="" disabled>Choose a topic</option><option>Menu question</option><option>Dietary or allergy question</option><option>Existing order</option><option>Something else</option></select></Field><Field label="Message" id="message" required><textarea id="message" name="message" rows="6" required /></Field><Button type="submit">Send message <Icon name="arrow" /></Button></form>}</div></section>;
}

function Footer({ navigate }) {
  return <footer className="site-footer"><div className="footer-brand"><div className="brand"><span className="brand-mark"><Icon name="leaf" /></span><span><b>Hearth <i>&</i> Harvest</b><small>Homemade catering</small></span></div><p>Food made with care,<br />for tables filled with people.</p></div><div><h2>Explore</h2><button onClick={() => navigate('menu')}>Daily menu</button><button onClick={() => navigate('about')}>Our story</button><button onClick={() => navigate('contact')}>Contact</button></div><div><h2>Visit</h2><p>1824 SE Alder Street<br />Portland, OR 97214</p><a href="tel:+15035550184">(503) 555-0184</a></div><div><h2>Stay in the loop</h2><p>Seasonal menus and kitchen notes,<br />sent occasionally.</p><form className="subscribe" onSubmit={(e) => e.preventDefault()}><label className="sr-only" htmlFor="subscribe-email">Email address</label><input id="subscribe-email" type="email" autoComplete="email" placeholder="Email address" required /><button aria-label="Subscribe to kitchen notes"><Icon name="arrow" /></button></form></div><p className="copyright">© 2026 Hearth & Harvest Catering. Made thoughtfully in Portland.</p></footer>;
}

export default function App() {
  const [page, setPage] = useState(() => location.hash.slice(1) || 'menu');
  const [date, setDate] = useState(MIN);
  const [cart, setCart] = useStoredState('hh-cart', []);
  const [latestOrder, setLatestOrder] = useStoredState('hh-latest-order', null);
  const [notice, setNotice] = useState('');
  const navigate = (next) => { location.hash = next; setPage(next); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  useEffect(() => { const hash = () => setPage(location.hash.slice(1) || 'menu'); addEventListener('hashchange', hash); return () => removeEventListener('hashchange', hash); }, []);
  useEffect(() => { document.title = `${({ menu: 'Menu', cart: 'Cart', checkout: 'Checkout', invoice: 'Invoice', about: 'Our Story', contact: 'Contact' })[page] || 'Menu'} | Hearth & Harvest`; }, [page]);
  const changeDate = (nextDate) => {
    if (cart.length && nextDate !== date && !window.confirm('Changing the catering date will clear your cart because each day has a different menu. Continue?')) return;
    if (cart.length && nextDate !== date) setCart([]);
    setDate(nextDate);
  };
  const add = (item) => { setCart(current => { const found = current.find(x => x.id === item.id); return found ? current.map(x => x.id === item.id ? { ...x, quantity: Math.min(30, x.quantity + 6) } : x) : [...current, { ...item, quantity: 6 }]; }); setNotice(`${item.name} added to cart with 6 portions.`); };
  const placeOrder = (customer) => { const order = { number: `HH-${Date.now().toString().slice(-6)}`, createdAt: new Date().toISOString(), date, items: cart, customer }; const existing = JSON.parse(localStorage.getItem('hh-invoices') || '[]'); localStorage.setItem('hh-invoices', JSON.stringify([order, ...existing])); setLatestOrder(order); setCart([]); navigate('invoice'); };
  const pages = { menu: <MenuPage date={date} setDate={changeDate} onAdd={add} />, cart: <CartPage cart={cart} date={date} navigate={navigate} updateQuantity={(id, quantity) => setCart(cart.map(x => x.id === id ? { ...x, quantity } : x))} remove={(id) => setCart(cart.filter(x => x.id !== id))} />, checkout: <CheckoutPage cart={cart} date={date} navigate={navigate} placeOrder={placeOrder} />, invoice: <InvoicePage order={latestOrder} navigate={navigate} />, about: <AboutPage navigate={navigate} />, contact: <ContactPage /> };
  return <><Header page={page} navigate={navigate} count={cart.length} /><div className="live-region" aria-live="polite">{notice}</div><main id="main" tabIndex="-1">{pages[page] || pages.menu}</main><Footer navigate={navigate} /></>;
}
