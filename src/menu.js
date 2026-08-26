const photos = {
  chicken: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=82",
  meat: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=82",
  salmon: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=82",
  pasta: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=82",
  curry: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=82",
  vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=82",
  grain: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=82",
  potatoes: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=900&q=82",
  bread: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82",
  beans: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82",
};

const proteins = [
  ["Herb-roasted chicken", 14, "chicken", "Tender chicken roasted with garden herbs and pan jus.", "Chicken, rosemary, thyme, garlic, lemon"],
  ["Maple mustard chicken", 15, "chicken", "Sweet-tangy glazed chicken with cracked mustard seed.", "Chicken, maple, Dijon mustard, garlic, thyme"],
  ["Slow-braised beef", 18, "meat", "Fork-tender beef in a rich red wine and shallot jus.", "Beef, red wine, shallot, carrot, bay leaf"],
  ["Citrus baked salmon", 19, "salmon", "Flaky salmon baked with orange, lemon, and fresh dill.", "Salmon, orange, lemon, dill, olive oil"],
  ["Rosemary pork loin", 16, "meat", "Juicy sliced pork with rosemary and cider reduction.", "Pork, apple cider, rosemary, garlic, black pepper"],
  ["Tuscan chicken", 16, "chicken", "Roasted chicken with sun-dried tomato and basil cream.", "Chicken, tomato, cream, basil, parmesan"],
  ["Garlic butter salmon", 20, "salmon", "Oven-roasted salmon finished with lemon garlic butter.", "Salmon, butter, garlic, lemon, parsley"],
  ["Cider-glazed pork", 17, "meat", "Slow-roasted pork with a glossy apple cider glaze.", "Pork, apple cider, brown sugar, sage, mustard"],
  ["Red wine pot roast", 18, "meat", "Classic slow-cooked beef with root vegetables.", "Beef, red wine, potato, carrot, onion"],
  ["Lemon oregano chicken", 14, "chicken", "Bright, savory chicken inspired by Mediterranean kitchens.", "Chicken, lemon, oregano, garlic, olive oil"],
];

const vegetarian = [
  ["Wild mushroom pasta", 13, "pasta", "Silky pasta with caramelized mushrooms and herbs.", "Pasta, mushroom, cream, parmesan, thyme"],
  ["Coconut chickpea curry", 12, "curry", "Warming chickpeas and vegetables in coconut curry sauce.", "Chickpea, coconut milk, tomato, spinach, spices"],
  ["Roasted vegetable lasagna", 14, "pasta", "Layered pasta with roasted vegetables and three cheeses.", "Pasta, zucchini, tomato, ricotta, mozzarella"],
  ["Stuffed garden peppers", 12, "vegetables", "Roasted peppers filled with herbed rice and feta.", "Bell pepper, rice, feta, tomato, parsley"],
  ["Butternut squash bake", 13, "vegetables", "Creamy squash, kale, and sage beneath a crisp topping.", "Squash, kale, cream, sage, breadcrumbs"],
  ["Lentil shepherd's pie", 13, "beans", "Savory lentils and vegetables under whipped potatoes.", "Lentils, potato, carrot, peas, herbs"],
];

const sides = [
  ["Rosemary roasted potatoes", 6, "potatoes", "Crisp-edged baby potatoes tossed with rosemary.", "Potato, olive oil, rosemary, sea salt"],
  ["Harvest grain salad", 7, "grain", "Chewy grains, herbs, cranberries, and toasted pepitas.", "Farro, cranberry, pepita, parsley, cider vinaigrette"],
  ["Honey glazed carrots", 6, "vegetables", "Roasted carrots with local honey and thyme.", "Carrot, honey, butter, thyme"],
  ["Garlic pull-apart rolls", 5, "bread", "Soft house-baked rolls brushed with garlic butter.", "Wheat flour, butter, yeast, garlic, parsley"],
];

const nutrition = (category, index) => ({
  calories: category === "Protein" ? 360 + index * 12 : category === "Vegetarian" ? 310 + index * 15 : 180 + index * 18,
  protein: category === "Protein" ? 32 + index : category === "Vegetarian" ? 12 + index : 4 + index,
  carbs: category === "Protein" ? 9 + index : 36 + index * 2,
  fat: category === "Side" ? 7 + index : 14 + index,
  sodium: 380 + index * 24,
});

const makeItem = (entry, category, day, slot) => ({
  id: `${day}-${category.toLowerCase()}-${slot}`,
  name: entry[0],
  price: entry[1],
  image: photos[entry[2]],
  description: entry[3],
  ingredients: entry[4],
  category,
  nutrition: nutrition(category, (day + slot) % 6),
});

export const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function menuForDate(dateString) {
  const day = new Date(`${dateString}T12:00:00`).getDay();
  const proteinItems = Array.from({ length: 5 }, (_, i) => makeItem(proteins[(day * 2 + i) % proteins.length], "Protein", day, i));
  const vegItems = Array.from({ length: 3 }, (_, i) => makeItem(vegetarian[(day + i) % vegetarian.length], "Vegetarian", day, i));
  const sideItems = Array.from({ length: 2 }, (_, i) => makeItem(sides[(day + i) % sides.length], "Side", day, i));
  return [...proteinItems, ...vegItems, ...sideItems];
}

export function dateInputValue(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function formatDate(value, options = {}) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", ...options }).format(new Date(`${value}T12:00:00`));
}
