const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const projectRoutes = require('./routes/project');
const adminRoutes = require('./routes/admin');

const User = require('./models/User');
const Project = require('./models/Project');
const Sale = require('./models/Sale');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
// Raised limit so base64-encoded project image uploads fit in the request body
app.use(express.json({ limit: '15mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

const PORT = process.env.PORT || 5000;

// Database seeding logic
const seedDatabase = async () => {
  try {
    // 1. Seed admin user
    const adminEmail = 'admin@grazia.com';
    const adminPassword = 'Grazia@2026';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'Admin Developer',
        email: adminEmail,
        password: adminPassword,
        isAdmin: true
      });
      console.log(`Seeded admin user: ${adminEmail} / ${adminPassword}`);
    }

    // 2. Seed projects
    const projectCount = await Project.countDocuments({});
    if (projectCount === 0) {
      const defaultProjects = [
        {
          id: "farm-dale",
          title: "The Farm Dale",
          location: "Karjat, Maharashtra",
          image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
          description: "Luxury farmhouse plots with premium amenities nestled in the lap of nature.",
          status: "Ongoing",
          longDescription: "Escape the city hustle and embrace a lifestyle of tranquility at The Farm Dale. Located in the picturesque landscape of Karjat, this project offers expansive luxury farmhouse plots. Enjoy a perfect blend of modern amenities and natural beauty, featuring state-of-the-art infrastructure, a clubhouse, swimming pools, and extensive green zones. Perfect for a weekend retreat or a permanent peaceful residence.",
          features: ["Clubhouse", "Swimming Pool", "24/7 Security", "Landscaped Gardens", "Rainwater Harvesting"]
        },
        {
          id: "dapoli-712",
          title: "Dapoli 712",
          location: "Kelashi, Coastal Region",
          image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80",
          description: "A serene coastal living project offering tranquility and scenic ocean views.",
          status: "Pre-Launch",
          longDescription: "Dapoli 712 presents a rare opportunity to own a piece of coastal paradise. Overlooking the pristine Kelashi beaches, this project is designed for those who seek the ultimate serene lifestyle. Enjoy breathtaking sunsets, unpolluted ocean breezes, and a carefully curated community built with sustainable, eco-friendly materials.",
          features: ["Ocean Views", "Private Beach Access", "Eco-Friendly Design", "Organic Farms", "Yoga Pavilion"]
        },
        {
          id: "maha-mumbai-hub",
          title: "Third Mumbai (KSC New Town)",
          location: "Navi Mumbai",
          image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
          description: "Strategic commercial and residential plots near the upcoming international airport.",
          status: "Completed",
          longDescription: "Positioned at the epicenter of the new growth corridor, Third Mumbai Hub offers unparalleled connectivity and investment potential. Situated adjacent to the Navi Mumbai International Airport and the Atal Setu infrastructure, these mixed-use plots guarantee massive capital appreciation and top-tier infrastructural benefits.",
          features: ["Commercial Zones", "Airport Proximity", "Wide Access Roads", "High ROI Potential", "Smart Grid Layout"]
        },
        {
          id: "green-valley-heights",
          title: "Green Valley Heights",
          location: "Lonavala",
          image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80",
          description: "Premium villa plots overlooking the lush Lonavala valleys.",
          status: "Ongoing",
          longDescription: "Perched high in the Sahyadri mountains, Green Valley Heights offers premium villa plots that provide uninterrupted, panoramic views of the Lonavala valleys. The project features luxury infrastructure, dedicated viewpoints, and a cool, foggy climate year-round, making it an ideal second home destination.",
          features: ["Valley Views", "Gated Community", "Trekking Trails", "Private Plunge Pools", "Luxury Clubhouse"]
        },
        {
          id: "athiya-business-park",
          title: "Athiya Business Park",
          location: "Kharghar",
          image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80",
          description: "State-of-the-art commercial spaces designed for modern enterprises.",
          status: "Planning",
          longDescription: "Athiya Business Park is an upcoming state-of-the-art commercial and IT hub located in the heart of Kharghar. Designed for maximum productivity, the park will feature green buildings, smart parking, high-speed connectivity, and an ecosystem that supports modern enterprises and startups alike.",
          features: ["Grade A Office Spaces", "Smart Parking", "Cafeterias", "Conference Centers", "LEED Certified"]
        },
        {
          id: "riverside-residencies",
          title: "Riverside Residencies",
          location: "Panvel",
          image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80",
          description: "Exclusive residential towers with uninterrupted river views.",
          status: "Completed",
          longDescription: "Riverside Residencies is a completed flagship residential project offering luxury apartments along the Panvel riverfront. Residents enjoy world-class amenities, stunning riverside promenades, and a peaceful environment that feels miles away from the city, despite being highly connected to major transit hubs.",
          features: ["Riverfront Promenade", "Infinity Pool", "Gymnasium", "Children's Play Area", "Amphitheater"]
        },
        {
          id: "Uran",
          title: "Uran",
          location: "Uran",
          image: "/Location/Uran_main.jpeg",
          description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers.",
          status: "Planning",
          longDescription: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets.",
          features: ["Clear Titles", "Proximity to Port", "Road Access"]
        },
        {
          id: "Pawan",
          title: "Pawan",
          location: "Lonavala",
          image: "/Location/Pawan_lonavala_main.jpeg",
          description: "Pawna, Lonavala is a 7 acres agricultural land located approx. 1 hr 55 mins from Navimumbai Int Airport | 2 Hrs 32 mins from Mumbai | 1Hr 58 mins from Pune | Lonavala 50 mins | Aamby Valley City 34 mins | Pawna Lake 32 Mins",
          status: "Planning",
          longDescription: "Nestled gracefully in the lap of the mountains, our Pawna land offers a rare blend of natural beauty, peaceful surroundings, and breathtaking valley and backwater views. Every corner is thoughtfully positioned to capture the freshness of the hills, the cool mountain breeze, and the calming rhythm of nature. Whether it is for a weekend retreat, a dream farmhouse, or a long-term investment, these scenic water & mountain-view plot offer an experience where nature becomes a part of everyday life.",
          features: ["Lake Views", "Valley Views", "Cool Climate", "Fertile Land"]
        }
      ];

      await Project.insertMany(defaultProjects);
      console.log('Seeded default projects successfully');
    }

    // 3. Seed some mock sales if empty
    const salesCount = await Sale.countDocuments({});
    if (salesCount === 0) {
      const mockSales = [
        {
          project: "The Farm Dale",
          amount: 4500000,
          clientName: "Rohan Sharma",
          clientEmail: "rohan@gmail.com",
          status: "Completed",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          project: "Third Mumbai (KSC New Town)",
          amount: 9800000,
          clientName: "Pooja Patel",
          clientEmail: "pooja@yahoo.com",
          status: "Completed",
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
        },
        {
          project: "Riverside Residencies",
          amount: 6200000,
          clientName: "Vikram Malhotra",
          clientEmail: "vikram@outlook.com",
          status: "Completed",
          date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
        }
      ];
      await Sale.insertMany(mockSales);
      console.log('Seeded default sales successfully');
    }
  } catch (error) {
    console.error('Seeding database error:', error);
  }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/athiya-dev')
.then(async () => {
  console.log('MongoDB Connected');
  await seedDatabase();
})
.catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
