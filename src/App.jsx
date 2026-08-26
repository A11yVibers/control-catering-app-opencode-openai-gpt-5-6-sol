import { useEffect, useMemo, useState } from 'react'
import { categoryCopy, menus } from './data'

const DAY = 86400000

function toInputDate(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

function upcomingDates() {
  return Array.from({ length: 13 }, (_, index) => {
    const date = new Date()
    date.setHours(12, 0, 0, 0)
    date.setTime(date.getTime() + (index + 2) * DAY)
    return date
  })
}

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function dateLabel(value, long = false) {
  const date = typeof value === 'string' ? new Date(`${value}T12:00:00`) : value
  return new Intl.DateTimeFormat('en-US', long
    ? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    : { weekday: 'short', month: 'short', day: 'numeric' }).format(date)
}

function Icon({ name, size = 20 }) {
  const paths = {
    cart: <><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    minus: <path d="M5 12h14"/>,
    plus: <><path d="M5 12h14M12 5v14"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  }
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Header({ page, setPage, cartCount, openCart }) {
  return <header className="site-header">
    <button className="brand" onClick={() => setPage('menu')} aria-label="Hearth and Harvest home">
      <span className="brand-mark">H<span>&</span>H</span>
      <span className="brand-name">Hearth <i>&</i> Harvest<small>Homemade Catering</small></span>
    </button>
    <nav aria-label="Main navigation">
      {['menu', 'about', 'contact'].map((item) => <button key={item} className={page === item ? 'active' : ''} onClick={() => setPage(item)}>{item}</button>)}
    </nav>
    <button className="cart-button" onClick={openCart}><Icon name="cart"/><span>Cart</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
  </header>
}

function DatePicker({ dates, selectedDate, onSelect }) {
  return <section className="date-section" aria-labelledby="date-heading">
    <div className="eyebrow">Plan your gathering</div>
    <div className="date-heading-row">
      <div>
        <h1 id="date-heading">What are we cooking for you?</h1>
        <p>Choose a pickup date. Orders open 2–14 days in advance.</p>
      </div>
      <label className="calendar-field">Jump to date
        <input type="date" min={toInputDate(dates[0])} max={toInputDate(dates.at(-1))} value={selectedDate} onChange={(event) => onSelect(event.target.value)} />
      </label>
    </div>
    <div className="date-strip">
      {dates.slice(0, 7).map((date) => {
        const value = toInputDate(date)
        return <button key={value} className={selectedDate === value ? 'selected' : ''} onClick={() => onSelect(value)}>
          <span>{new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)}</span>
          <strong>{date.getDate()}</strong>
          <small>{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)}</small>
        </button>
      })}
    </div>
  </section>
}

function MenuCard({ item, onSelect, onAdd }) {
  return <article className="menu-card">
    <button className="card-image" onClick={() => onSelect(item)} aria-label={`View ${item.name}`}>
      <img src={item.image} alt="" />
      {item.category === 'Vegetarian' && <span className="diet-tag">Vegetarian</span>}
    </button>
    <div className="card-content">
      <button className="card-title" onClick={() => onSelect(item)}><h3>{item.name}</h3></button>
      <p>{item.description}</p>
      <div className="card-footer">
        <span><strong>{money(item.price)}</strong> / person</span>
        <button className="round-add" onClick={() => onAdd(item)} aria-label={`Add ${item.name}`}><Icon name="plus"/></button>
      </div>
    </div>
  </article>
}

function MenuPage({ dates, selectedDate, onDateSelect, items, onSelect, onAdd }) {
  return <main>
    <DatePicker dates={dates} selectedDate={selectedDate} onSelect={onDateSelect} />
    <div className="menu-intro">
      <div><span className="eyebrow">{dateLabel(selectedDate)}</span><h2>Today’s table</h2></div>
      <p>Made from scratch in small batches. Select any dish for ingredients and nutrition.</p>
    </div>
    {Object.keys(categoryCopy).map((category) => {
      const categoryItems = items.filter((item) => item.category === category)
      return <section className="menu-category" key={category}>
        <div className="category-heading"><h2>{category}</h2><span>{categoryItems.length} choices</span><p>{categoryCopy[category]}</p></div>
        <div className="card-grid">{categoryItems.map((item) => <MenuCard key={item.id} item={item} onSelect={onSelect} onAdd={onAdd} />)}</div>
      </section>
    })}
  </main>
}

