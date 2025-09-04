import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database configuration (with SSL for Railway)
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
};

// Connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 📌 POST: Add new school
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, address, city, state, contact, email_id, image } = body;

    // Basic validation
    if (!name || !address || !city || !state || !contact || !email_id) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_id)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Phone validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(contact)) {
      return NextResponse.json(
        { error: 'Contact must be a valid 10-digit number' },
        { status: 400 }
      );
    }

    // Prevent duplicates (check email)
    const [existing] = await pool.execute(
      'SELECT id FROM schools WHERE email_id = ?',
      [email_id]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'A school with this email already exists' },
        { status: 409 }
      );
    }

    // Insert into DB
    const [result] = await pool.execute(
      `INSERT INTO schools (name, address, city, state, contact, email_id, image, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, address, city, state, contact, email_id, image || null]
    );

    return NextResponse.json({
      success: true,
      message: 'School added successfully',
      school: {
        id: result.insertId,
        name,
        address,
        city,
        state,
        contact,
        email_id,
        image: image || null
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding school:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 📌 GET: Fetch all schools
export async function GET() {
  try {
    const [schools] = await pool.execute(
      'SELECT id, name, address, city, state, contact, email_id, image FROM schools ORDER BY created_at DESC'
    );

    return NextResponse.json({
      success: true,
      schools
    });

  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}
