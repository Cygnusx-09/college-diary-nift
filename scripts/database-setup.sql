-- Create photos table for storing image metadata
CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  cloudinary_public_id VARCHAR(255) UNIQUE NOT NULL,
  cloudinary_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  category VARCHAR(50) DEFAULT 'general',
  caption TEXT,
  uploader_ip_hash VARCHAR(64),
  device_type VARCHAR(20), -- 'mobile', 'tablet', 'desktop'
  user_agent_hash VARCHAR(64),
  moderation_status VARCHAR(20) DEFAULT 'approved',
  view_count INTEGER DEFAULT 0,
  file_size INTEGER,
  image_width INTEGER,
  image_height INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table for photo organization
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10),
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create analytics table for tracking usage
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  photo_id INTEGER REFERENCES photos(id),
  device_type VARCHAR(20),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_hash VARCHAR(64),
  user_agent_hash VARCHAR(64)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_photos_timestamp ON photos(upload_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_photos_moderation ON photos(moderation_status);
CREATE INDEX IF NOT EXISTS idx_analytics_event_time ON analytics(event_type, timestamp);

-- Insert default categories
INSERT INTO categories (name, display_name, emoji, description, sort_order) VALUES
('general', '🌟 All Photos', '🌟', 'General orientation photos', 0),
('orientation', '🎓 Orientation', '🎓', 'Official orientation events', 1),
('campus', '🏫 Campus Tour', '🏫', 'Campus and facilities', 2),
('activities', '🎨 Activities', '🎨', 'Fun activities and workshops', 3),
('food', '🍕 Food & Fun', '🍕', 'Food and dining experiences', 4),
('friends', '👥 New Friends', '👥', 'Meeting new people', 5),
('selfies', '🤳 Selfies', '🤳', 'Selfies and group photos', 6)
ON CONFLICT (name) DO NOTHING;
