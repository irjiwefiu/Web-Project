import AppDataSource from "./data-source.js";

/**
 * Ensures all required columns exist in the database tables.
 * Called during server startup AND during seeding.
 * Uses IF NOT EXISTS so it's safe to call repeatedly.
 */
export async function ensureColumns(manager) {
  // Add missing columns to users if they don't exist
  await manager.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS name VARCHAR,
      ADD COLUMN IF NOT EXISTS password VARCHAR,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT now();
  `);
  // Add extra technician_profiles columns if they don't exist
  await manager.query(`
    ALTER TABLE technician_profiles
      ADD COLUMN IF NOT EXISTS availability_status VARCHAR DEFAULT 'offline',
      ADD COLUMN IF NOT EXISTS rating FLOAT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_jobs INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS service_area VARCHAR;
  `);
  // Add extra service_requests columns if they don't exist
  await manager.query(`
    ALTER TABLE service_requests
      ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0.00,
      ADD COLUMN IF NOT EXISTS location VARCHAR,
      ADD COLUMN IF NOT EXISTS urgency VARCHAR DEFAULT 'medium',
      ADD COLUMN IF NOT EXISTS preferred_time TIMESTAMP,
      ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT now();
  `);
  // Add status column to assignments if it doesn't exist
  await manager.query(`
    ALTER TABLE assignments
      ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'applied';
  `);
  // Backfill: existing assignments with assigned_by NOT NULL should be 'accepted'
  await manager.query(`
    UPDATE assignments SET status = 'accepted' WHERE assigned_by_id IS NOT NULL AND status = 'applied';
  `);
}

/**
 * Convenience function that initializes the data source and runs ensureColumns.
 * Used by index.js during server startup.
 */
export async function ensureDatabaseColumns() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  await ensureColumns(AppDataSource.manager);
  console.log("✅ Database columns verified");
}