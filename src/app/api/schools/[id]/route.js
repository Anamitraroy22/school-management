import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'railway',
  port: parseInt(process.env.DB_PORT) || 3306,
  ssl: {
    rejectUnauthorized: false // Required for Railway MySQL connections
  },
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
};

// Create connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET: Fetch single school by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: 'Valid school ID is required' },
        { status: 400 }
      );
    }

    const [schools] = await pool.execute(
      'SELECT * FROM schools WHERE id = ?',
      [parseInt(id)]
    );

    if (schools.length === 0) {
      return NextResponse.json(
        { success: false, error: 'School not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: schools[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch school' },
      { status: 500 }
    );
  }
}

// PUT: Update school
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const { name, address, city, state, contact, email_id, image } = body;

    if (!id || !name || !address || !city || !state || !contact || !email_id) {
      return NextResponse.json(
        { success: false, error: 'All fields and ID are required for update' },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: 'Valid school ID is required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    // Phone validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    const cleanPhone = contact.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Contact number must be a valid 10-digit number' },
        { status: 400 }
      );
    }

    // Check if school exists
    const [existingSchool] = await pool.execute(
      'SELECT id FROM schools WHERE id = ?',
      [parseInt(id)]
    );
    if (existingSchool.length === 0) {
      return NextResponse.json(
        { success: false, error: 'School not found' },
        { status: 404 }
      );
    }

    // Check for duplicate email (excluding current school)
    const [duplicates] = await pool.execute(
      'SELECT id FROM schools WHERE email_id = ? AND id != ?',
      [email_id, parseInt(id)]
    );
    if (duplicates.length > 0) {
      return NextResponse.json(
        { success: false, error: 'A school with this email already exists' },
        { status: 409 }
      );
    }

    // Update school
    await pool.execute(
      `UPDATE schools SET 
        name = ?, 
        address = ?, 
        city = ?, 
        state = ?, 
        contact = ?, 
        email_id = ?, 
        image = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [name, address, city, state, cleanPhone, email_id, image || null, parseInt(id)]
    );

    return NextResponse.json(
      { success: true, message: 'School updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update school' },
      { status: 500 }
    );
  }
}

// DELETE: Remove school by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: 'Valid school ID is required for deletion' },
        { status: 400 }
      );
    }

    const [existingSchool] = await pool.execute(
      'SELECT id, name FROM schools WHERE id = ?',
      [parseInt(id)]
    );

    if (existingSchool.length === 0) {
      return NextResponse.json(
        { success: false, error: 'School not found' },
        { status: 404 }
      );
    }

    await pool.execute('DELETE FROM schools WHERE id = ?', [parseInt(id)]);

    return NextResponse.json(
      { success: true, message: `School "${existingSchool[0].name}" deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error('API DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete school' },
      { status: 500 }
    );
  }
}
