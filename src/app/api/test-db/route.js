import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'railway',
  port: parseInt(process.env.DB_PORT) || 3306,
  ssl: {
    rejectUnauthorized: false 
  },
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
};

export async function GET() {
  let connection;
  
  try {
    console.log('Testing database connection with config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });

    connection = await mysql.createConnection(dbConfig);
    
    await connection.execute('SELECT 1');
    console.log('Database connection successful!');

    const [tables] = await connection.execute(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'schools'",
      [dbConfig.database]
    );

    if (tables.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Schools table not found. Please create the database schema.',
        connection: 'successful'
      }, { status: 500 });
    }

    const [columns] = await connection.execute('DESCRIBE schools');
    
    const [count] = await connection.execute('SELECT COUNT(*) as count FROM schools');

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      tableExists: true,
      columns: columns.map(col => ({
        field: col.Field,
        type: col.Type,
        null: col.Null,
        key: col.Key,
        default: col.Default
      })),
      schoolCount: count[0].count
    });

  } catch (error) {
    console.error('Database connection error:', error);
    
    let errorMessage = 'Database connection failed';
    
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to MySQL server. Is MySQL running?';
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      errorMessage = 'Access denied. Check your username and password.';
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      errorMessage = 'Database does not exist. Please create the database first.';
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      details: error.message,
      code: error.code
    }, { status: 500 });
    
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}