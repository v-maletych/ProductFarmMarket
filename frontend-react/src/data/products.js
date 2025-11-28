export const products = [
  { 
    id: 101, name: "Яблуко Гала", price: 28, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Солодке, хрустке, з тонкою шкіркою. Улюбленець дітей.", category: "fruits", subcategory: "apples" 
  },
  { 
    id: 102, name: "Яблуко Голден Делішес", price: 32, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Класичне жовте яблуко з медовим смаком.", category: "fruits", subcategory: "apples" 
  },
  { 
    id: 103, name: "Яблуко Фуджі", price: 35, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Екзотичний солодкий смак, дуже соковите.", category: "fruits", subcategory: "apples" 
  },
  { 
    id: 104, name: "Яблуко Айдаред", price: 22, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/39803/pexels-photo-39803.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Кисло-солодке, ідеальне для запікання.", category: "fruits", subcategory: "apples" 
  },

  // --- Груші ---
  { 
    id: 110, name: "Груша Конференція", price: 65, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/568471/pexels-photo-568471.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "№1 в садах. Соковита, м'яка, подовгаста.", category: "fruits", subcategory: "pears" 
  },
  { 
    id: 111, name: "Груша Вільямс (Дюшес)", price: 70, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/1258202/pexels-photo-1258202.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Літній сорт з неймовірним ароматом дюшесу.", category: "fruits", subcategory: "pears" 
  },

  // --- Кісточкові ---
  { 
    id: 120, name: "Персик Редхейвен", price: 85, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/1268122/pexels-photo-1268122.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Класичний соковитий персик, кісточка відділяється.", category: "fruits", subcategory: "peaches" 
  },
  { 
    id: 121, name: "Персик Сатурн (Інжирний)", price: 110, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Плоский (інжирний), дуже солодкий десертний сорт.", category: "fruits", subcategory: "peaches" 
  },
  { 
    id: 122, name: "Слива Стенлей", price: 45, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/248440/pexels-photo-248440.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Пізня угорка, щільна м'якоть, ідеальна для чорносливу.", category: "fruits", subcategory: "plums" 
  },
  { 
    id: 123, name: "Абрикос Ананасний", price: 75, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/1266005/pexels-photo-1266005.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Сорт Шалах. Світлий, дуже ароматний, з присмаком ананаса.", category: "fruits", subcategory: "apricots" 
  },
  
  // --- Черешня та Виноград ---
  { 
    id: 130, name: "Черешня Кордія", price: 140, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/109274/pexels-photo-109274.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Темно-червона, крупна, серцеподібна ягода.", category: "fruits", subcategory: "cherries" 
  },
  { 
    id: 131, name: "Виноград Аркадія", price: 90, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Великі бурштинові грона, мускатний смак.", category: "fruits", subcategory: "grapes" 
  },
  { 
    id: 132, name: "Виноград Кишмиш", price: 100, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/60021/grapes-wine-fruit-vines-60021.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Без кісточок, дуже солодкий, сорт 342.", category: "fruits", subcategory: "grapes" 
  },

  // ==========================================
  // 🥕 2. ОВОЧІ (Сортові)
  // ==========================================

  // --- Картопля ---
  { 
    id: 201, name: "Картопля Беллароза", price: 15, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Червона шкірка, розсипчаста, дуже смачна.", category: "vegetables", subcategory: "potatoes" 
  },
  { 
    id: 202, name: "Картопля Рів'єра", price: 18, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Рання, світла, ніжна м'якоть.", category: "vegetables", subcategory: "potatoes" 
  },

  // --- Томати та Огірки ---
  { 
    id: 210, name: "Томат Рожевий", price: 75, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Великий, м'ясистий, салатний сорт Малинівка.", category: "vegetables", subcategory: "tomatoes" 
  },
  { 
    id: 211, name: "Томат Черрі", price: 85, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Солодкі як цукерки, на гілочці.", category: "vegetables", subcategory: "tomatoes" 
  },
  { 
    id: 212, name: "Огірок Корнішон", price: 45, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Хрусткий, маленький, ідеальний для засолки.", category: "vegetables", subcategory: "cucumbers" 
  },

  // --- Борщовий набір ---
  { 
    id: 220, name: "Морква Нантейська", price: 20, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Циліндрична, солодка, без серцевини.", category: "vegetables", subcategory: "roots" 
  },
  { 
    id: 221, name: "Буряк Бордо", price: 18, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/3195957/pexels-photo-3195957.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Темно-червоний, солодкий столовий буряк.", category: "vegetables", subcategory: "roots" 
  },
  { 
    id: 222, name: "Капуста Агресор", price: 12, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/2518893/pexels-photo-2518893.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Соковита, хрустка, довго зберігається.", category: "vegetables", subcategory: "cabbage" 
  },

  // ==========================================
  // 🥬 3. ЗЕЛЕНЬ
  // ==========================================
  { 
    id: 301, name: "Петрушка Кучерява", price: 15, unit: "пучок", 
    image: "https://images.pexels.com/photos/701014/pexels-photo-701014.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Ароматна, для прикраси страв.", category: "greens", subcategory: "fresh_herbs" 
  },
  { 
    id: 302, name: "Рукола", price: 30, unit: "пучок", 
    image: "https://images.pexels.com/photos/2893635/pexels-photo-2893635.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Гостра, горіхова нотка.", category: "greens", subcategory: "salad" 
  },
  { 
    id: 303, name: "Шпинат", price: 25, unit: "пучок", 
    image: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Вітамінна бомба, молоді листки.", category: "greens", subcategory: "salad" 
  },

  // ==========================================
  // 🫐 4. ЯГОДИ
  // ==========================================
  { 
    id: 401, name: "Полуниця Азія", price: 120, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/934066/pexels-photo-934066.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Велика, солодка, транспортабельна.", category: "berries", subcategory: "strawberries" 
  },
  { 
    id: 402, name: "Лохина Блукроп", price: 280, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/1153655/pexels-photo-1153655.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Еталон смаку лохини.", category: "berries", subcategory: "blueberries" 
  },
  { 
    id: 403, name: "Малина Полька", price: 180, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/52536/raspberry-fruits-fresh-red-52536.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Ремонтантна, велика солодка ягода.", category: "berries", subcategory: "raspberries" 
  },

  // ==========================================
  // 🐄 5. МОЛОЧНА ПРОДУКЦІЯ
  // ==========================================
  { 
    id: 501, name: "Молоко Ранкове", price: 40, unit: "1л", 
    image: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Цільне коров'яче молоко, жирність 3.8-4.2%.", category: "dairy", subcategory: "milk" 
  },
  { 
    id: 502, name: "Сир Домашній (Творог)", price: 140, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/416656/pexels-photo-416656.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Жирний, пластовий, ідеальний для сирників.", category: "dairy", subcategory: "soft_cheese" 
  },
  { 
    id: 503, name: "Бринза Овеча", price: 220, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Солона, витримана в ропі, крафтова.", category: "dairy", subcategory: "hard_cheese" 
  },

  // ==========================================
  // 🥚 6. ТВАРИННИЦТВО
  // ==========================================
  { 
    id: 601, name: "Яйця Курячі (С0)", price: 60, unit: "10 шт", 
    image: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Домашні, великі, з яскравим помаранчевим жовтком.", category: "meat_eggs", subcategory: "eggs" 
  },
  { 
    id: 602, name: "Курка Бройлер", price: 130, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Ціла тушка 2.5-3 кг, зернова відгодівля.", category: "meat_eggs", subcategory: "poultry" 
  },
  { 
    id: 603, name: "Свинина (Ошийок)", price: 220, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Найкраща частина для шашлику, з прожилками.", category: "meat_eggs", subcategory: "meat" 
  },
  { 
    id: 604, name: "Сало Генеральське", price: 250, unit: "грн/кг", 
    image: "https://images.pexels.com/photos/1927383/pexels-photo-1927383.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "З проріззю м'яса, м'яке як масло, смалене соломою.", category: "meat_eggs", subcategory: "lard" 
  },

  // ==========================================
  // 🌰 10. ГОРІХИ
  // ==========================================
  { 
    id: 1001, name: "Волоський Горіх", price: 180, unit: "кг", 
    image: "https://images.pexels.com/photos/39305/walnuts-food-nut-shell-39305.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Сорт Метелик. Світлий, сухий, чищений.", category: "nuts", subcategory: "walnut" 
  },
  { 
    id: 1002, name: "Фундук (Ліщина)", price: 350, unit: "кг", 
    image: "https://images.pexels.com/photos/5946003/pexels-photo-5946003.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Великий, смажений, калібр 15+.", category: "nuts", subcategory: "hazelnut" 
  },

  // ==========================================
  // 🪴 12. РОЗСАДА
  // ==========================================
  { 
    id: 1201, name: "Саджанець Яблуні Гала", price: 150, unit: "шт", 
    image: "https://images.pexels.com/photos/29871838/pexels-photo-29871838.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Дворічний саджанець, закрита коренева система.", category: "seedlings", subcategory: "trees" 
  },
  { 
    id: 1202, name: "Розсада Помідорів", price: 25, unit: "10 шт", 
    image: "https://images.pexels.com/photos/1002639/pexels-photo-1002639.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Сорт Де-Барао, загартована, готова до висадки.", category: "seedlings", subcategory: "veg_seedlings" 
  },

  // ==========================================
  // 🌾 7. ЗЕРНОВІ (ОСЬ ЦЕ БУЛО ПРОПУЩЕНО)
  // ==========================================
  { 
    id: 701, name: "Пшениця (Зерно)", price: 12, unit: "кг", 
    image: "https://images.pexels.com/photos/163754/wheat-field-cereals-grain-163754.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Екологічно чиста, для пророщування або борошна.", category: "grains", subcategory: "wheat" 
  },
  { 
    id: 702, name: "Гречка Несмажена", price: 45, unit: "кг", 
    image: "https://images.pexels.com/photos/6316533/pexels-photo-6316533.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Зелена гречка, жива, для здорового харчування.", category: "grains", subcategory: "barley" 
  },

  // ==========================================
  // 🫘 8. БОБОВІ
  // ==========================================
  { 
    id: 801, name: "Квасоля Червона", price: 60, unit: "кг", 
    image: "https://images.pexels.com/photos/3735190/pexels-photo-3735190.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Велика, ідеальна для борщу та лобіо.", category: "legumes", subcategory: "beans" 
  },
  { 
    id: 802, name: "Нут (Турецький горох)", price: 75, unit: "кг", 
    image: "https://images.pexels.com/photos/6104167/pexels-photo-6104167.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Великий калібр, для хумусу.", category: "legumes", subcategory: "peas" 
  },

  // ==========================================
  // 🌱 9. ОЛІЙНІ
  // ==========================================
  { 
    id: 901, name: "Насіння Соняшника", price: 25, unit: "кг", 
    image: "https://images.pexels.com/photos/54254/sunflower-blossom-bloom-flowers-54254.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Сире насіння, висушене на сонці.", category: "oilseeds", subcategory: "sunflower" 
  },
  { 
    id: 902, name: "Насіння Льону", price: 40, unit: "кг", 
    image: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Темний льон, джерело Омега-3.", category: "oilseeds", subcategory: "flax" 
  },

  // ==========================================
  // 🍯 11. ПРОДУКТИ ПЕРЕРОБКИ
  // ==========================================
  { 
    id: 1101, name: "Варення Малинове", price: 85, unit: "0.5л", 
    image: "https://images.pexels.com/photos/4099124/pexels-photo-4099124.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Домашнє, як у бабусі, густе.", category: "pantry", subcategory: "jam" 
  },
  { 
    id: 1102, name: "Сік Яблучний", price: 120, unit: "3л", 
    image: "https://images.pexels.com/photos/1233319/pexels-photo-1233319.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Прямий віджим, без цукру та води.", category: "pantry", subcategory: "juice" 
  },

  // ==========================================
  // 🌼 13. КВІТИ
  // ==========================================
  { 
    id: 1301, name: "Троянди Фермерські", price: 300, unit: "15 шт", 
    image: "https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Свіжозрізаний букет з власної теплиці.", category: "flowers", subcategory: "roses" 
  },

  // ==========================================
  // 🧺 14. КРАФТ
  // ==========================================
  { 
    id: 1401, name: "Хліб на Заквасці", price: 45, unit: "шт", 
    image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600", 
    description: "Житній, бездріжджовий, з хрусткою скоринкою.", category: "craft", subcategory: "bread" 
  },
  { 
    id: 1402, name: "Олія Соняшникова", price: 65, unit: "1л", 
    image: "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=600", 
    description: "Сиродавлена, ароматна, нерафінована.", category: "craft", subcategory: "oil" 
  },
];


