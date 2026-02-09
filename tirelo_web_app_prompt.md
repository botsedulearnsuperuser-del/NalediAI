# AI Prompt: Tirelo Web App - Premium Beauty & Style Marketplace

### **1. Core Concept & Aesthetic**
"Build a premium, high-end web application for **Tirelo**, a luxury marketplace for beauty and wellness services. The design must feel sophisticated, clean, and expensive. Use a palette of **Deep Black (#1A1A1A)**, **Pure White (#FFFFFF)**, and **Golden Yellow (#FFB800)** for accents. Incorporate words like 'Beauty', 'Style', 'Luxury', and 'Excellence' throughout the UI messaging. The layout should be spacious with modern typography (Inter or Montserrat) and subtle micro-animations."

### **2. Pages & Navigation**
- **Landing Page (Hero)**: 
    - A stunning full-width hero section with the word "TIRELO" in bold, elegant lettering. 
    - Tagline: "Partner with Excellence. Redefine Your Beauty."
    - High-quality imagery of luxury salon interiors and professional stylists.
    - Search bar to find "Services" or "Salons" by location.
    - Sections for "Trending Categories", "Featured Salons", and "How it Works".

- **Auth Pages**:
    - **Sign In / Sign Up**: Minimalist, centered forms with social login options.
    - **Provider Sign Up**: A specific path for "Beauty Professionals" to join, collection of business details, location, and service type.

- **User Dashboard (Client Side)**:
    - **Home**: Personalized greetings, "Your Next Appointment" countdown, and recommended salons.
    - **Explore**: A grid view of salons with filters for price, rating, and category.
    - **Bookings**: A clean list of upcoming and past appointments with status badges (Pending, Confirmed, Completed).
    - **Profile Settings**: Manage personal info, payment methods, and favorite salons.

- **Saloon Manager Dashboard (Provider Side)**:
    - **Overview**: Stats at a glance (Total Bookings, Revenue, Average Rating).
    - **Manage Profile**: A complex editor for the salon including:
        - **Visual Identity**: Banner upload and a "Gallery / Our Work" grid.
        - **Services**: Crud for services (Service Name, Price, Category).
        - **Team**: Manage stylists (Name, Role, Photo).
        - **Business Status**: An elegant "Opened/Closed" toggle.
    - **Live Bookings**: A real-time table or calendar view to manage client appointments.

### **3. Key Features to Include**
- **Booking Flow**: A multi-step interactive wizard. Step 1: Select Service; Step 2: Choose Stylist; Step 3: Pick Date & Time (Calendar view); Step 4: Confirm & Pay.
- **Mock Data**: Pre-populate the app with high-end mock salons like "Elegance Spa", "The Barber Lounge", and "Luxe Hair Studio" to show off the UI.
- **Search & Filter**: Real-time filtering by category (e.g., Barber, Nail Tech, Makeup Artist) and location.
- **Responsive Layout**: Ensure the dashboard looks like a professional SaaS platform on desktop (with sidebars) and a sleek mobile-friendly view for phones.

### **4. Technical Instructions**
- Use **React** with **Vite** or **Next.js**.
- Style with **Vanilla CSS** or **Tailwind CSS** (ensuring no generic colors; use the gold/black palette).
- Use **Lucide Icons** or **Ionicons** for a consistent look with the mobile app.
- Implement a global `Navigation` component that changes based on whether a user is a "Client" or "Provider".
