# 🛍️ Laline E-Commerce Website

<div align="center">

A modern, fully-functional e-commerce website for **Laline** - an Israeli beauty and skincare brand.  
Built with TypeScript, HTML5, and CSS3, featuring 40+ products with complete shopping functionality.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

## ✨ Features

### 🛒 Shopping Experience
- **Product Catalog**: Browse 40+ beauty and skincare products across 5 categories
- **Smart Search**: Real-time product search with instant results
- **Category Filtering**: Filter by Body Care, Face Care, Fragrances, Home, and Accessories
- **Product Sorting**: Sort by price (low to high, high to low) or name
- **Shopping Cart**: Add, remove, and update product quantities
- **Persistent Cart**: Cart data saved in localStorage
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 💰 Promotions & Discounts
- **Buy 400₪ Pay 200₪**: Automatic 50% discount for every 400₪ spent
- **Free Shipping**: Free delivery on orders over 200₪
- **Product Badges**: NEW, Sale, Popular, Limited Edition indicators
- **Dynamic Pricing**: Real-time discount calculations

### 🎨 User Interface
- **Modern Design**: Clean, elegant interface with smooth animations
- **RTL Support**: Full right-to-left layout for Hebrew language
- **Mega Menus**: Rich navigation with featured products
- **Product Cards**: Beautiful cards with hover effects and badges
- **Smooth Scrolling**: Enhanced user experience with smooth transitions
- **Scroll to Top**: Quick navigation button

### 📦 Checkout & Orders
- **Secure Checkout**: Complete order form with validation
- **Order Summary**: Real-time cart summary with discounts
- **Order Confirmation**: Success modal with order details
- **Order History**: View past orders (admin panel)

### 👤 User Management
- **User Accounts**: Login/Register functionality
- **Account Dashboard**: View profile and order history
- **Admin Panel**: Manage orders and view statistics

## 🚀 Getting Started

### Prerequisites
- Node.js (for TypeScript compilation)
- A local web server (Python, Node.js http-server, or VS Code Live Server)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TS-project---mark-73
   ```

2. **Install TypeScript** (if not already installed)
   ```bash
   npm install -g typescript
   ```

3. **Compile TypeScript files**
   ```bash
   tsc
   ```
   This compiles all `.ts` files from `ts/` directory to `.js` files in `js/` directory.

4. **Start a local web server**

   **Option A: VS Code Live Server** (Recommended)
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

   **Option B: Python**
   ```bash
   python -m http.server 8000
   ```

   **Option C: Node.js http-server**
   ```bash
   npm install -g http-server
   http-server -p 8000
   ```

5. **Open in browser**: Navigate to `http://localhost:8000` (or the port shown)

### Development

For automatic TypeScript compilation on file changes:
```bash
tsc --watch
```

---

## 📁 Project Structure

