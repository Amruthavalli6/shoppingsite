require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ MONGO_URI not defined in env!');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('✅ MongoDB connected for seeding');
    await Product.deleteMany();

    await Product.insertMany([
      // 🔥 TRENDING
      {
        title: 'Camera',
        image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg',
        category: ['Gadgets'],
        price: 8999,
        isTrending: true
      },
      {
        title: 'Smartphone',
        image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
        category: ['Gadgets'],
        price: 12999,
        isTrending: true
      },
      {
        title: 'Glasses',
        image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg',
        category: ['Accessories', 'Men', 'Women'],
        price: 599,
        isTrending: true
      },
      {
        title: 'Wireless Mouse',
        image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg',
        category: ['Gadgets'],
        price: 1299,
        isTrending: true
      },
      {
        title: 'Gaming Keyboard',
        image: 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg',
        category: ['Gadgets'],
        price: 2499,
        isTrending: true
      },
      {
        title: 'Power Bank',
        image: 'https://images.pexels.com/photos/518530/pexels-photo-518530.jpeg',
        category: ['Gadgets'],
        price: 1599,
        isTrending: true
      },
      {
        title: 'Bluetooth Headphones',
        image: 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg',
        category: ['Gadgets', 'Men', 'Women'],
        price: 3499,
        isTrending: true
      },
      {
        title: 'Smart Speaker',
        image: 'https://images.pexels.com/photos/373638/pexels-photo-373638.jpeg',
        category: ['Gadgets'],
        price: 4999,
        isTrending: true
      },
      {
        title: 'Tablet Stand',
        image: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg',
        category: ['Gadgets'],
        price: 899,
        isTrending: true
      },

      // 👨 MEN
      {
        title: 'Men T-Shirt',
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
        category: ['Men'],
        price: 799
      },
      {
        title: 'Men Watch',
        image: 'https://images.pexels.com/photos/277319/pexels-photo-277319.jpeg',
        category: ['Men', 'Accessories'],
        price: 1999
      },
      {
        title: 'Men Casual Shirt',
        image: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg',
        category: ['Men'],
        price: 1299
      },
      {
        title: 'Men Jeans',
        image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg',
        category: ['Men'],
        price: 1899
      },
      {
        title: 'Men Formal Shoes',
        image: 'https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg',
        category: ['Men'],
        price: 2499
      },
      {
        title: 'Men Hoodie',
        image: 'https://images.pexels.com/photos/32414476/pexels-photo-32414476.jpeg',
        category: ['Men'],
        price: 1699
      },
      {
        title: 'Men Belt',
        image: 'https://images.pexels.com/photos/1023937/pexels-photo-1023937.jpeg',
        category: ['Men', 'Accessories'],
        price: 799
      },
      {
        title: 'Men Cap',
        image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg',
        category: ['Men', 'Accessories'],
        price: 599
      },

      // 👩 WOMEN
      {
        title: 'Floral Dress',
        image: 'https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg',
        category: ['Women'],
        price: 1499
      },
      {
        title: 'Women Blouse',
        image: 'https://images.pexels.com/photos/914668/pexels-photo-914668.jpeg',
        category: ['Women'],
        price: 1199
      },
      {
        title: 'Women Jeans',
        image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg',
        category: ['Women'],
        price: 1599
      },
      {
        title: 'Women High Heels',
        image: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg',
        category: ['Women'],
        price: 2199
      },
      {
        title: 'Women Handbag',
        image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
        category: ['Women', 'Accessories'],
        price: 2499
      },
      {
        title: 'Women Jacket',
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
        category: ['Women'],
        price: 2899
      },
      {
        title: 'Women Scarf',
        image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
        category: ['Women', 'Accessories'],
        price: 699
      },

      // 🎧 ACCESSORIES
      {
        title: 'Bluetooth Speaker',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
        category: ['Accessories', 'Men', 'Women'],
        price: 799
      },
      {
        title: 'Backpack',
        image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg',
        category: ['Accessories', 'Men', 'Women'],
        price: 1099
      },
      {
        title: 'Phone Case',
        image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
        category: ['Accessories', 'Gadgets'],
        price: 299
      },
      {
        title: 'Wrist Band',
        image: 'https://images.pexels.com/photos/1684113/pexels-photo-1684113.jpeg',
        category: ['Accessories', 'Men', 'Women'],
        price: 399
      },
      {
        title: 'Keychain',
        image: 'https://images.pexels.com/photos/1288484/pexels-photo-1288484.jpeg',
        category: ['Accessories', 'Gadgets'],
        price: 199
      },
      {
        title: 'Sunglasses',
        image: 'https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg',
        category: ['Accessories', 'Men', 'Women'],
        price: 899
      },
      {
        title: 'Fitness Tracker',
        image: 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg',
        category: ['Accessories', 'Men', 'Women'],
        price: 1999
      },
      {
        title: 'Wireless Charger',
        image: 'https://images.pexels.com/photos/15921116/pexels-photo-15921116.jpeg',
        category: ['Accessories', 'Gadgets'],
        price: 799
      },

      // ⚡ FLASH SALE
      {
        title: 'Wireless Earbuds',
        image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
        category: ['Flash Sale'],
        price: 999
      },
      {
        title: 'USB Cable',
        image: 'https://images.pexels.com/photos/163142/usb-stick-usb-flash-drive-technology-computer-163142.jpeg',
        category: ['Flash Sale'],
        price: 199
      },
      {
        title: 'Screen Protector',
        image: 'https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg',
        category: ['Flash Sale'],
        price: 149
      },
      {
        title: 'Car Charger',
        image: 'https://images.pexels.com/photos/3846080/pexels-photo-3846080.jpeg',
        category: ['Flash Sale'],
        price: 299
      },
      {
        title: 'Memory Card',
        image: 'https://images.pexels.com/photos/2147082/pexels-photo-2147082.jpeg',
        category: ['Flash Sale'],
        price: 399
      },
      {
        title: 'Portable Speaker',
        image: 'https://images.pexels.com/photos/744318/pexels-photo-744318.jpeg',
        category: ['Accessories', 'Gadgets'],
        price: 799
      },
      {
        title: 'Phone Grip',
        image: 'https://images.pexels.com/photos/4207707/pexels-photo-4207707.jpeg',
        category: ['Flash Sale'],
        price: 299
      },
  // 🌞 SUMMER
  {
    title: 'Beach Hat',
    image: 'https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg',
    category: ['Summer', 'Accessories'],
    price: 499
  },
  {
    title: 'Beach Slippers',
    image: 'https://images.pexels.com/photos/1027130/pexels-photo-1027130.jpeg',
    category: ['Summer', 'Accessories'],
    price: 399
  },
  {
    title: 'Swimsuit',
    image: 'https://images.pexels.com/photos/1129019/pexels-photo-1129019.jpeg',
    category: ['Summer'],
    price: 1299
  },
  {
    title: 'Beach Towel',
    image: 'https://images.pexels.com/photos/2997957/pexels-photo-2997957.jpeg',
    category: ['Summer', 'Accessories'],
    price: 699
  },
  {
    title: 'Water Bottle',
    image: 'https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg',
    category: ['Summer', 'Accessories'],
    price: 299
  },

  {
    title: 'Cooler Bag',
    image: 'https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg',
    category: ['Summer'],
    price: 899
  },
  {
    title: 'Sun Lotion',
    image: 'https://images.pexels.com/photos/1292241/pexels-photo-1292241.jpeg',
    category: ['Summer'],
    price: 199
  },

  // 🏆 BEST 2020
  {
    title: 'Leather Wallet',
    image: 'https://images.pexels.com/photos/5863645/pexels-photo-5863645.jpeg',
    category: ['Best 2020'],
    price: 899
  },
  {
    title: 'Retro Sunglasses',
    image: 'https://images.pexels.com/photos/343717/pexels-photo-343717.jpeg',
    category: ['Best 2020'],
    price: 749
  },
  {
    title: 'Vintage Camera',
    image: 'https://images.pexels.com/photos/821651/pexels-photo-821651.jpeg',
    category: ['Best 2020'],
    price: 3999
  },
  {
    title: 'Classic Watch',
    image: 'https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg',
    category: ['Best 2020'],
    price: 2999
  },
  {
    title: 'Leather Shoes',
    image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg',
    category: ['Best 2020'],
    price: 3499
  },
  {
    title: 'Designer Pen',
    image: 'https://images.pexels.com/photos/6143818/pexels-photo-6143818.jpeg',
    category: ['Best 2020'],
    price: 599
  },
  {
    title: 'Premium Notebook',
    image: 'https://images.pexels.com/photos/544115/pexels-photo-544115.jpeg',
    category: ['Best 2020'],
    price: 799
  },
  {
    title: 'Coffee Mug',
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
    category: ['Best 2020'],
    price: 299
  },

  // ✈️ SUMMER TRAVEL COLLECTION
  {
    title: 'Travel Bag',
    image: 'https://images.pexels.com/photos/1058959/pexels-photo-1058959.jpeg',
    category: ['Summer Travel Collection'],
    price: 1599
  },
  {
    title: 'Luggage Set',
    image: 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg',
    category: ['Summer Travel Collection'],
    price: 3299
  },
  {
    title: 'Travel Pillow',
    image: 'https://images.pexels.com/photos/10032378/pexels-photo-10032378.jpeg',
    category: ['Summer Travel Collection'],
    price: 599
  },
  {
    title: 'Passport Holder',
    image: 'https://images.pexels.com/photos/4452530/pexels-photo-4452530.jpeg',
    category: ['Summer Travel Collection'],
    price: 399
  },
  {
    title: 'Travel Adapter',
    image: 'https://images.pexels.com/photos/8134848/pexels-photo-8134848.jpeg',
    category: ['Summer Travel Collection'],
    price: 299
  },
  {
    title: 'Packing Cubes',
    image: 'https://images.pexels.com/photos/9185877/pexels-photo-9185877.jpeg',
    category: ['Summer Travel Collection'],
    price: 799
  },
  {
    title: 'Travel Toiletry Bag',
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg',
    category: ['Summer Travel Collection'],
    price: 699
  },


  // 🌟 AWESOME BEST 2020
  {
    title: 'Premium Sneakers',
    image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg',
    category: ['Awesome Best 2020'],
    price: 2899
  },
  {
    title: 'Fashion Backpack',
    image: 'https://images.pexels.com/photos/934673/pexels-photo-934673.jpeg',
    category: ['Awesome Best 2020'],
    price: 1499
  },
  {
    title: 'Designer Hoodie',
    image: 'https://images.pexels.com/photos/1304647/pexels-photo-1304647.jpeg',
    category: ['Awesome Best 2020'],
    price: 2499
  },
  {
    title: 'Luxury Perfume',
    image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg',
    category: ['Awesome Best 2020'],
    price: 3999
  },
  {
    title: 'Gaming Chair',
    image: 'https://images.pexels.com/photos/7915357/pexels-photo-7915357.jpeg',
    category: ['Awesome Best 2020'],
    price: 8999
  },
  {
    title: 'Wireless Headset',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    category: ['Awesome Best 2020'],
    price: 4499
  },
  {
    title: 'Smart Ring',
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg',
    category: ['Awesome Best 2020'],
    price: 5999
  },
  {
    title: 'Premium Laptop Bag',
    image: 'https://images.pexels.com/photos/936081/pexels-photo-936081.jpeg',
    category: ['Awesome Best 2020'],
    price: 3499
  },

  // 👟 STYLISH SNEAKERS
  {
    title: 'Running Shoes',
    image: 'https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg',
    category: ['Stylish Sneakers'],
    price: 1999
  },
  {
    title: 'Basketball Shoes',
    image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg',
    category: ['Stylish Sneakers'],
    price: 3499
  },
  {
    title: 'Casual Sneakers',
    image: 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg',
    category: ['Stylish Sneakers'],
    price: 2499
  },
  {
    title: 'High-top Sneakers',
    image: 'https://images.pexels.com/photos/1280064/pexels-photo-1280064.jpeg',
    category: ['Stylish Sneakers'],
    price: 2799
  },
  {
    title: 'White Sneakers',
    image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg',
    category: ['Stylish Sneakers'],
    price: 2199
  },
  {
    title: 'Hiking Shoes',
    image: 'https://images.pexels.com/photos/1102776/pexels-photo-1102776.jpeg',
    category: ['Stylish Sneakers'],
    price: 3999
  },
  {
    title: 'Training Shoes',
    image: 'https://images.pexels.com/photos/1858407/pexels-photo-1858407.jpeg',
    category: ['Stylish Sneakers'],
    price: 2999
  },

  // 🎧 MODERN HEADPHONES
  {
    title: 'Wireless Earbuds',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    category: ['Modern Headphones', 'Accessories', 'Gadgets', 'Men', 'Women'],
    price: 2499
  },
  {
    title: 'Noise Cancelling Headphones',
    image: 'https://images.pexels.com/photos/8001055/pexels-photo-8001055.jpeg',
    category: ['Modern Headphones', 'Accessories', 'Gadgets', 'Men', 'Women'],
    price: 5999
  },

  {
    title: 'Gaming Headphones',
    image: 'https://images.pexels.com/photos/30457078/pexels-photo-30457078.jpeg',
    category: ['Modern Headphones', 'Accessories', 'Gadgets', 'Men', 'Women'],
    price: 4999
  },
  {
    title: 'Bluetooth Headphones',
    image: 'https://images.pexels.com/photos/1037999/pexels-photo-1037999.jpeg',
    category: ['Modern Headphones', 'Accessories', 'Gadgets', 'Men', 'Women'],
    price: 3499
  },

  // ⌚ SMARTWATCH
  {
    title: 'Fitness Smartwatch',
    image: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg',
    category: ['Smartwatch', 'Accessories', 'Gadgets', 'Men', 'Women'],
    price: 7999
  },
  {
    title: 'Luxury Smartwatch',
    image: 'https://images.pexels.com/photos/277406/pexels-photo-277406.jpeg',
    category: ['Smartwatch', 'Accessories', 'Gadgets', 'Men', 'Women'],
    price: 15999
  },
  {
    title: 'Sport Smartwatch',
    image: 'https://images.pexels.com/photos/8217430/pexels-photo-8217430.jpeg',
    category: ['Smartwatch', 'Accessories', 'Gadgets', 'Men', 'Women'],
    price: 8999
  },
  {
    title: 'hybrid Smartwatch',
    image: 'https://images.pexels.com/photos/7621138/pexels-photo-7621138.jpeg',
    category: ['Smartwatch', 'Accessories', 'Gadgets', 'Men', 'Women'],
    price: 12999
  },
  {
    title: 'belt Smartwatch',
    image: 'https://images.pexels.com/photos/447570/pexels-photo-447570.jpeg',
    category: ['Smartwatch', 'Accessories', 'Gadgets', 'Men', 'Women'],
    price: 10999
  },


    ]);

    console.log('✅ Products seeded successfully');
    
    // Run trending update after seeding
    console.log('🔄 Updating trending products...');
    const { exec } = require('child_process');
    exec('node scripts/updateTrending.js', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Error updating trending products:', error.message);
      } else {
        console.log('✅ Trending products updated successfully');
      }
    mongoose.connection.close();
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection or seeding error:', err);
    process.exit(1);
  });