// -----------------------------------------------
// 📋 КАТЕГОРІЇ ДЛЯ МЕНЮ (Sidebar)
// -----------------------------------------------
export const categories = [
  { name: 'Фрукти', link: '/products/fruits', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Овочі', link: '/products/vegetables', image: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Зелень', link: '/products/greens', image: 'https://images.pexels.com/photos/1213865/pexels-photo-1213865.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Ягоди', link: '/products/berries', image: 'https://images.pexels.com/photos/1153655/pexels-photo-1153655.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Молочна продукція', link: '/products/dairy', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Тваринництво', link: '/products/meat_eggs', image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Зернові', link: '/products/grains', image: 'https://images.pexels.com/photos/163754/wheat-field-cereals-grain-163754.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Бобові', link: '/products/legumes', image: 'https://images.pexels.com/photos/3735190/pexels-photo-3735190.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Олійні культури', link: '/products/oilseeds', image: 'https://images.pexels.com/photos/54254/sunflower-blossom-bloom-flowers-54254.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Горіхи', link: '/products/nuts', image: 'https://images.pexels.com/photos/39305/walnuts-food-nut-shell-39305.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Продукти переробки', link: '/products/pantry', image: 'https://images.pexels.com/photos/4099124/pexels-photo-4099124.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Розсада / Саджанці', link: '/products/seedlings', image: 'https://images.pexels.com/photos/29871838/pexels-photo-29871838.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Квіти Справжні / Декоративні', link: '/products/flowers', image: 'https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Фермерське виробництво', link: '/products/craft', image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

// -----------------------------------------------
// 🇺🇦 СЛОВНИК ПІДКАТЕГОРІЙ (Кнопки-фільтри)
// -----------------------------------------------
export const subcategoryTranslations = {
  // Фрукти
  apples: "🍎 Яблука",
  pears: "🍐 Груші",
  peaches: "🍑 Персики/Нектарини",
  plums: "Сливи",
  apricots: "Абрикоси",
  cherries: "🍒 Черешня/Вишня",
  grapes: "🍇 Виноград",
  
  // Овочі
  potatoes: "🥔 Картопля",
  tomatoes: "🍅 Томати",
  cucumbers: "🥒 Огірки",
  roots: "🥕 Морква/Буряк",
  cabbage: "🥬 Капуста",
  
  // Зелень
  fresh_herbs: "🌿 Пряні трави",
  salad: "🥗 Салати",
  
  // Ягоди
  strawberries: "🍓 Полуниця",
  blueberries: "🫐 Лохина",
  raspberries: "Малина",
  
  // Молочка
  milk: "🥛 Молоко",
  soft_cheese: "Сир домашній",
  hard_cheese: "🧀 Бринза/Твердий",
  
  // М'ясо
  meat: "🥩 Свинина/Яловичина",
  poultry: "🍗 Птиця",
  eggs: "🥚 Яйця",
  lard: "🥓 Сало",
  
  // Горіхи
  walnut: "🌰 Волоський",
  hazelnut: "Ліщина",
  
  // Розсада
  trees: "🌳 Дерева",
  veg_seedlings: "🌱 Розсада овочів",
  
  // Нові категорії
  wheat: "🌾 Пшениця",
  barley: "Гречка/Ячмінь",
  beans: "🫘 Квасоля",
  peas: "Горох/Нут",
  sunflower: "🌻 Соняшник",
  flax: "Льон",
  jam: "Варення/Джеми",
  juice: "🧃 Соки",
  roses: "🌹 Троянди",
  bread: "🍞 Хліб",
  oil: "Олія",

  // Загальне
  all: "📦 Всі товари"
};