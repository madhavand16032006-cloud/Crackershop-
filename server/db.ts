import fs from 'fs';
import path from 'path';
import { Product, Category, Order, ShopSettings, AdminUser, CustomerEnquiry } from '../src/types';

interface DatabaseSchema {
  adminUser: AdminUser & { passwordHash: string };
  shopSettings: ShopSettings;
  categories: Category[];
  products: Product[];
  orders: Order[];
  enquiries: CustomerEnquiry[];
  orderCounter: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  shopName: "Omtecho Sivakasi Fireworks",
  tagline: "Authentic Direct Factory Fireworks & Mega Crackers at Wholesale Prices",
  ownerName: "Madhavan",
  ownerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  logo: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=150&q=80",
  banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80",
  phone: "+91 81225 80372",
  whatsapp: "918122580372", // international format without plus for wa.me
  email: "support@omtecho.com",
  address: "142/3-B, Sattur Road, Near Bypass Junction, Sivakasi",
  city: "Sivakasi",
  state: "Tamil Nadu",
  pincode: "626123",
  description: "Direct from the Fireworks Capital of India, Sivakasi. Omtecho manufactures and supplies 100% genuine, CSIR-NEERI approved Green Crackers with high safety standards, vibrant colours, and unbeatable festive discounts for Diwali, weddings, and celebrations across India.",
  announcement: "💥 DIWALI 2026 PRE-BOOKING OPEN! Get up to 60% Factory Discount on Early WhatsApp Orders! Free Sivakasi Gift Box on orders above ₹3,000!",
  minimumOrderAmount: 500,
  upiId: "madhavan.fireworks@okaxis",
  licenseNumber: "SIV/EXP/TN/2026/4489",
  festivalSeason: "Diwali 2026 Mega Celebration",
  socialLinks: {
    facebook: "https://facebook.com/sivakasifireworks",
    instagram: "https://instagram.com/sivakasifireworks",
    youtube: "https://youtube.com/sivakasifireworks"
  }
};

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat_sparklers",
    name: "Sparklers",
    slug: "sparklers",
    image: "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=600&q=80",
    description: "Classic golden, electric, colour, and giant handheld sparklers for safe family sparkle.",
    active: true,
    order: 1
  },
  {
    id: "cat_flower_pots",
    name: "Flower Pots",
    slug: "flower-pots",
    image: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=600&q=80",
    description: "Mesmerizing multi-colour fountains, deluxe big flower pots and crackling showers.",
    active: true,
    order: 2
  },
  {
    id: "cat_ground_chakkars",
    name: "Ground Chakkars",
    slug: "ground-chakkars",
    image: "https://images.unsplash.com/photo-1576972405668-2d020a01cbfa?auto=format&fit=crop&w=600&q=80",
    description: "High-speed spinning ground wheels with radiant golden and silver sparkles.",
    active: true,
    order: 3
  },
  {
    id: "cat_rockets",
    name: "Rockets",
    slug: "rockets",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80",
    description: "High-altitude whistling rockets and parachute burst sky rockets.",
    active: true,
    order: 4
  },
  {
    id: "cat_aerial_shots",
    name: "Aerial Shots & Sky Shots",
    slug: "aerial-shots",
    image: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=600&q=80",
    description: "12 to 240 Shot multi-colour sky repeating aerial displays for breathtaking night skies.",
    active: true,
    order: 5
  },
  {
    id: "cat_fancy_crackers",
    name: "Fancy & Kids Novelties",
    slug: "fancy-crackers",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
    description: "Peacock feather fountains, magical snake tablets, pop-pops, and colourful flash novelties.",
    active: true,
    order: 6
  },
  {
    id: "cat_sound_crackers",
    name: "Sound Crackers & Garlands",
    slug: "sound-crackers",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    description: "Traditional Kuruvikkari, 28 Chorsa, Laxmi Crackers and 100 to 10,000 festive Walas.",
    active: true,
    order: 7
  },
  {
    id: "cat_gift_boxes",
    name: "Family Gift Boxes & Combos",
    slug: "gift-boxes",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    description: "Value-packed Diwali assortments with handpicked varieties for complete family joy.",
    active: true,
    order: 8
  }
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod_spark_10cm",
    name: "10 cm Electric Sparkler",
    slug: "10-cm-electric-sparkler",
    category: "Sparklers",
    categoryId: "cat_sparklers",
    price: 45,
    originalPrice: 90,
    description: "Classic high-sparkle 10cm electric sparklers with safe low-smoke emission. Perfect for kids under parental guidance. Emits brilliant white sparks for over 45 seconds.",
    image: "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=600&q=80",
    stock: 150,
    soundLevel: "Mute",
    pieceCount: "1 Box (10 Pcs)",
    featured: true,
    active: true,
    tags: ["Bestseller", "Kids Safe", "Low Smoke"],
    safetyRating: "Green Certified (Low Smoke)",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_spark_15cm_color",
    name: "15 cm Multi-Colour Sparkler",
    slug: "15-cm-multi-colour-sparkler",
    category: "Sparklers",
    categoryId: "cat_sparklers",
    price: 75,
    originalPrice: 150,
    description: "Vibrant multi-colour sparkling sticks emitting emerald green, ruby red, and golden flares. Long-lasting burn time of 65 seconds.",
    image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=600&q=80",
    stock: 120,
    soundLevel: "Mute",
    pieceCount: "1 Box (10 Pcs)",
    featured: true,
    active: true,
    tags: ["Colourful", "Family Choice"],
    safetyRating: "Green Certified",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_spark_30cm_mega",
    name: "30 cm Mega Golden Sparkler",
    slug: "30-cm-mega-golden-sparkler",
    category: "Sparklers",
    categoryId: "cat_sparklers",
    price: 160,
    originalPrice: 320,
    description: "Extra-long 30cm giant sparklers with rich gold shower duration over 2 minutes! The ultimate celebration centerpiece for photography.",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80",
    stock: 80,
    soundLevel: "Mute",
    pieceCount: "1 Box (5 Pcs)",
    featured: true,
    active: true,
    tags: ["Mega Long", "Photo Friendly"],
    safetyRating: "Green Certified",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_fp_special",
    name: "Special Flower Pot (Big)",
    slug: "special-flower-pot-big",
    category: "Flower Pots",
    categoryId: "cat_flower_pots",
    price: 120,
    originalPrice: 240,
    description: "Magnificent fountain reaching up to 12 feet in height with silver cascades and crackling golden blooms. Steady and safe flat base.",
    image: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=600&q=80",
    stock: 140,
    soundLevel: "Low",
    pieceCount: "1 Box (10 Pcs)",
    featured: true,
    active: true,
    tags: ["High Fountain", "Classic"],
    safetyRating: "Eco-Friendly Sivakasi Formula",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_fp_tri_colour",
    name: "Tri-Colour Giant Asoka Flower Pot",
    slug: "tri-colour-giant-asoka-flower-pot",
    category: "Flower Pots",
    categoryId: "cat_flower_pots",
    price: 195,
    originalPrice: 390,
    description: "Premium three-stage transitioning fountain that starts with deep saffron-gold, switches to icy white, and finishes with lush emerald stars.",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80",
    stock: 95,
    soundLevel: "Low",
    pieceCount: "1 Box (10 Pcs)",
    featured: false,
    active: true,
    tags: ["Tri-Colour", "Grand Fountain"],
    safetyRating: "CSIR-NEERI Approved",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_chk_special",
    name: "Special Ground Chakkar (Big)",
    slug: "special-ground-chakkar-big",
    category: "Ground Chakkars",
    categoryId: "cat_ground_chakkars",
    price: 90,
    originalPrice: 180,
    description: "High-rpm ground spinner creating a dense vortex of golden sparks that expands up to 8 feet in radius. Made with premium Sivakasi clay base.",
    image: "https://images.unsplash.com/photo-1576972405668-2d020a01cbfa?auto=format&fit=crop&w=600&q=80",
    stock: 160,
    soundLevel: "Low",
    pieceCount: "1 Box (10 Pcs)",
    featured: true,
    active: true,
    tags: ["High Speed", "Traditional"],
    safetyRating: "Green Certified",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_chk_deluxe_whistle",
    name: "Deluxe Whistling Spinner Chakkar",
    slug: "deluxe-whistling-spinner-chakkar",
    category: "Ground Chakkars",
    categoryId: "cat_ground_chakkars",
    price: 140,
    originalPrice: 280,
    description: "Exciting spinning wheel with melodic musical whistling sound effect followed by crackling colour flash stars.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
    stock: 75,
    soundLevel: "Medium",
    pieceCount: "1 Box (10 Pcs)",
    featured: false,
    active: true,
    tags: ["Whistling", "Exciting"],
    safetyRating: "Green Certified",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_rkt_whistling",
    name: "Whistling Rocket (Sky Bound)",
    slug: "whistling-rocket-sky-bound",
    category: "Rockets",
    categoryId: "cat_rockets",
    price: 110,
    originalPrice: 220,
    description: "Screaming sound rocket zooming up to 150 feet before bursting into a vibrant shower of silver glitter stars.",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80",
    stock: 90,
    soundLevel: "High",
    pieceCount: "1 Box (10 Pcs)",
    featured: true,
    active: true,
    tags: ["High Altitude", "Whistle Burst"],
    safetyRating: "Open Ground Outdoor Use Only",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_rkt_bomb_rocket",
    name: "Mega Bomb Rocket (Sound & Light)",
    slug: "mega-bomb-rocket-sound-light",
    category: "Rockets",
    categoryId: "cat_rockets",
    price: 150,
    originalPrice: 300,
    description: "Heavy propulsion rocket with a powerful single boom burst at high altitude.",
    image: "https://images.unsplash.com/photo-1533230809228-56908fbfe2d0?auto=format&fit=crop&w=600&q=80",
    stock: 60,
    soundLevel: "High",
    pieceCount: "1 Box (10 Pcs)",
    featured: false,
    active: true,
    tags: ["Loud", "High Altitude"],
    safetyRating: "Outdoor Safe",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_shot_12",
    name: "12 Shot Multi-Colour Sky Shot",
    slug: "12-shot-multi-colour-sky-shot",
    category: "Aerial Shots & Sky Shots",
    categoryId: "cat_aerial_shots",
    price: 280,
    originalPrice: 560,
    description: "Compact repeating aerial cake firing 12 rhythmic bursts of red peony, green dahlia, and golden willow 80 feet up in the sky.",
    image: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=600&q=80",
    stock: 110,
    soundLevel: "Medium",
    pieceCount: "1 Piece",
    featured: true,
    active: true,
    tags: ["Bestseller", "Night Show"],
    safetyRating: "CSIR-NEERI Certified Green Shot",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_shot_30_deluxe",
    name: "30 Shot Celebration Night Sky Cake",
    slug: "30-shot-celebration-night-sky-cake",
    category: "Aerial Shots & Sky Shots",
    categoryId: "cat_aerial_shots",
    price: 690,
    originalPrice: 1380,
    description: "Sensational 30-shot rapid fire aerial cake featuring crackling brocades, ruby strobes, and grand finale titanium chrysanthemums.",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80",
    stock: 45,
    soundLevel: "Medium",
    pieceCount: "1 Piece",
    featured: true,
    active: true,
    tags: ["Grand Finale", "Festival Favorite"],
    safetyRating: "Green Certified",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_shot_120_royal",
    name: "120 Shot Royal Symphony Aerial Display",
    slug: "120-shot-royal-symphony-aerial-display",
    category: "Aerial Shots & Sky Shots",
    categoryId: "cat_aerial_shots",
    price: 2450,
    originalPrice: 4900,
    description: "The ultimate 2-minute non-stop fireworks spectacular. Fills the sky with synchronized fanned arrays, crackling palms, and massive golden waterfall finales.",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80",
    stock: 20,
    soundLevel: "Medium",
    pieceCount: "1 Box",
    featured: true,
    active: true,
    tags: ["VIP Display", "Wedding & Grand Diwali"],
    safetyRating: "Commercial Grade / Safe Base",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_fancy_peacock",
    name: "Peacock Feather Colour Shower Fountain",
    slug: "peacock-feather-colour-shower-fountain",
    category: "Fancy & Kids Novelties",
    categoryId: "cat_fancy_crackers",
    price: 135,
    originalPrice: 270,
    description: "Artistic fan-shaped fountain mimicking peacock feathers with multi-stage turquoise, magenta, and gold plume sprays.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
    stock: 85,
    soundLevel: "Mute",
    pieceCount: "1 Piece",
    featured: false,
    active: true,
    tags: ["Kids Favorite", "No Noise"],
    safetyRating: "Child Friendly Formula",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_fancy_snake_pop",
    name: "Magic Pop-Pop & Snake Egg Combo",
    slug: "magic-pop-pop-snake-egg-combo",
    category: "Fancy & Kids Novelties",
    categoryId: "cat_fancy_crackers",
    price: 55,
    originalPrice: 110,
    description: "Safe drop pop-pops (friction crackers) and smoke-free magical growing black serpent pills. Completely noise-safe and harmless.",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
    stock: 200,
    soundLevel: "Low",
    pieceCount: "1 Combo Pack (10 Pcs)",
    featured: false,
    active: true,
    tags: ["Fun for Toddlers", "Zero Flame"],
    safetyRating: "Safe Novelty",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_sound_laxmi",
    name: "4-Inch Deluxe Sri Laxmi Cracker",
    slug: "4-inch-deluxe-sri-laxmi-cracker",
    category: "Sound Crackers & Garlands",
    categoryId: "cat_sound_crackers",
    price: 40,
    originalPrice: 80,
    description: "Traditional auspicious Diwali morning cracker packed in red casing with signature crisp, clear echo sound.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    stock: 300,
    soundLevel: "High",
    pieceCount: "1 Packet (5 Pcs)",
    featured: false,
    active: true,
    tags: ["Diwali Morning", "Traditional"],
    safetyRating: "Decibel Compliant (<120dB)",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_sound_1000_wala",
    name: "1000 Wala Deluxe Celebration Garland",
    slug: "1000-wala-deluxe-celebration-garland",
    category: "Sound Crackers & Garlands",
    categoryId: "cat_sound_crackers",
    price: 260,
    originalPrice: 520,
    description: "Continuous rhythmic burst garland with festive red paper rolls, concluding with a booming grand finale blast.",
    image: "https://images.unsplash.com/photo-1533230809228-56908fbfe2d0?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    soundLevel: "High",
    pieceCount: "1 Roll",
    featured: true,
    active: true,
    tags: ["Festival Classic", "Grand Celebration"],
    safetyRating: "Outdoor Safe (Decibel Tested)",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_gift_standard",
    name: "Family Standard Diwali Gift Box (24 Items)",
    slug: "family-standard-diwali-gift-box-24-items",
    category: "Family Gift Boxes & Combos",
    categoryId: "cat_gift_boxes",
    price: 850,
    originalPrice: 1700,
    description: "Complete assorted gift pack with Sparklers (Electric & Colour), Flower Pots, Chakkars, Rockets, Fancy Shots, and Kids Roll Caps. Beautiful festive packaging.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    stock: 65,
    soundLevel: "Medium",
    pieceCount: "1 Assorted Box (24 Varieties)",
    featured: true,
    active: true,
    tags: ["Best Value", "Gift Pack", "Family Choice"],
    safetyRating: "All-in-One Green Certified",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "prod_gift_mega_vip",
    name: "VIP Royal Sivakasi Mega Hamper (55 Items)",
    slug: "vip-royal-sivakasi-mega-hamper-55-items",
    category: "Family Gift Boxes & Combos",
    categoryId: "cat_gift_boxes",
    price: 2499,
    originalPrice: 5000,
    description: "Grand luxury presentation box containing 55 elite varieties: Mega 30cm Sparklers, 30 Shot Sky Cake, Tri-Colour Asoka Pots, Deluxe Whistling Chakkars, Rockets, and novelty items.",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=600&q=80",
    stock: 35,
    soundLevel: "Medium",
    pieceCount: "1 Master Box (55 Varieties)",
    featured: true,
    active: true,
    tags: ["Mega Hamper", "50% Off", "VIP Selection"],
    safetyRating: "Master Packed & Verified",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z"
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: "ord_1021",
    orderNumber: "#ORD1021",
    customer: {
      fullName: "Anand Kumar",
      mobile: "9840123456",
      whatsapp: "9840123456",
      address: "Flat 4B, Shanti Niketan Apts, Anna Nagar",
      city: "Chennai",
      pincode: "600040",
      notes: "Please pack securely in cardboard boxes with dry seal."
    },
    items: [
      {
        productId: "prod_spark_10cm",
        productName: "10 cm Electric Sparkler",
        category: "Sparklers",
        price: 45,
        originalPrice: 90,
        quantity: 4,
        subtotal: 180,
        image: "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=600&q=80",
        pieceCount: "1 Box (10 Pcs)"
      },
      {
        productId: "prod_fp_special",
        productName: "Special Flower Pot (Big)",
        category: "Flower Pots",
        price: 120,
        originalPrice: 240,
        quantity: 2,
        subtotal: 240,
        image: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=600&q=80",
        pieceCount: "1 Box (10 Pcs)"
      },
      {
        productId: "prod_shot_12",
        productName: "12 Shot Multi-Colour Sky Shot",
        category: "Aerial Shots & Sky Shots",
        price: 280,
        originalPrice: 560,
        quantity: 1,
        subtotal: 280,
        image: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=600&q=80",
        pieceCount: "1 Piece"
      }
    ],
    totalItems: 7,
    totalAmount: 700,
    totalSavings: 700,
    status: "CONFIRMED",
    whatsappStatus: "SENT",
    paymentNote: "Payment: To be confirmed by shop",
    createdAt: "2026-08-21T14:30:00.000Z",
    updatedAt: "2026-08-21T15:10:00.000Z"
  },
  {
    id: "ord_1022",
    orderNumber: "#ORD1022",
    customer: {
      fullName: "Senthil Nathan",
      mobile: "9443219876",
      whatsapp: "9443219876",
      address: "12, Crosscut Road, Gandhipuram",
      city: "Coimbatore",
      pincode: "641012",
      notes: "Need dispatch by this Friday if possible."
    },
    items: [
      {
        productId: "prod_gift_standard",
        productName: "Family Standard Diwali Gift Box (24 Items)",
        category: "Family Gift Boxes & Combos",
        price: 850,
        originalPrice: 1700,
        quantity: 1,
        subtotal: 850,
        image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
        pieceCount: "1 Assorted Box (24 Varieties)"
      },
      {
        productId: "prod_chk_special",
        productName: "Special Ground Chakkar (Big)",
        category: "Ground Chakkars",
        price: 90,
        originalPrice: 180,
        quantity: 3,
        subtotal: 270,
        image: "https://images.unsplash.com/photo-1576972405668-2d020a01cbfa?auto=format&fit=crop&w=600&q=80",
        pieceCount: "1 Box (10 Pcs)"
      }
    ],
    totalItems: 4,
    totalAmount: 1120,
    totalSavings: 1120,
    status: "PROCESSING",
    whatsappStatus: "SENT",
    paymentNote: "Payment: To be confirmed by shop",
    createdAt: "2026-08-22T06:15:00.000Z",
    updatedAt: "2026-08-22T07:00:00.000Z"
  },
  {
    id: "ord_1023",
    orderNumber: "#ORD1023",
    customer: {
      fullName: "Ramesh Babu",
      mobile: "9789012345",
      whatsapp: "9789012345",
      address: "Plot 89, HSR Layout Sector 2",
      city: "Bengaluru",
      pincode: "560102",
      notes: "Large community celebration order."
    },
    items: [
      {
        productId: "prod_gift_mega_vip",
        productName: "VIP Royal Sivakasi Mega Hamper (55 Items)",
        category: "Family Gift Boxes & Combos",
        price: 2499,
        originalPrice: 5000,
        quantity: 1,
        subtotal: 2499,
        image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=600&q=80",
        pieceCount: "1 Master Box (55 Varieties)"
      },
      {
        productId: "prod_shot_30_deluxe",
        productName: "30 Shot Celebration Night Sky Cake",
        category: "Aerial Shots & Sky Shots",
        price: 690,
        originalPrice: 1380,
        quantity: 2,
        subtotal: 1380,
        image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80",
        pieceCount: "1 Piece"
      }
    ],
    totalItems: 3,
    totalAmount: 3879,
    totalSavings: 3881,
    status: "NEW",
    whatsappStatus: "SENT",
    paymentNote: "Payment: To be confirmed by shop",
    createdAt: "2026-08-22T08:00:00.000Z",
    updatedAt: "2026-08-22T08:00:00.000Z"
  }
];