function ItemDialog({ item, onClose, onAdd }) {
  if (!item) return null
  const [calories, protein, carbs, fat] = item.nutrition
  return <div className="overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="item-dialog" role="dialog" aria-modal="true" aria-labelledby="item-name">
      <button className="dialog-close" onClick={onClose} aria-label="Close"><Icon name="close"/></button>
      <div className="dialog-photo"><img src={item.image} alt={item.name}/><span>{item.category}</span></div>
      <div className="dialog-body">
        <span className="eyebrow">From today’s kitchen</span><h2 id="item-name">{item.name}</h2><p className="dialog-description">{item.description}. Prepared by hand and packed ready to warm and serve.</p>
        <div className="detail-block"><h3>What’s inside</h3><div className="ingredient-list">{item.ingredients.map((ingredient) => <span key={ingredient}>{ingredient}</span>)}</div></div>
        <div className="detail-block"><h3>Nutrition facts <small>per serving</small></h3><div className="nutrition"><div><strong>{calories}</strong><span>Calories</span></div><div><strong>{protein}</strong><span>Protein</span></div><div><strong>{carbs}</strong><span>Carbs</span></div><div><strong>{fat}</strong><span>Total fat</span></div></div></div>
        <p className="allergen-note">Prepared in a kitchen that handles dairy, eggs, wheat, soy, peanuts, and tree nuts.</p>
        <div className="dialog-action"><span><strong>{money(item.price)}</strong> / person</span><button className="primary" onClick={() => { onAdd(item); onClose() }}>Add to order <Icon name="arrow"/></button></div>
      </div>
    </div>
  </div>
}

function Quantity({ value, onChange }) {
  return <div className="quantity"><button onClick={() => onChange(value - 1)} disabled={value <= 6}><Icon name="minus" size={16}/></button><span>{value}</span><button onClick={() => onChange(value + 1)} disabled={value >= 30}><Icon name="plus" size={16}/></button></div>
}

