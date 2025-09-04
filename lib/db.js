import mysql from 'mysql2/promise';

let pool;

async function initializePool() {
  if (pool) {
    return pool;
  }

  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  pool = mysql.createPool(dbConfig);
  console.log('Database connection pool initialized successfully');
  return pool;
}

// ======================
// Database Initialization + Seeding
// ======================
export async function initializeDatabase() {
  try {
    const db = await initializePool();

    // Create schools table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        school_name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        contact_number VARCHAR(15) NOT NULL,
        image TEXT,
        email_address VARCHAR(255) NOT NULL UNIQUE,
        status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Schools table ensured ✅');

    // Example seed data
    const schools = [
      ["La Martiniere College", "Hazratganj", "Lucknow", "Uttar Pradesh", "+91 91234 56789", "https://upload.wikimedia.org/wikipedia/commons/0/0a/La_Martiniere_College%2C_Lucknow.jpg", "info@lamartiniere.edu.in"],
      ["Jagran Public School", "Gomti Nagar", "Lucknow", "Uttar Pradesh", "+91 92345 67890", "https://www.uniformapp.in/images/school/jagran-public-school-lucknow-campus.jpg", "contact@jpslucknow.org"],
      ["Seth Anandram Jaipuria", "Gomti Nagar", "Lucknow", "Uttar Pradesh", "+91 93456 78901", "https://jaipuriaschoolgn.in/wp-content/uploads/2020/05/school.jpg", "info@jaipuriaschool.edu"],
      ["Lucknow Public School", "Vinay Khand, Gomti Nagar", "Lucknow", "Uttar Pradesh", "+91 94567 89012", "https://www.uniformapp.in/images/school/lucknow-public-school-campus.jpg", "admin@lpslucknow.org"],
      ["Delhi Public School", "Sector 30", "Noida", "Uttar Pradesh", "+91 95678 90123", "https://www.dpsnoida.co.in/images/school_building.jpg", "contact@dpsnoida.edu"],
      ["The Doon School", "Mall Road", "Dehradun", "Uttarakhand", "+91 96789 01234", "https://www.doonschool.com/wp-content/uploads/2018/12/DoonSchool-Campus.jpg", "info@doonschool.edu"],
      ["Modern School", "Barakhamba Road", "New Delhi", "Delhi", "+91 97890 12345", "https://modernschool.net/wp-content/uploads/2019/04/campus.jpg", "admissions@modernschool.edu"],
      ["St. Xavier’s Collegiate School", "Park Street", "Kolkata", "West Bengal", "+91 98901 23456", "https://stxavierskolkata.org/assets/images/school-campus.jpg", "office@stxaviers.edu"],
      ["Ryan International School", "Kandivali East", "Mumbai", "Maharashtra", "+91 99012 34567", "https://ryaninternational.org/images/school-campus.jpg", "ryan@ris.edu"],
      ["Bishop Cotton School", "Mall Road", "Shimla", "Himachal Pradesh", "+91 90123 45678", "https://bishopcottonshimla.com/wp-content/uploads/2021/04/campus.jpg", "contact@bishopcotton.edu"],
    ];

    // Insert only if table is empty
    const [rows] = await db.query(`SELECT COUNT(*) as count FROM schools`);
    if (rows[0].count === 0) {
      await db.query(
        `INSERT INTO schools (school_name, address, city, state, contact_number, image, email_address) VALUES ?`,
        [schools]
      );
      console.log("✅ 10 sample schools inserted successfully!");
    } else {
      console.log("⚡ Schools table already has data, skipping seed.");
    }

    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}

// Export a single function to get the connection pool
export async function getDb() {
  return await initializePool();
}
