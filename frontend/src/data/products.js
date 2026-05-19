export const PRODUCTS = [
  {
    id: "pb-classic-creamy",
    name: "Classic Creamy Peanut Butter",
    tag: "Best Seller",
    type: "creamy",
    tagline: "Slow-roasted, ultra-smooth 100% natural peanut butter.",
    description: "Our Classic Creamy Peanut Butter is crafted using only premium dry-roasted peanuts and a tiny pinch of pink Himalayan sea salt. Slow-ground to a silky, luxurious texture, it delivers a rich, authentic flavor that melts in your mouth. Perfect for spreading, smoothies, or enjoying straight from the spoon.",
    rating: 4.8,
    reviewsCount: 1240,
    baseWeight: "1kg",
    prices: {
      "1kg": 599,
      "2.5kg": 1299,
      "5kg": 2199
    },
    nutrition: {
      servingSize: "2 tbsp (32g)",
      calories: "190",
      protein: "8g",
      totalFat: "16g",
      saturatedFat: "2.5g",
      carbs: "6g",
      dietaryFiber: "2g",
      sugars: "1g (No added sugar)",
      sodium: "75mg"
    },
    ingredients: ["100% Organic Dry-Roasted Peanuts", "Pink Himalayan Sea Salt"],
    reviews: [
      { id: 1, author: "Aarav S.", rating: 5, date: "2026-05-10", comment: "Absolutely the smoothest peanut butter I have ever bought. Perfect consistency, and not oily at all!" },
      { id: 2, author: "Priya M.", rating: 4, date: "2026-05-08", comment: "Very natural taste. Love that there is no added sugar or cheap palm oils. Will definitely order the 5kg tub next time!" },
      { id: 3, author: "David K.", rating: 5, date: "2026-04-29", comment: "Pure, delicious taste. Great value for organic ingredients." }
    ],
    image: "/src/assets/classic_creamy.png",
    color: "#E29543",
    bgGradient: "linear-gradient(135deg, #F8E2C4 0%, #D4A36A 100%)"
  },
  {
    id: "pb-extra-crunchy",
    name: "All-Natural Extra Crunchy",
    tag: "Customer Favorite",
    type: "crunchy",
    tagline: "Robust, nutty crunch with satisfying texture in every bite.",
    description: "For those who believe texture is everything! Our All-Natural Extra Crunchy Peanut Butter features our signature smooth paste loaded with generously sized chunks of perfectly dry-roasted peanuts. Every spoonful offers a delightful, deep roasted nutty crunch that elevates sandwiches, oats, and protein shakes.",
    rating: 4.9,
    reviewsCount: 982,
    baseWeight: "1kg",
    prices: {
      "1kg": 629,
      "2.5kg": 1399,
      "5kg": 2399
    },
    nutrition: {
      servingSize: "2 tbsp (32g)",
      calories: "195",
      protein: "8g",
      totalFat: "17g",
      saturatedFat: "3g",
      carbs: "5g",
      dietaryFiber: "3g",
      sugars: "1g",
      sodium: "80mg"
    },
    ingredients: ["90% Dry-Roasted Peanuts", "10% Roasted Peanut Chunks", "Pink Himalayan Sea Salt"],
    reviews: [
      { id: 1, author: "Rahul V.", rating: 5, date: "2026-05-14", comment: "The crunch is unreal! They did not skim on the peanut pieces. Best crunchy peanut butter in India hands down." },
      { id: 2, author: "Sneha G.", rating: 5, date: "2026-05-02", comment: "Perfect balance of crunch and creaminess. Highly recommend!" }
    ],
    image: "/src/assets/extra_crunchy.png",
    color: "#C67A32",
    bgGradient: "linear-gradient(135deg, #ECC89E 0%, #B0692D 100%)"
  },
  {
    id: "pb-dark-chocolate",
    name: "Dark Chocolate Dream Butter",
    tag: "Indulgent",
    type: "chocolate",
    tagline: "Decadent premium dark chocolate swirled with creamy peanuts.",
    description: "Indulge your sweet tooth guilt-free! We have combined our velvety smooth peanut butter with single-origin premium dark cacao and a touch of organic coconut sugar. The result is a luxurious, intensely rich chocolate spread that contains 70% less sugar than traditional chocolate spreads, while providing a healthy punch of protein.",
    rating: 4.7,
    reviewsCount: 843,
    baseWeight: "1kg",
    prices: {
      "1kg": 749,
      "2.5kg": 1699,
      "5kg": 2999
    },
    nutrition: {
      servingSize: "2 tbsp (32g)",
      calories: "185",
      protein: "7g",
      totalFat: "14g",
      saturatedFat: "4g",
      carbs: "9g",
      dietaryFiber: "2g",
      sugars: "4g (From organic coconut sugar)",
      sodium: "65mg"
    },
    ingredients: ["Dry-Roasted Peanuts", "Organic Premium Dark Cacao", "Organic Coconut Sugar", "Natural Vanilla Extract", "Sea Salt"],
    reviews: [
      { id: 1, author: "Meera R.", rating: 5, date: "2026-05-12", comment: "Tastes like a high-end dessert! I spread it on strawberries or eat it when I have late-night chocolate cravings. Truly amazing." },
      { id: 2, author: "John D.", rating: 4, date: "2026-05-05", comment: "Very tasty. Not overly sweet like Nutella, it has a sophisticated dark chocolate flavor." }
    ],
    image: "/src/assets/chocolate_dream.png",
    color: "#543310",
    bgGradient: "linear-gradient(135deg, #AE8660 0%, #462507 100%)"
  },
  {
    id: "pb-high-protein",
    name: "High-Protein Power Butter",
    tag: "Fitness Pack",
    type: "high-protein",
    tagline: "Boosted with premium whey isolate for active lifestyles.",
    description: "Designed for fitness enthusiasts and athletes, our High-Protein Power Butter is supercharged with premium grass-fed whey protein isolate. Each serving packs a whopping 12 grams of bioavailable protein to aid muscle recovery and keep you full longer. It maintains a wonderfully smooth texture without any gritty protein powder taste.",
    rating: 4.9,
    reviewsCount: 1540,
    baseWeight: "1kg",
    prices: {
      "1kg": 1199,
      "2.5kg": 2300,
      "5kg": 4000
    },
    nutrition: {
      servingSize: "2 tbsp (32g)",
      calories: "200",
      protein: "12g",
      totalFat: "15g",
      saturatedFat: "2g",
      carbs: "4g",
      dietaryFiber: "2g",
      sugars: "1g",
      sodium: "90mg"
    },
    ingredients: ["Organic Dry-Roasted Peanuts", "Grass-Fed Whey Protein Isolate", "Organic MCT Oil", "Sea Salt"],
    reviews: [
      { id: 1, author: "Vikram A.", rating: 5, date: "2026-05-16", comment: "12g of protein per serving makes this a absolute cheat-code for my diet. Texture is extremely smooth, easy to blend in shakes!" },
      { id: 2, author: "Rohan P.", rating: 5, date: "2026-05-11", comment: "Keeps me full for hours. Essential part of my breakfast prep." }
    ],
    image: "/src/assets/fitness_power.png",
    color: "#1E3E62",
    bgGradient: "linear-gradient(135deg, #7C98B3 0%, #153250 100%)"
  },
  {
    id: "pb-sugar-free",
    name: "Organic Pure Sugar-Free",
    tag: "Keto Friendly",
    type: "sugar-free",
    tagline: "Zero added sugars, zero oils—just pure peanut goodness.",
    description: "For the ultimate purist. Our Pure Sugar-Free Peanut Butter contains exactly one ingredient: certified organic, dry-roasted peanuts. Absolutely no added oils, salts, sweeteners, or preservatives. It's fully Keto, Paleo, and diabetic-friendly, allowing you to enjoy the raw, buttery, unadulterated flavor of nature's finest peanuts.",
    rating: 4.6,
    reviewsCount: 651,
    baseWeight: "1kg",
    prices: {
      "1kg": 569,
      "2.5kg": 1249,
      "5kg": 2099
    },
    nutrition: {
      servingSize: "2 tbsp (32g)",
      calories: "190",
      protein: "8g",
      totalFat: "16g",
      saturatedFat: "2g",
      carbs: "5g",
      dietaryFiber: "3g",
      sugars: "0g",
      sodium: "0mg"
    },
    ingredients: ["100% Certified Organic Dry-Roasted Peanuts Only"],
    reviews: [
      { id: 1, author: "Anjali T.", rating: 4, date: "2026-05-15", comment: "Takes a bit of stirring since there are no emulsifiers, but that is the sign of true natural peanut butter! Tastes extremely clean." },
      { id: 2, author: "Marcus L.", rating: 5, date: "2026-05-09", comment: "Perfect for keto diet. Hard to find 100% single ingredient products these days. Excellent quality." }
    ],
    image: "/src/assets/sugar_free.png",
    color: "#606C38",
    bgGradient: "linear-gradient(135deg, #A3B18A 0%, #47532A 100%)"
  },
  {
    id: "pb-honey-almond",
    name: "Honey Almond Peanut Blend",
    tag: "New Launch",
    type: "creamy",
    tagline: "Premium almonds and peanuts ground with organic honey.",
    description: "Experience the ultimate nut butter harmony! We ground premium California almonds and high-grade peanuts together with a slow drizzle of organic wildflower honey. This unique blend offers a sophisticated, mildly sweet, sweet-savory profile rich in Vitamin E, monounsaturated fats, and clean sustained energy.",
    rating: 4.8,
    reviewsCount: 310,
    baseWeight: "1kg",
    prices: {
      "1kg": 899,
      "2.5kg": 1999,
      "5kg": 3499
    },
    nutrition: {
      servingSize: "2 tbsp (32g)",
      calories: "192",
      protein: "7.5g",
      totalFat: "16g",
      saturatedFat: "2g",
      carbs: "7g",
      dietaryFiber: "2.5g",
      sugars: "3g (From natural honey)",
      sodium: "55mg"
    },
    ingredients: ["Dry-Roasted Peanuts (50%)", "Dry-Roasted Almonds (40%)", "Organic Wildflower Honey", "Sea Salt"],
    reviews: [
      { id: 1, author: "Arjun C.", rating: 5, date: "2026-05-06", comment: "This is a premium product. The almond flavor blended with peanut and the mild sweetness of honey is perfection. Must try." }
    ],
    image: "/src/assets/honey_almond.png",
    color: "#B5823F",
    bgGradient: "linear-gradient(135deg, #E6C594 0%, #8C5F23 100%)"
  }
];
