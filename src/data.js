const photos = {
  chicken: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=82',
  beef: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=82',
  salmon: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=82',
  meatballs: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=900&q=82',
  pork: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=900&q=82',
  curry: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=82',
  pasta: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=82',
  vegetables: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82',
  grain: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=82',
  potatoes: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=82',
  salad: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=82',
  bread: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=900&q=82',
}

const definitions = {
  chicken: ['Herb-roasted chicken', 'Lemon, thyme and pan jus', 13, photos.chicken, ['chicken', 'lemon', 'thyme', 'garlic'], [410, '38g', '7g', '23g']],
  beef: ['Slow-braised beef', 'Red wine, pearl onions and herbs', 16, photos.beef, ['beef chuck', 'red wine', 'onion', 'rosemary'], [520, '42g', '12g', '31g']],
  salmon: ['Maple mustard salmon', 'Roasted salmon with a sweet mustard glaze', 17, photos.salmon, ['salmon', 'maple', 'mustard', 'dill'], [390, '35g', '10g', '22g']],
  meatballs: ['Sunday meatballs', 'Beef and pork meatballs in tomato sugo', 14, photos.meatballs, ['beef', 'pork', 'tomato', 'parmesan'], [480, '32g', '18g', '28g']],
  pork: ['Cider-glazed pork', 'Tender pork loin, apple and sage', 15, photos.pork, ['pork loin', 'apple cider', 'sage', 'shallot'], [430, '40g', '15g', '20g']],
  curryChicken: ['Golden coconut chicken', 'Aromatic coconut curry with toasted spice', 14, photos.curry, ['chicken', 'coconut milk', 'turmeric', 'ginger'], [460, '34g', '16g', '27g']],
  brisket: ['Coffee-rubbed brisket', 'Low and slow with smoky shallot jus', 17, photos.beef, ['beef brisket', 'coffee', 'paprika', 'shallot'], [550, '44g', '9g', '36g']],
  turkey: ['Apricot glazed turkey', 'Roasted turkey breast with apricot and fennel', 14, photos.chicken, ['turkey', 'apricot', 'fennel', 'thyme'], [370, '41g', '13g', '15g']],
  eggplant: ['Roasted eggplant bake', 'Tomato, basil and bubbling mozzarella', 12, photos.vegetables, ['eggplant', 'tomato', 'mozzarella', 'basil'], [360, '16g', '28g', '20g']],
  cauliflower: ['Spiced cauliflower steak', 'Chermoula, chickpea and preserved lemon', 11, photos.vegetables, ['cauliflower', 'chickpea', 'parsley', 'lemon'], [290, '11g', '35g', '13g']],
  pasta: ['Wild mushroom rigatoni', 'Creamy mushrooms, pecorino and herbs', 13, photos.pasta, ['rigatoni', 'mushroom', 'cream', 'pecorino'], [510, '18g', '63g', '21g']],
  lentils: ['Red lentil coconut dal', 'Ginger, tomato and warming spice', 10, photos.curry, ['red lentils', 'coconut milk', 'tomato', 'ginger'], [350, '17g', '48g', '12g']],
  squash: ['Harvest stuffed squash', 'Wild rice, cranberry and pepita', 12, photos.grain, ['acorn squash', 'wild rice', 'cranberry', 'pepita'], [330, '9g', '55g', '10g']],
  gnocchi: ['Brown butter gnocchi', 'Roasted squash, sage and hazelnut', 13, photos.pasta, ['potato gnocchi', 'squash', 'sage', 'hazelnut'], [490, '14g', '61g', '22g']],
  chickpea: ['Smoky chickpea tagine', 'Tomato, apricot and toasted almond', 11, photos.curry, ['chickpea', 'tomato', 'apricot', 'almond'], [380, '15g', '52g', '14g']],
  potatoes: ['Crispy rosemary potatoes', 'Garlic confit and flaky salt', 6, photos.potatoes, ['potato', 'rosemary', 'garlic', 'olive oil'], [260, '5g', '39g', '10g']],
  salad: ['Market greens', 'Seasonal fruit, seeds and cider vinaigrette', 7, photos.salad, ['mixed greens', 'seasonal fruit', 'seeds', 'cider'], [180, '4g', '16g', '12g']],
  rice: ['Herbed lemon rice', 'Fluffy basmati with parsley and lemon', 5, photos.grain, ['basmati rice', 'lemon', 'parsley', 'olive oil'], [240, '5g', '44g', '5g']],
  roots: ['Maple roasted roots', 'Carrot, parsnip and sweet potato', 6, photos.vegetables, ['carrot', 'parsnip', 'sweet potato', 'maple'], [210, '4g', '38g', '6g']],
  bread: ['Pull-apart herb rolls', 'Soft-baked rolls with cultured butter', 5, photos.bread, ['wheat flour', 'butter', 'milk', 'herbs'], [220, '6g', '34g', '7g']],
  slaw: ['Apple fennel slaw', 'Crunchy cabbage with mustard dressing', 6, photos.salad, ['cabbage', 'apple', 'fennel', 'mustard'], [150, '3g', '19g', '8g']],
}

const createItem = (key, category, day) => {
  const [name, description, price, image, ingredients, nutrition] = definitions[key]
  return { id: `${day}-${key}`, key, category, name, description, price, image, ingredients, nutrition }
}

const schedules = [
  [['chicken', 'beef', 'salmon', 'meatballs', 'pork'], ['eggplant', 'cauliflower', 'pasta'], ['potatoes', 'salad']],
  [['curryChicken', 'brisket', 'turkey', 'salmon', 'meatballs'], ['lentils', 'squash', 'gnocchi'], ['rice', 'roots']],
  [['pork', 'chicken', 'beef', 'turkey', 'salmon'], ['chickpea', 'eggplant', 'pasta'], ['bread', 'slaw']],
  [['brisket', 'curryChicken', 'meatballs', 'pork', 'turkey'], ['cauliflower', 'lentils', 'squash'], ['potatoes', 'rice']],
  [['salmon', 'chicken', 'brisket', 'meatballs', 'pork'], ['gnocchi', 'chickpea', 'eggplant'], ['salad', 'roots']],
  [['turkey', 'beef', 'curryChicken', 'salmon', 'chicken'], ['pasta', 'lentils', 'cauliflower'], ['bread', 'potatoes']],
  [['meatballs', 'pork', 'brisket', 'turkey', 'beef'], ['squash', 'gnocchi', 'chickpea'], ['slaw', 'rice']],
]

export const menus = schedules.map((groups, day) => [
  ...groups[0].map((key) => createItem(key, 'Protein', day)),
  ...groups[1].map((key) => createItem(key, 'Vegetarian', day)),
  ...groups[2].map((key) => createItem(key, 'Sides', day)),
])

export const categoryCopy = {
  Protein: 'Slow-cooked, fire-roasted, and made to anchor the table.',
  Vegetarian: 'Vegetable-forward mains with substance and warmth.',
  Sides: 'The generous extras that bring the whole meal together.',
}
