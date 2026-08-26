const photos = [
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=82',
];

const weeklyMenus = [
  ['Rosemary roast chicken', 'Cider-braised pork', 'Maple glazed salmon', 'Red wine beef brisket', 'Turkey meatballs', 'Wild mushroom pot pie', 'Lentil shepherd’s pie', 'Stuffed delicata squash', 'Buttermilk mashed potatoes', 'Charred green beans'],
  ['Lemon thyme chicken', 'Slow-roasted carnitas', 'Miso glazed salmon', 'Braised beef short rib', 'Herbed turkey roulade', 'Spinach ricotta shells', 'Smoky three-bean chili', 'Cauliflower steaks', 'Crispy rosemary potatoes', 'Honey roasted carrots'],
  ['Harissa roast chicken', 'Mustard glazed pork loin', 'Cedar plank salmon', 'Classic beef bourguignon', 'Turkey sage meatloaf', 'Roasted vegetable lasagna', 'Coconut chickpea curry', 'Mushroom lentil loaf', 'Brown butter polenta', 'Garlic broccolini'],
  ['Balsamic chicken thighs', 'Applewood pulled pork', 'Dill roasted salmon', 'Coffee-rubbed brisket', 'Turkey spinach meatballs', 'Butternut squash risotto', 'Red lentil dal', 'Eggplant parmesan', 'Herbed wild rice', 'Roasted Brussels sprouts'],
  ['Pesto roast chicken', 'Porchetta-style pork', 'Honey soy salmon', 'Juniper braised beef', 'Turkey piccata', 'Asparagus goat cheese tart', 'Black bean enchiladas', 'Sesame tofu steaks', 'Parmesan potato gratin', 'Lemon roasted asparagus'],
  ['Paprika grilled chicken', 'Peach barbecue pork', 'Herb crusted salmon', 'Sunday pot roast', 'Turkey zucchini burgers', 'Tomato basil baked gnocchi', 'White bean cassoulet', 'Quinoa stuffed peppers', 'Cheddar scalloped potatoes', 'Summer corn succotash'],
  ['Garlic confit chicken', 'Fennel roasted pork', 'Pomegranate salmon', 'Cabernet braised beef', 'Turkey herb cutlets', 'Mushroom spinach strata', 'Sweet potato lentil curry', 'Roasted cabbage steaks', 'Olive oil smashed potatoes', 'Maple glazed root vegetables'],
];

const descriptors = [
  ['free-range chicken, rosemary, garlic, lemon', 'A slow-roasted centerpiece with crisp edges, pan herbs, and a bright finish.'],
  ['heritage pork, onion, seasonal fruit, spices', 'Tender, deeply savory, and cooked low and slow in our kitchen.'],
  ['Atlantic salmon, citrus, herbs, sea salt', 'Roasted until just flaky, with a balanced glaze and fresh herbs.'],
  ['grass-fed beef, aromatics, stock, red wine', 'A comforting braise with rich pan sauce and meltingly tender beef.'],
  ['ground turkey, garden herbs, garlic, oat crumbs', 'A lighter, family-friendly favorite seasoned with fresh herbs.'],
  ['seasonal vegetables, herbs, cultured dairy, pastry', 'A generous vegetarian main layered with peak-season produce.'],
  ['lentils, beans, tomato, warm spices, onion', 'Wholesome, slow-simmered comfort with plant-based protein.'],
  ['seasonal vegetables, grains, herbs, olive oil', 'A colorful vegetable-forward main with satisfying texture.'],
  ['potatoes or grains, butter, herbs, sea salt', 'A crowd-pleasing, from-scratch accompaniment for any table.'],
  ['seasonal vegetables, olive oil, garlic, herbs', 'Simply prepared vegetables, roasted to bring out their natural sweetness.'],
];

const dietary = ['GF', 'GF', 'GF', 'GF', '', 'V', 'VG · GF', 'VG · GF', 'V · GF', 'VG · GF'];

export const categories = [
  { id: 'protein', label: 'Proteins', note: 'Five hearty centerpieces' },
  { id: 'vegetarian', label: 'Vegetarian', note: 'Three garden-led mains' },
  { id: 'sides', label: 'Sides', note: 'Two table-ready pairings' },
];

export function getMenu(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  const day = Number.isNaN(date.getTime()) ? 0 : date.getDay();
  return weeklyMenus[day].map((name, index) => ({
    id: `${day}-${index}`,
    name,
    category: index < 5 ? 'protein' : index < 8 ? 'vegetarian' : 'sides',
    price: [13, 14, 15, 16, 12, 11, 10, 11, 6, 6][index] + (day % 2),
    unit: 'per person',
    image: photos[index],
    imageAlt: `${name} served family-style`,
    dietary: dietary[index],
    ingredients: descriptors[index][0],
    description: descriptors[index][1],
    nutrition: {
      calories: 280 + index * 32 + day * 4,
      protein: index < 5 ? 28 + index * 2 : 10 + index,
      carbs: 12 + index * 5,
      fat: 11 + index,
      sodium: 310 + index * 42,
    },
  }));
}

export function dateInputValue(date) {
  return date.toISOString().slice(0, 10);
}

export function formatDate(dateString, options = {}) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', ...options,
  }).format(new Date(`${dateString}T12:00:00`));
}