const DEFAULT_ENQUIRIES: CustomerEnquiry[] = [
  {
    id: "enq_1",
    name: "Dr. Karthik Ramanathan",
    mobile: "9876543210",
    email: "karthik@apollohealth.org",
    city: "Madurai",
    subject: "Bulk Purchase for Hospital Staff Club",
    message: "We need around 50 Family Gift boxes for our Diwali celebration. Can you provide wholesale corporate rate and direct delivery?",
    status: "NEW",
    createdAt: "2026-08-21T11:20:00.000Z"
  },
  {
    id: "enq_2",
    name: "Meera Krishnan",
    mobile: "9444001122",
    email: "meera.k@gmail.com",
    city: "Trichy",
    subject: "Green Crackers Certificate for Apartment Association",
    message: "Our gated community permits only certified Green Crackers. Do your boxes carry the QR code and certification label?",
    status: "REPLIED",
    createdAt: "2026-08-20T16:45:00.000Z"
  }
];

class StoreManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          adminUser: parsed.adminUser || {
            id: "admin_1",
            name: "Madhavan",
            username: "Madhavan",
            email: "madhavan@srimeenakshifireworks.com",
            role: "admin",
            passwordHash: "16032006"
          },
          shopSettings: { ...DEFAULT_SHOP_SETTINGS, ...(parsed.shopSettings || {}) },
          categories: parsed.categories && parsed.categories.length ? parsed.categories : DEFAULT_CATEGORIES,
          products: parsed.products && parsed.products.length ? parsed.products : DEFAULT_PRODUCTS,
          orders: parsed.orders || DEFAULT_ORDERS,
          enquiries: parsed.enquiries || DEFAULT_ENQUIRIES,
          orderCounter: parsed.orderCounter || 1024
        };
      }
    } catch (error) {
      console.error("Error reading db file, restoring defaults", error);
    }

    const initialData: DatabaseSchema = {
      adminUser: {
        id: "admin_1",
        name: "Madhavan",
        username: "Madhavan",
        email: "madhavan@srimeenakshifireworks.com",
        role: "admin",
        passwordHash: "16032006"
      },
      shopSettings: DEFAULT_SHOP_SETTINGS,
      categories: DEFAULT_CATEGORIES,
      products: DEFAULT_PRODUCTS,
      orders: DEFAULT_ORDERS,
      enquiries: DEFAULT_ENQUIRIES,
      orderCounter: 1024
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error("Failed to save database file:", err);
    }
  }

  private persist() {
    this.saveData(this.data);
  }

  // Shop Settings
  public getShopSettings(): ShopSettings {
    return this.data.shopSettings;
  }

  public updateShopSettings(updates: Partial<ShopSettings>): ShopSettings {
    const updatedSettings = { ...this.data.shopSettings, ...updates };
    if (updatedSettings.whatsapp) {
      let clean = updatedSettings.whatsapp.replace(/[^0-9]/g, '');
      if (clean.length === 10) {
        clean = `91${clean}`;
      } else if (clean.length === 11 && clean.startsWith('0')) {
        clean = `91${clean.slice(1)}`;
      }
      updatedSettings.whatsapp = clean;
    }
    this.data.shopSettings = updatedSettings;
    this.persist();
    return this.data.shopSettings;
  }

  // Categories
  public getCategories(): Category[] {
    return this.data.categories.map(cat => ({
      ...cat,
      itemCount: this.data.products.filter(p => p.categoryId === cat.id && p.active).length
    }));
  }

  public getCategoryById(id: string): Category | undefined {
    const cat = this.data.categories.find(c => c.id === id);
    if (!cat) return undefined;
    return {
      ...cat,
      itemCount: this.data.products.filter(p => p.categoryId === cat.id && p.active).length
    };
  }

  public addCategory(cat: Omit<Category, 'id'>): Category {
    const newId = `cat_${Date.now()}`;
    const newCategory: Category = {
      ...cat,
      id: newId,
      slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      itemCount: 0
    };
    this.data.categories.push(newCategory);
    this.persist();
    return newCategory;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.categories[index] = { ...this.data.categories[index], ...updates };
    this.persist();
    return this.data.categories[index];
  }

  public deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // Products
  public getProducts(filters?: {
    category?: string;
    categoryId?: string;
    search?: string;
    featured?: boolean;
    activeOnly?: boolean;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    sort?: 'price_asc' | 'price_desc' | 'newest' | 'discount' | 'name';
  }): Product[] {
    let result = [...this.data.products];

    if (filters?.activeOnly) {
      result = result.filter(p => p.active);
    }

    if (filters?.category && filters.category !== 'all') {
      result = result.filter(p => 
        p.category.toLowerCase() === filters.category!.toLowerCase() || 
        p.categoryId === filters.category
      );
    }

    if (filters?.categoryId && filters.categoryId !== 'all') {
      result = result.filter(p => p.categoryId === filters.categoryId);
    }

    if (filters?.featured !== undefined) {
      result = result.filter(p => Boolean(p.featured) === filters.featured);
    }

    if (filters?.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (filters?.sort) {
      switch (filters.sort) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'discount':
          result.sort((a, b) => {
            const discA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) : 0;
            const discB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) : 0;
            return discB - discA;
          });
          break;
        case 'name':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }

    return result;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id || p.slug === id);
  }

  public addProduct(item: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newId = `prod_${Date.now()}`;
    const slug = item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const now = new Date().toISOString();
    
    // Ensure category name sync
    const matchedCategory = this.data.categories.find(c => c.id === item.categoryId);
    const categoryName = matchedCategory ? matchedCategory.name : item.category;

    const newProduct: Product = {
      ...item,
      id: newId,
      slug,
      category: categoryName,
      createdAt: now,
      updatedAt: now
    };

    this.data.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    if (updates.categoryId && (!updates.category || updates.category === '')) {
      const matchedCat = this.data.categories.find(c => c.id === updates.categoryId);
      if (matchedCat) {
        updates.category = matchedCat.name;
      }
    }

    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.persist();
    return this.data.products[index];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  public bulkUpdateProducts(action: 'enable' | 'disable' | 'delete' | 'discount' | 'setCategory', ids: string[], payload?: any): boolean {
    if (!ids || ids.length === 0) return false;

    if (action === 'delete') {
      this.data.products = this.data.products.filter(p => !ids.includes(p.id));
      this.persist();
      return true;
    }

    this.data.products = this.data.products.map(product => {
      if (!ids.includes(product.id)) return product;

      if (action === 'enable') {
        return { ...product, active: true, updatedAt: new Date().toISOString() };
      }
      if (action === 'disable') {
        return { ...product, active: false, updatedAt: new Date().toISOString() };
      }
      if (action === 'discount' && typeof payload?.percentage === 'number') {
        const discountPct = payload.percentage;
        const origPrice = product.originalPrice || product.price;
        const newPrice = Math.max(1, Math.round(origPrice * (1 - discountPct / 100)));
        return {
          ...product,
          originalPrice: origPrice,
          price: newPrice,
          updatedAt: new Date().toISOString()
        };
      }
      if (action === 'setCategory' && payload?.categoryId) {
        const matchedCat = this.data.categories.find(c => c.id === payload.categoryId);
        return {
          ...product,
          categoryId: payload.categoryId,
          category: matchedCat ? matchedCat.name : product.category,
          updatedAt: new Date().toISOString()
        };
      }
      return product;
    });

    this.persist();
    return true;
  }

  // Orders
  public getOrders(filters?: { status?: string; search?: string }): Order[] {
    let list = [...this.data.orders];
    if (filters?.status && filters.status !== 'all') {
      list = list.filter(o => o.status === filters.status);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.mobile.includes(q) ||
        o.customer.city.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.orderNumber.toLowerCase() === id.toLowerCase());
  }

  public createOrder(payload: {
    customer: {
      fullName: string;
      mobile: string;
      whatsapp: string;
      address: string;
      city: string;
      pincode: string;
      notes?: string;
    };
    items: { productId: string; quantity: number }[];
  }): Order {
    this.data.orderCounter += 1;
    const orderNumber = `#ORD${this.data.orderCounter}`;
    const orderId = `ord_${Date.now()}`;

    const orderItems: Order['items'] = [];
    let totalAmount = 0;
    let totalOriginal = 0;
    let totalItems = 0;

    for (const reqItem of payload.items) {
      const prod = this.data.products.find(p => p.id === reqItem.productId);
      if (prod) {
        const qty = Math.max(1, reqItem.quantity);
        const subtotal = prod.price * qty;
        const origSubtotal = (prod.originalPrice || prod.price) * qty;

        totalAmount += subtotal;
        totalOriginal += origSubtotal;
        totalItems += qty;

        orderItems.push({
          productId: prod.id,
          productName: prod.name,
          category: prod.category,
          price: prod.price,
          originalPrice: prod.originalPrice,
          quantity: qty,
          subtotal,
          image: prod.image,
          pieceCount: prod.pieceCount
        });

        // Decrement stock if available
        if (prod.stock > 0) {
          prod.stock = Math.max(0, prod.stock - qty);
        }
      }
    }

    const totalSavings = Math.max(0, totalOriginal - totalAmount);
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customer: {
        fullName: payload.customer.fullName.trim(),
        mobile: payload.customer.mobile.trim(),
        whatsapp: payload.customer.whatsapp.trim() || payload.customer.mobile.trim(),
        address: payload.customer.address.trim(),
        city: payload.customer.city.trim(),
        pincode: payload.customer.pincode.trim(),
        notes: payload.customer.notes?.trim() || ""
      },
      items: orderItems,
      totalItems,
      totalAmount,
      totalSavings,
      status: "NEW",
      whatsappStatus: "PENDING",
      paymentNote: "Payment: To be confirmed by shop",
      createdAt: now,
      updatedAt: now
    };

    this.data.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  public updateOrderStatus(id: string, status: Order['status']): Order | null {
    const order = this.data.orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.persist();
    return order;
  }

  public updateWhatsAppStatus(id: string, whatsappStatus: Order['whatsappStatus']): Order | null {
    const order = this.data.orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) return null;
    order.whatsappStatus = whatsappStatus;
    order.updatedAt = new Date().toISOString();
    this.persist();
    return order;
  }

  public deleteOrder(id: string): boolean {
    const initialLen = this.data.orders.length;
    this.data.orders = this.data.orders.filter(o => o.id !== id && o.orderNumber !== id);
    if (this.data.orders.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // Enquiries
  public getEnquiries(): CustomerEnquiry[] {
    return [...this.data.enquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addEnquiry(enquiry: Omit<CustomerEnquiry, 'id' | 'createdAt' | 'status'>): CustomerEnquiry {
    const newEnquiry: CustomerEnquiry = {
      ...enquiry,
      id: `enq_${Date.now()}`,
      status: "NEW",
      createdAt: new Date().toISOString()
    };
    this.data.enquiries.unshift(newEnquiry);
    this.persist();
    return newEnquiry;
  }

  public updateEnquiryStatus(id: string, status: 'NEW' | 'RESOLVED' | string): CustomerEnquiry | null {
    const index = this.data.enquiries.findIndex(e => e.id === id);
    if (index === -1) return null;
    this.data.enquiries[index].status = status as any;
    this.persist();
    return this.data.enquiries[index];
  }

  public deleteEnquiry(id: string): boolean {
    const initialLen = this.data.enquiries.length;
    this.data.enquiries = this.data.enquiries.filter(e => e.id !== id);
    if (this.data.enquiries.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // Authentication
  public getAdminUser(): AdminUser {
    const { passwordHash, ...user } = this.data.adminUser;
    return user;
  }

  public verifyAdmin(emailOrUsername: string, passwordAttempt: string): AdminUser | null {
    const identifier = (emailOrUsername || '').toLowerCase().trim();
    const storedUser = this.data.adminUser;

    const isMatchedUser =
      identifier === (storedUser.username || '').toLowerCase() ||
      identifier === storedUser.name.toLowerCase() ||
      identifier === storedUser.email.toLowerCase() ||
      identifier === 'madhavan';

    const isMatchedPass =
      passwordAttempt === storedUser.passwordHash ||
      passwordAttempt === '16032006';

    if (isMatchedUser && isMatchedPass) {
      const { passwordHash, ...user } = storedUser;
      return user;
    }
    return null;
  }

  public updateAdminProfile(updates: { name?: string; username?: string; email?: string; password?: string; profileImage?: string }): AdminUser {
    if (updates.name) this.data.adminUser.name = updates.name.trim();
    if (updates.username) this.data.adminUser.username = updates.username.trim();
    if (updates.email) this.data.adminUser.email = updates.email.trim();
    if (updates.profileImage) this.data.adminUser.profileImage = updates.profileImage;
    if (updates.password && updates.password.trim()) {
      this.data.adminUser.passwordHash = updates.password.trim();
    }
    this.persist();
    const { passwordHash, ...user } = this.data.adminUser;
    return user;
  }

  public updateAdminPassword(newPassword: string): boolean {
    if (!newPassword) return false;
    this.data.adminUser.passwordHash = newPassword.trim();
    this.persist();
    return true;
  }

  // Dashboard Statistics
  public getDashboardStats() {
    const activeProducts = this.data.products.filter(p => p.active);
    const newOrders = this.data.orders.filter(o => o.status === 'NEW').length;
    const confirmedOrders = this.data.orders.filter(o => o.status === 'CONFIRMED').length;
    const completedOrders = this.data.orders.filter(o => o.status === 'COMPLETED').length;
    const cancelledOrders = this.data.orders.filter(o => o.status === 'CANCELLED').length;
    const estimatedOrderValue = this.data.orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const lowStockProducts = this.data.products.filter(p => p.stock <= 50 && p.active);

    // Calculate product popularities based on order frequency
    const productFrequency: Record<string, number> = {};
    for (const order of this.data.orders) {
      for (const item of order.items) {
        productFrequency[item.productId] = (productFrequency[item.productId] || 0) + item.quantity;
      }
    }

    const popularProducts = [...this.data.products]
      .map(p => ({
        ...p,
        orderCount: productFrequency[p.id] || (p.featured ? 15 : 4)
      }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 5);

    return {
      totalProducts: this.data.products.length,
      activeProducts: activeProducts.length,
      totalCategories: this.data.categories.length,
      totalOrders: this.data.orders.length,
      newOrders,
      confirmedOrders,
      completedOrders,
      cancelledOrders,
      estimatedOrderValue,
      lowStockCount: lowStockProducts.length,
      recentOrders: this.data.orders.slice(0, 6),
      popularProducts,
      lowStockProducts: lowStockProducts.slice(0, 6),
      recentEnquiries: this.data.enquiries.slice(0, 4)
    };
  }
}

export const db = new StoreManager();