function CartDrawer({ open, onClose, cart, updateQuantity, removeItem, selectedDate, checkout }) {
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0)
  return <><div className={`drawer-scrim ${open ? 'open' : ''}`} onClick={onClose}/><aside className={`cart-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
    <div className="drawer-header"><div><span className="eyebrow">Your gathering</span><h2>Order basket</h2></div><button onClick={onClose} aria-label="Close cart"><Icon name="close"/></button></div>
    <div className="pickup-note"><Icon name="clock"/><span>Pickup <strong>{dateLabel(selectedDate, true)}</strong></span></div>
    <div className="cart-lines">
      {cart.length === 0 ? <div className="empty-cart"><span className="empty-doodle">H&H</span><h3>Your table is waiting</h3><p>Add a few homemade favorites from the menu.</p><button className="text-link" onClick={onClose}>Browse the menu <Icon name="arrow"/></button></div> : cart.map((line) => <div className="cart-line" key={line.id}>
        <img src={line.image} alt=""/><div><h3>{line.name}</h3><span>{money(line.price)} per person</span><div className="line-controls"><Quantity value={line.quantity} onChange={(value) => updateQuantity(line.id, value)}/><button className="remove" onClick={() => removeItem(line.id)} aria-label={`Remove ${line.name}`}><Icon name="trash" size={17}/></button></div></div><strong>{money(line.price * line.quantity)}</strong>
      </div>)}
    </div>
    {cart.length > 0 && <div className="drawer-footer"><div className="subtotal"><span>Estimated subtotal</span><strong>{money(subtotal)}</strong></div><p>Final total shown before placing your order.</p><button className="primary wide" onClick={checkout}>Continue to checkout <Icon name="arrow"/></button></div>}
  </aside></>
}

function CheckoutPage({ cart, selectedDate, onBack, onPlaced }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', pickup: '4:00 PM', payment: 'Pay at pickup', instructions: '' })
  const [submitted, setSubmitted] = useState(false)
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0)
  const tax = subtotal * 0.06
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  function submit(event) {
    event.preventDefault()
    setSubmitted(true)
    if (!event.currentTarget.reportValidity()) return
    const invoice = {
      id: `HH-${Date.now().toString().slice(-7)}`,
      createdAt: new Date().toISOString(),
      pickupDate: selectedDate,
      customer: form,
      items: cart,
      subtotal,
      tax,
      total: subtotal + tax,
    }
    const stored = JSON.parse(localStorage.getItem('hh-invoices') || '[]')
    localStorage.setItem('hh-invoices', JSON.stringify([invoice, ...stored]))
    onPlaced(invoice)
  }
  return <main className="checkout-page">
    <button className="back-link" onClick={onBack}>← Back to menu</button>
    <div className="checkout-title"><span className="eyebrow">Almost to the table</span><h1>Checkout</h1><p>No online charge today. We’ll confirm your order and pickup details by email.</p></div>
    <form className={`checkout-layout ${submitted ? 'validated' : ''}`} onSubmit={submit} noValidate>
      <div className="checkout-forms">
        <section className="form-card"><div className="step-number">1</div><div className="form-card-body"><h2>Contact information</h2><p>Who should we contact about this order?</p><div className="field-grid"><label className="full">Full name<input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name"/></label><label>Email<input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com"/></label><label>Phone<input required type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(555) 000-0000"/></label></div></div></section>
        <section className="form-card"><div className="step-number">2</div><div className="form-card-body"><h2>Pickup details</h2><p>{dateLabel(selectedDate, true)} at our Maple Street kitchen.</p><label>Pickup window<select value={form.pickup} onChange={(e) => update('pickup', e.target.value)}><option>3:00 PM</option><option>4:00 PM</option><option>5:00 PM</option><option>6:00 PM</option></select></label></div></section>
        <section className="form-card"><div className="step-number">3</div><div className="form-card-body"><h2>Payment preference</h2><p>Payment is collected when we confirm your order or at pickup.</p><div className="radio-group">{['Pay at pickup', 'Call me for card details'].map((value) => <label key={value} className={form.payment === value ? 'checked' : ''}><input type="radio" name="payment" value={value} checked={form.payment === value} onChange={(e) => update('payment', e.target.value)}/><span><b>{form.payment === value && <Icon name="check" size={15}/>}</b>{value}</span></label>)}</div></div></section>
        <section className="form-card"><div className="step-number">4</div><div className="form-card-body"><h2>A note for the kitchen</h2><p>Tell us about allergies, timing, or anything else we should know.</p><label>Special instructions<textarea value={form.instructions} onChange={(e) => update('instructions', e.target.value)} placeholder="Optional notes for our team" rows="4"/></label></div></section>
      </div>
      <aside className="order-summary"><span className="eyebrow">Order summary</span><h2>{dateLabel(selectedDate)}</h2>{cart.map((line) => <div className="summary-line" key={line.id}><span>{line.quantity}× {line.name}</span><strong>{money(line.quantity * line.price)}</strong></div>)}<div className="summary-totals"><div><span>Subtotal</span><span>{money(subtotal)}</span></div><div><span>Estimated tax</span><span>{money(tax)}</span></div><div className="summary-total"><strong>Total</strong><strong>{money(subtotal + tax)}</strong></div></div><button className="primary wide" type="submit">Place my order <Icon name="arrow"/></button><small>By placing your order, you agree to receive order updates by email or phone.</small></aside>
    </form>
  </main>
}

function InvoicePage({ invoice, setPage }) {
  return <main className="invoice-page">
    <div className="success-mark"><Icon name="check" size={34}/></div><span className="eyebrow">Order received</span><h1>Your gathering is on our calendar.</h1><p className="success-copy">A confirmation has been prepared for <strong>{invoice.customer.email}</strong>. We’ll be in touch within one business day.</p>
    <section className="invoice"><div className="invoice-top"><div className="brand-name">Hearth <i>&</i> Harvest<small>Homemade Catering</small></div><div><span>Invoice</span><strong>#{invoice.id}</strong></div></div><div className="invoice-meta"><div><span>Pickup date</span><strong>{dateLabel(invoice.pickupDate, true)}</strong><small>{invoice.customer.pickup} · Maple Street kitchen</small></div><div><span>Prepared for</span><strong>{invoice.customer.name}</strong><small>{invoice.customer.phone}</small></div></div><div className="invoice-items">{invoice.items.map((item) => <div key={item.id}><span><strong>{item.name}</strong><small>{item.quantity} servings × {money(item.price)}</small></span><strong>{money(item.quantity * item.price)}</strong></div>)}</div><div className="invoice-total"><span>Total due at pickup</span><strong>{money(invoice.total)}</strong></div>{invoice.customer.instructions && <div className="invoice-note"><strong>Kitchen note</strong><p>{invoice.customer.instructions}</p></div>}<div className="invoice-foot">Invoice saved locally on this device for business records.</div></section>
    <button className="primary" onClick={() => setPage('menu')}>Return to menu</button>
  </main>
}

function AboutPage({ setPage }) {
  return <main className="story-page">
    <section className="story-hero"><div><span className="eyebrow">Our kitchen, your table</span><h1>Food that feels like someone made it just for you.</h1><p>Because we did. Hearth & Harvest is a small, family-run kitchen making generous meals for everyday gatherings and meaningful celebrations.</p><button className="primary" onClick={() => setPage('menu')}>See this week’s menu <Icon name="arrow"/></button></div><div className="story-image"><img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85" alt="Cook preparing a meal in a home kitchen"/><span>Made by hand<br/>since 2018</span></div></section>
    <section className="values"><span className="eyebrow">What matters here</span><h2>Simple values. Seriously good food.</h2><div><article><b>01</b><h3>Cooked from scratch</h3><p>Stocks simmer, vegetables roast, and sauces start with real ingredients every morning.</p></article><article><b>02</b><h3>Season-led menus</h3><p>Our menu changes through the week to make the most of what’s fresh and delicious.</p></article><article><b>03</b><h3>Made for gathering</h3><p>Every dish travels well, serves generously, and arrives ready for your table.</p></article></div></section>
    <section className="quote-section"><blockquote>“The best meals don’t need to be fussy. They need to be generous, thoughtfully made, and shared.”</blockquote><span>— Mara, founder & head cook</span></section>
  </main>
}

function ContactPage() {
  const [sent, setSent] = useState(false)
  return <main className="contact-page"><section className="contact-intro"><span className="eyebrow">Let’s talk food</span><h1>We’d love to hear what you’re planning.</h1><p>Questions about the menu, an ingredient, or a special gathering? Reach out and we’ll get back to you within one business day.</p><div className="contact-methods"><a href="tel:+15550142772"><Icon name="phone"/><span><small>Call or text</small>(555) 014-2772</span></a><a href="mailto:hello@hearthandharvest.com"><Icon name="mail"/><span><small>Email us</small>hello@hearthandharvest.com</span></a><a href="https://instagram.com" target="_blank" rel="noreferrer"><span className="social-icon">ig</span><span><small>Follow along</small>@hearthandharvest</span></a></div><div className="hours"><Icon name="pin"/><div><strong>Pickup kitchen</strong><span>118 Maple Street · Your Town, USA</span></div><Icon name="clock"/><div><strong>Kitchen hours</strong><span>Tuesday–Sunday · 9am–6pm</span></div></div></section><section className="contact-form-wrap">{sent ? <div className="message-sent"><div className="success-mark"><Icon name="check" size={30}/></div><h2>Your note is on its way.</h2><p>Thanks for reaching out. We’ll get back to you within one business day.</p><button className="text-link" onClick={() => setSent(false)}>Send another message</button></div> : <form onSubmit={(e) => { e.preventDefault(); setSent(true) }}><span className="eyebrow">Send a note</span><h2>How can we help?</h2><label>Your name<input required placeholder="Your name"/></label><label>Email address<input required type="email" placeholder="you@example.com"/></label><label>What’s this about?<select><option>General question</option><option>Menu or ingredients</option><option>Existing order</option><option>Special gathering</option></select></label><label>Message<textarea required rows="5" placeholder="Tell us a little about what you need..."/></label><button className="primary wide">Send message <Icon name="arrow"/></button></form>}</section></main>
}

function Footer({ setPage }) {
  return <footer><div className="footer-brand"><span className="brand-mark">H<span>&</span>H</span><p>Homemade food, generously served.<br/>Pickup catering for 6–30 people.</p></div><div><strong>Explore</strong><button onClick={() => setPage('menu')}>Weekly menu</button><button onClick={() => setPage('about')}>Our story</button><button onClick={() => setPage('contact')}>Get in touch</button></div><div><strong>Order notes</strong><span>Order 2–14 days ahead</span><span>Pickup only</span><span>Tuesday–Sunday kitchen</span></div><div className="footer-bottom">© {new Date().getFullYear()} Hearth & Harvest <span>Made with care, served with joy.</span></div></footer>
}

export default function App() {
  const dates = useMemo(upcomingDates, [])
  const [page, setPageState] = useState('menu')
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = localStorage.getItem('hh-pickup-date')
    return dates.some((date) => toInputDate(date) === saved) ? saved : toInputDate(dates[1])
  })
  const [selectedItem, setSelectedItem] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [invoice, setInvoice] = useState(null)
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('hh-cart') || '[]'))
  const dayIndex = new Date(`${selectedDate}T12:00:00`).getDay()
  const items = menus[dayIndex]
  useEffect(() => localStorage.setItem('hh-cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('hh-pickup-date', selectedDate), [selectedDate])
  useEffect(() => { window.scrollTo(0, 0) }, [page])
  function setPage(next) { setPageState(next); setCartOpen(false) }
  function changeDate(value) {
    if (value === selectedDate) return
    if (cart.length && !window.confirm('Changing the pickup date will clear your current basket. Continue?')) return
    setCart([]); setSelectedDate(value)
  }
  function addItem(item) {
    setCart((current) => current.some((line) => line.id === item.id) ? current : [...current, { ...item, quantity: 6 }])
    setCartOpen(true)
  }
  function updateQuantity(id, quantity) { setCart((current) => current.map((line) => line.id === id ? { ...line, quantity: Math.max(6, Math.min(30, quantity)) } : line)) }
  function placed(nextInvoice) { setInvoice(nextInvoice); setCart([]); setPage('invoice') }
  return <div className="app">
    {page !== 'checkout' && page !== 'invoice' && <Header page={page} setPage={setPage} cartCount={cart.length} openCart={() => setCartOpen(true)}/>} 
    {page === 'menu' && <MenuPage dates={dates} selectedDate={selectedDate} onDateSelect={changeDate} items={items} onSelect={setSelectedItem} onAdd={addItem}/>} 
    {page === 'about' && <AboutPage setPage={setPage}/>} 
    {page === 'contact' && <ContactPage/>} 
    {page === 'checkout' && <CheckoutPage cart={cart} selectedDate={selectedDate} onBack={() => setPage('menu')} onPlaced={placed}/>} 
    {page === 'invoice' && invoice && <InvoicePage invoice={invoice} setPage={setPage}/>} 
    {page !== 'checkout' && page !== 'invoice' && <Footer setPage={setPage}/>} 
    <ItemDialog item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={addItem}/>
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} updateQuantity={updateQuantity} removeItem={(id) => setCart((current) => current.filter((line) => line.id !== id))} selectedDate={selectedDate} checkout={() => setPage('checkout')}/>
  </div>
}