```
TS-project---mark-73/
├── index.html              # Homepage
├── styles.css              # Main stylesheet (70KB+)
├── tsconfig.json           # TypeScript configuration
├── README.md              # Documentation
│
├── pages/                 # HTML pages
│   ├── about.html         # About page
│   ├── account.html       # User account dashboard
│   ├── admin.html         # Admin panel
│   ├── cart.html          # Shopping cart
│   ├── checkout.html      # Checkout page
│   ├── faq.html           # FAQ
│   ├── privacy.html       # Privacy policy
│   ├── product.html       # Product details
│   ├── shipping.html      # Shipping info
│   └── terms.html         # Terms & conditions
│
├── ts/                    # TypeScript source files
│   ├── script.ts          # Main homepage logic (622 lines)
│   ├── data.ts            # Product database (40+ products)
│   ├── cart.ts            # Shopping cart functionality
│   ├── checkout.ts        # Checkout process
│   ├── product.ts         # Product page logic
│   ├── account.ts         # User authentication
│   └── admin.ts           # Admin panel
│
├── js/                    # Compiled JavaScript
│   └── *.js               # Compiled from TypeScript
│
└── images/                # Product images (40+ images)
```

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|----------|
| **TypeScript** | Type-safe JavaScript development |
| **HTML5** | Semantic markup |
| **CSS3** | Styling, animations, responsive design |
| **ES6 Modules** | Modern JavaScript modules |
| **LocalStorage API** | Persistent cart and user data |
| **CSS Grid & Flexbox** | Modern layouts |

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "ES6",
    "lib": ["ES6", "DOM"],
    "rootDir": "./ts",
    "outDir": "./js",
    "strict": true
  }
}
```

---

## 📄 Pages Overview

### 1. **Homepage** (`index.html`)
- Auto-rotating hero slider (5 banners)
- Top categories showcase
- Product grid with 40+ items
- Real-time search & filtering
- Category filters (Body Care, Face Care, Fragrances, Home, Accessories)
- Sorting options (Price, Name)
- Infinite scroll (20 products per load)
- Customer testimonials
- Newsletter subscription

### 2. **Shopping Cart** (`pages/cart.html`)
- Display cart items with images
- Quantity controls
- Real-time price calculations
- "Buy 400₪ Pay 200₪" discount
- Free shipping indicator (>200₪)
- Proceed to checkout

### 3. **Checkout** (`pages/checkout.html`)
- Customer information form
- Shipping address form
- Order summary
- Form validation
- Order confirmation modal

### 4. **Product Detail** (`pages/product.html`)
- Large product image
- Price display (current & old)
- Product badges
- Add to cart
- Quantity selector

### 5. **User Account** (`pages/account.html`)
- Login/Register forms
- Account dashboard
- Order history
- Profile management

### 6. **Admin Panel** (`pages/admin.html`)
- Order management
- Order statistics
- Status updates

### 7. **Additional Pages**
- About, FAQ, Privacy Policy, Shipping Info, Terms & Conditions

---

## 🔧 Key Functionalities

### Product Data Structure
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number | null;
  image: string;
  badge?: string;
  category: string;
}
```

### Shopping Cart System
- Add/remove products
- Update quantities
- Persistent storage (localStorage)
- Real-time total calculations
- Discount application

### Discount System
**Buy 400₪ Pay 200₪:**
```typescript
const discountSets = Math.floor(subtotal / 400);
const discount = discountSets * 200;
```

**Free Shipping:**
```typescript
const shipping = subtotal >= 200 ? 0 : 30;
```

### Search & Filter
- Real-time search by product name
- Category filtering
- Price sorting (Low to High, High to Low)
- Name sorting (A-Z)
- Result count display

### User Authentication
**Demo Credentials:**
- User: `user@example.com` / `password123`
- Admin: `admin@laline.com` / `admin123`

---

## ⚙️ Configuration

### Adding New Products

1. Edit `ts/data.ts`:
```typescript
{
  id: 41,
  name: "New Product",
  price: 99.90,
  oldPrice: null,
  image: "images/product.png",
  badge: "NEW",
  category: "body-care"
}
```

2. Compile: `tsc`
3. Add image to `images/` folder

### Customizing Discounts

Edit `ts/cart.ts` or `ts/checkout.ts` to modify discount thresholds and calculations.

---

## 🌐 Browser Support

✅ Chrome, Firefox, Safari, Edge, Opera (Latest versions)  
❌ Internet Explorer 11

**Requirements:** ES6, LocalStorage, CSS Grid, Flexbox, SVG

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and test
4. Commit: `git commit -m "Add new feature"`
5. Push: `git push origin feature/new-feature`
6. Create a Pull Request

---

## 📝 License

This project is for educational purposes.  
**Note:** Laline is a registered trademark. This is a demonstration project not affiliated with Laline Ltd.

---

## 📞 Contact

**Project Link:** [GitHub Repository](https://github.com/yourusername/TS-project---mark-73)

---

## 🙏 Acknowledgments

- Laline brand for inspiration
- TypeScript community
- Open source contributors

---

<div align="center">

**Made with ❤️ using TypeScript**

</div