-- GiftConcierge Database Schema
-- MySQL 8.x with InnoDB engine

CREATE DATABASE IF NOT EXISTS giftconcierge
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE giftconcierge;

-- =============================================
-- USERS
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    timezone VARCHAR(50),
    monthly_budget DECIMAL(10,2),
    premium BOOLEAN NOT NULL DEFAULT FALSE,
    role VARCHAR(20) DEFAULT 'USER',
    feature_flags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- =============================================
-- PASSWORD RESETS
-- =============================================
CREATE TABLE IF NOT EXISTS password_resets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at DATETIME NOT NULL
) ENGINE=InnoDB;

-- =============================================
-- PAYMENT SETTINGS
-- =============================================
CREATE TABLE IF NOT EXISTS payment_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    upi_id VARCHAR(100),
    qr_code_url LONGTEXT
) ENGINE=InnoDB;

INSERT INTO payment_settings (id, upi_id, qr_code_url) VALUES (1, 'gifting@upi', 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=400');

-- =============================================
-- RECIPIENTS
-- =============================================
CREATE TABLE IF NOT EXISTS recipients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    birthday DATE,
    anniversary DATE,
    relationship VARCHAR(50),
    gender VARCHAR(20),
    age INT,
    interests TEXT,
    favorite_brands TEXT,
    hobbies TEXT,
    clothing_size VARCHAR(20),
    preferred_colors TEXT,
    allergies TEXT,
    notes TEXT,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_recipients_user (user_id),
    INDEX idx_recipients_birthday (birthday)
) ENGINE=InnoDB;

-- =============================================
-- ADDRESSES
-- =============================================
CREATE TABLE IF NOT EXISTS addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recipient_id BIGINT,
    label VARCHAR(50),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(50) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES recipients(id) ON DELETE SET NULL,
    INDEX idx_addresses_user (user_id)
) ENGINE=InnoDB;

-- =============================================
-- OCCASIONS
-- =============================================
CREATE TABLE IF NOT EXISTS occasions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    custom_name VARCHAR(100),
    event_date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(50),
    notes TEXT,
    auto_gift_enabled BOOLEAN DEFAULT FALSE,
    auto_gift_budget DECIMAL(10,2),
    FOREIGN KEY (recipient_id) REFERENCES recipients(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_occasions_user (user_id),
    INDEX idx_occasions_date (event_date)
) ENGINE=InnoDB;

-- =============================================
-- WISHLISTS
-- =============================================
CREATE TABLE IF NOT EXISTS wishlists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(30),
    is_public BOOLEAN DEFAULT FALSE,
    share_code VARCHAR(50) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_wishlists_user (user_id),
    INDEX idx_wishlists_share (share_code)
) ENGINE=InnoDB;

-- =============================================
-- WISHLIST ITEMS
-- =============================================
CREATE TABLE IF NOT EXISTS wishlist_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wishlist_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    url VARCHAR(500),
    price DECIMAL(10,2),
    image_url VARCHAR(500),
    is_purchased BOOLEAN DEFAULT FALSE,
    purchased_by BIGINT,
    FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE,
    FOREIGN KEY (purchased_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_wishlist_items_wishlist (wishlist_id)
) ENGINE=InnoDB;

-- =============================================
-- GIFT ORDERS
-- =============================================
CREATE TABLE IF NOT EXISTS gift_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    occasion_id BIGINT,
    gift_name VARCHAR(255) NOT NULL,
    gift_description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    scheduled_date DATE,
    scheduled_time TIME,
    personal_message TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    delivery_type VARCHAR(30),
    tracking_id VARCHAR(100),
    transaction_id VARCHAR(100),
    payment_screenshot LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES recipients(id) ON DELETE CASCADE,
    FOREIGN KEY (occasion_id) REFERENCES occasions(id) ON DELETE SET NULL,
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_recipient (recipient_id),
    INDEX idx_orders_status (status)
) ENGINE=InnoDB;

-- =============================================
-- GROUP GIFTS
-- =============================================
CREATE TABLE IF NOT EXISTS group_gifts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    organizer_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    target_amount DECIMAL(10,2) NOT NULL,
    collected_amount DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    share_link VARCHAR(100) UNIQUE,
    deadline DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES recipients(id) ON DELETE CASCADE,
    INDEX idx_group_gifts_organizer (organizer_id),
    INDEX idx_group_gifts_share (share_link)
) ENGINE=InnoDB;

-- =============================================
-- GROUP GIFT CONTRIBUTIONS
-- =============================================
CREATE TABLE IF NOT EXISTS group_gift_contributions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    group_gift_id BIGINT NOT NULL,
    contributor_id BIGINT,
    contributor_name VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    message TEXT,
    payment_status VARCHAR(30) DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_gift_id) REFERENCES group_gifts(id) ON DELETE CASCADE,
    FOREIGN KEY (contributor_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_contributions_gift (group_gift_id)
) ENGINE=InnoDB;

-- =============================================
-- GIFT HISTORY
-- =============================================
CREATE TABLE IF NOT EXISTS gift_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    order_id BIGINT,
    gift_name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    amount DECIMAL(10,2),
    occasion_type VARCHAR(50),
    gift_date DATE,
    compatibility_score INT,
    ai_reasoning TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES recipients(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES gift_orders(id) ON DELETE SET NULL,
    INDEX idx_history_user_recipient (user_id, recipient_id)
) ENGINE=InnoDB;

-- =============================================
-- RELATIONSHIP SCORES
-- =============================================
CREATE TABLE IF NOT EXISTS relationship_scores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    score INT NOT NULL DEFAULT 50,
    gifting_frequency_score INT,
    event_participation_score INT,
    interaction_score INT,
    last_calculated DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES recipients(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_rel_score_unique (user_id, recipient_id)
) ENGINE=InnoDB;

-- =============================================
-- REMINDERS
-- =============================================
CREATE TABLE IF NOT EXISTS reminders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    occasion_id BIGINT NOT NULL,
    type VARCHAR(30),
    days_before INT,
    message TEXT,
    is_smart BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    send_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (occasion_id) REFERENCES occasions(id) ON DELETE CASCADE,
    INDEX idx_reminders_user (user_id),
    INDEX idx_reminders_send (is_sent, send_at)
) ENGINE=InnoDB;

-- =============================================
-- BUDGETS
-- =============================================
CREATE TABLE IF NOT EXISTS budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    period VARCHAR(20),
    budget_limit DECIMAL(10,2) NOT NULL,
    spent DECIMAL(10,2) DEFAULT 0.00,
    month INT,
    year INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_budget_unique (user_id, month, year)
) ENGINE=InnoDB;

-- =============================================
-- GIFT STORIES
-- =============================================
CREATE TABLE IF NOT EXISTS gift_stories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    recipient_user_id BIGINT,
    message TEXT,
    media_url VARCHAR(500),
    media_type VARCHAR(30),
    likes_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES gift_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_stories_created (created_at DESC)
) ENGINE=InnoDB;

-- =============================================
-- FUTURE GIFT LOCKER
-- =============================================
CREATE TABLE IF NOT EXISTS future_gift_locker (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    gift_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    type VARCHAR(30),
    digital_content TEXT,
    occasion_id BIGINT,
    status VARCHAR(30) NOT NULL DEFAULT 'STORED',
    purchased_at DATETIME,
    scheduled_send_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES recipients(id) ON DELETE CASCADE,
    FOREIGN KEY (occasion_id) REFERENCES occasions(id) ON DELETE SET NULL,
    INDEX idx_locker_user_status (user_id, status)
) ENGINE=InnoDB;

-- =============================================
-- AUTO PILOT GIFTS
-- =============================================
CREATE TABLE IF NOT EXISTS auto_pilot_gifts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    occasion_type VARCHAR(50),
    budget DECIMAL(10,2),
    preferences TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    requires_approval BOOLEAN DEFAULT TRUE,
    last_triggered DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES recipients(id) ON DELETE CASCADE,
    INDEX idx_autopilot_user (user_id, is_active)
) ENGINE=InnoDB;

-- =============================================
-- AI CHAT HISTORY
-- =============================================
CREATE TABLE IF NOT EXISTS ai_chat_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    gift_suggestions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_chat_user_time (user_id, created_at DESC)
) ENGINE=InnoDB;

-- =============================================
-- SECRET SANTA
-- =============================================
CREATE TABLE IF NOT EXISTS secret_santa (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    organizer_id BIGINT NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    budget_limit DECIMAL(10,2),
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    join_code VARCHAR(20) UNIQUE,
    deadline DATE,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_santa_join (join_code)
) ENGINE=InnoDB;

-- =============================================
-- SECRET SANTA PARTICIPANTS
-- =============================================
CREATE TABLE IF NOT EXISTS secret_santa_participants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    secret_santa_id BIGINT NOT NULL,
    user_id BIGINT,
    name VARCHAR(100) NOT NULL,
    assigned_to BIGINT,
    wishlist_notes TEXT,
    FOREIGN KEY (secret_santa_id) REFERENCES secret_santa(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES secret_santa_participants(id) ON DELETE SET NULL,
    INDEX idx_santa_participants (secret_santa_id)
) ENGINE=InnoDB;

-- =============================================
-- GIFTS CATALOG
-- =============================================
CREATE TABLE IF NOT EXISTS gifts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    subcategory VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    emotion_tags TEXT,
    is_digital BOOLEAN DEFAULT FALSE,
    is_experience BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,1) DEFAULT 0.0,
    review_count INT DEFAULT 0,
    stock INT NOT NULL DEFAULT 20,
    INDEX idx_gifts_category (category),
    INDEX idx_gifts_price (price)
) ENGINE=InnoDB;


-- =============================================
-- SEED DATA: Gift Catalog (30+ items)
-- =============================================
INSERT INTO gifts (name, description, category, subcategory, price, image_url, emotion_tags, is_digital, is_experience, rating, review_count) VALUES
-- Books
('The Art of Thinking Clearly', 'A beautifully written guide to better decision-making with 99 short chapters on cognitive biases.', 'Books', 'Non-Fiction', 16.99, '/images/gifts/thinking-clearly.jpg', 'intellectual,thoughtful,inspiring', FALSE, FALSE, 4.5, 1250),
('Personalized Leather Journal', 'Hand-crafted leather journal with custom name embossing, 200 lined pages of premium paper.', 'Books', 'Stationery', 34.99, '/images/gifts/leather-journal.jpg', 'personal,creative,elegant', FALSE, FALSE, 4.8, 890),
('Coffee Table Book: World Photography', 'Stunning collection of award-winning photographs from around the world, hardcover edition.', 'Books', 'Art', 49.99, '/images/gifts/photo-book.jpg', 'artistic,inspiring,beautiful', FALSE, FALSE, 4.7, 650),
('Kindle Unlimited 6-Month Subscription', 'Access to over 2 million ebooks, audiobooks, and magazines for 6 months.', 'Books', 'Digital', 59.94, '/images/gifts/kindle-unlimited.jpg', 'practical,intellectual,convenient', TRUE, FALSE, 4.3, 2100),

-- Electronics
('Premium Wireless Earbuds', 'Active noise-cancelling wireless earbuds with 30-hour battery life and premium sound quality.', 'Electronics', 'Audio', 79.99, '/images/gifts/earbuds.jpg', 'modern,practical,tech', FALSE, FALSE, 4.6, 3400),
('Smart Photo Frame', 'WiFi-enabled digital photo frame that displays photos from your phone, 10-inch HD display.', 'Electronics', 'Smart Home', 129.99, '/images/gifts/smart-frame.jpg', 'sentimental,modern,family', FALSE, FALSE, 4.4, 1800),
('Portable Bluetooth Speaker', 'Waterproof portable speaker with 360-degree sound and 12-hour battery life.', 'Electronics', 'Audio', 49.99, '/images/gifts/bt-speaker.jpg', 'fun,practical,adventurous', FALSE, FALSE, 4.5, 2900),
('Sunrise Alarm Clock', 'Wake up naturally with simulated sunrise light, nature sounds, and sleep tracking.', 'Electronics', 'Wellness', 39.99, '/images/gifts/sunrise-clock.jpg', 'wellness,calming,practical', FALSE, FALSE, 4.3, 1100),

-- Experiences
('Gourmet Cooking Class for Two', 'Hands-on cooking class with a professional chef, includes wine pairing and recipe book.', 'Experiences', 'Culinary', 149.99, '/images/gifts/cooking-class.jpg', 'experiential,romantic,fun', FALSE, TRUE, 4.9, 520),
('Hot Air Balloon Ride', 'Scenic sunrise hot air balloon ride with champagne toast, approximately 1 hour flight.', 'Experiences', 'Adventure', 299.99, '/images/gifts/balloon-ride.jpg', 'adventurous,romantic,unforgettable', FALSE, TRUE, 4.8, 340),
('Spa Day Package', 'Full-day spa experience including massage, facial, body wrap, and lunch.', 'Experiences', 'Wellness', 199.99, '/images/gifts/spa-day.jpg', 'relaxing,luxurious,pampering', FALSE, TRUE, 4.7, 780),
('Wine Tasting Tour', 'Guided tour of 3 local wineries with tastings, cheese pairings, and sommelier education.', 'Experiences', 'Culinary', 89.99, '/images/gifts/wine-tour.jpg', 'sophisticated,fun,educational', FALSE, TRUE, 4.6, 450),

-- Personalized
('Custom Star Map Print', 'A beautiful framed print showing the exact night sky on any special date and location.', 'Personalized', 'Art', 59.99, '/images/gifts/star-map.jpg', 'romantic,sentimental,unique', FALSE, FALSE, 4.8, 2200),
('Engraved Wooden Watch', 'Handcrafted wooden watch with custom engraving on the back, genuine leather strap.', 'Personalized', 'Accessories', 89.99, '/images/gifts/wood-watch.jpg', 'elegant,personal,timeless', FALSE, FALSE, 4.6, 960),
('Custom Portrait Illustration', 'Hand-drawn digital portrait illustration from your photo, printed on premium canvas.', 'Personalized', 'Art', 75.00, '/images/gifts/custom-portrait.jpg', 'artistic,personal,unique', FALSE, FALSE, 4.7, 1400),
('Personalized Recipe Cutting Board', 'Engraved bamboo cutting board with a family recipe in their handwriting.', 'Personalized', 'Kitchen', 44.99, '/images/gifts/cutting-board.jpg', 'sentimental,practical,family', FALSE, FALSE, 4.5, 680),

-- Fashion
('Cashmere Scarf', 'Ultra-soft 100% cashmere scarf in a gift box, available in multiple colors.', 'Fashion', 'Accessories', 89.99, '/images/gifts/cashmere-scarf.jpg', 'luxurious,elegant,warm', FALSE, FALSE, 4.7, 1300),
('Designer Sunglasses', 'Classic aviator style sunglasses with UV400 protection and polarized lenses.', 'Fashion', 'Accessories', 65.00, '/images/gifts/sunglasses.jpg', 'stylish,practical,classic', FALSE, FALSE, 4.4, 1700),
('Leather Wallet with RFID Protection', 'Genuine leather bifold wallet with RFID blocking technology, gift boxed.', 'Fashion', 'Accessories', 45.99, '/images/gifts/leather-wallet.jpg', 'practical,elegant,secure', FALSE, FALSE, 4.5, 2100),
('Silk Pajama Set', 'Luxurious mulberry silk pajama set in an elegant gift box.', 'Fashion', 'Sleepwear', 119.99, '/images/gifts/silk-pajamas.jpg', 'luxurious,comfortable,pampering', FALSE, FALSE, 4.6, 870),

-- Home
('Luxury Scented Candle Set', 'Set of 3 hand-poured soy candles in premium scents with wooden wicks.', 'Home', 'Decor', 54.99, '/images/gifts/candle-set.jpg', 'relaxing,elegant,cozy', FALSE, FALSE, 4.6, 1900),
('Indoor Herb Garden Kit', 'Self-watering smart garden that grows fresh herbs year-round with LED grow lights.', 'Home', 'Garden', 99.99, '/images/gifts/herb-garden.jpg', 'practical,healthy,sustainable', FALSE, FALSE, 4.5, 1200),
('Premium Throw Blanket', 'Ultra-soft sherpa fleece throw blanket, oversized 60x80 inches.', 'Home', 'Comfort', 39.99, '/images/gifts/throw-blanket.jpg', 'cozy,comfortable,warm', FALSE, FALSE, 4.7, 3200),
('Artisan Ceramic Vase', 'Handcrafted minimalist ceramic vase, perfect for fresh or dried flowers.', 'Home', 'Decor', 42.00, '/images/gifts/ceramic-vase.jpg', 'artistic,elegant,minimalist', FALSE, FALSE, 4.4, 540),

-- Food & Drink
('Gourmet Chocolate Collection', 'Artisan chocolate box with 24 hand-crafted truffles in unique flavors.', 'Food', 'Chocolate', 49.99, '/images/gifts/chocolate-box.jpg', 'indulgent,luxurious,delicious', FALSE, FALSE, 4.8, 2800),
('Premium Tea Collection', 'Curated collection of 12 loose-leaf teas from around the world in a wooden chest.', 'Food', 'Tea', 44.99, '/images/gifts/tea-collection.jpg', 'calming,sophisticated,healthy', FALSE, FALSE, 4.5, 980),
('Artisan Coffee Gift Set', 'Single-origin coffee beans (3 varieties), ceramic pour-over dripper, and filters.', 'Food', 'Coffee', 59.99, '/images/gifts/coffee-set.jpg', 'energizing,artisan,practical', FALSE, FALSE, 4.6, 1500),
('Gourmet Snack Box Subscription', 'Monthly delivery of curated international gourmet snacks, 3-month subscription.', 'Food', 'Subscription', 89.97, '/images/gifts/snack-box.jpg', 'fun,adventurous,delicious', FALSE, FALSE, 4.4, 760),

-- Digital
('Online Masterclass Subscription', 'Annual access to courses taught by world-renowned experts in various fields.', 'Digital', 'Education', 120.00, '/images/gifts/masterclass.jpg', 'intellectual,inspiring,growth', TRUE, FALSE, 4.5, 4200),
('Streaming Service Gift Card', '12-month premium streaming subscription with 4K and multiple screens.', 'Digital', 'Entertainment', 155.88, '/images/gifts/streaming.jpg', 'entertaining,convenient,modern', TRUE, FALSE, 4.3, 5600),
('Digital Art Commission', 'Custom digital artwork created by a professional artist based on your specifications.', 'Digital', 'Art', 85.00, '/images/gifts/digital-art.jpg', 'creative,unique,personal', TRUE, FALSE, 4.7, 390),
('Meditation App Lifetime Access', 'Lifetime premium access to guided meditations, sleep stories, and mindfulness exercises.', 'Digital', 'Wellness', 69.99, '/images/gifts/meditation-app.jpg', 'calming,wellness,mindful', TRUE, FALSE, 4.6, 1800),
('E-Gift Card Bundle', 'Flexible gift card redeemable at hundreds of popular retailers and restaurants.', 'Digital', 'Gift Cards', 50.00, '/images/gifts/gift-card.jpg', 'practical,flexible,convenient', TRUE, FALSE, 4.2, 8900);

-- Seed data for new categories (Soft Toys and Traditional Gifts)
INSERT INTO gifts (name, description, category, subcategory, price, image_url, emotion_tags, is_digital, is_experience, rating, review_count) VALUES
('Classic Teddy Bear', 'Fluffy brown teddy bear with a cute red ribbon, perfect for cuddles.', 'Soft Toys', 'Plush', 19.99, '/images/gifts/teddy-bear.jpg', 'cute,classic,warm', FALSE, FALSE, 4.8, 120),
('Plush Bunny', 'Super soft white plush bunny with long floppy ears and friendly eyes.', 'Soft Toys', 'Plush', 14.99, '/images/gifts/plush-bunny.jpg', 'cute,cuddly,gentle', FALSE, FALSE, 4.7, 85),
('Cute Cuddly Elephant', 'Grey soft toy elephant made of premium organic cotton materials.', 'Soft Toys', 'Plush', 22.50, '/images/gifts/cuddly-elephant.jpg', 'cute,organic,childhood', FALSE, FALSE, 4.9, 60),
('Friendly Dinosaur Plush', 'A friendly green T-Rex plush toy that makes a great companion for all ages.', 'Soft Toys', 'Plush', 17.99, '/images/gifts/dinosaur-plush.jpg', 'playful,fun,friendly', FALSE, FALSE, 4.6, 45),
('Soft Alpaca Toy', 'Fluffy alpaca plush doll that is incredibly soft and pleasant to hold.', 'Soft Toys', 'Plush', 25.00, '/images/gifts/alpaca-plush.jpg', 'cozy,cute,fluffy', FALSE, FALSE, 4.8, 70),
('Traditional Brass Diya', 'Handcrafted traditional Indian brass diya, perfect for festive occasions and warm light.', 'Traditional Gifts', 'Home Decor', 29.99, '/images/gifts/brass-diya.jpg', 'festive,cultural,spiritual', FALSE, FALSE, 4.9, 150),
('Handcrafted Ceramic Kettle', 'Beautifully hand-painted ceramic tea kettle set with traditional floral motifs.', 'Traditional Gifts', 'Kitchenware', 45.00, '/images/gifts/ceramic-kettle.jpg', 'artistic,traditional,elegant', FALSE, FALSE, 4.7, 95),
('Pichwai Art Painting', 'Exquisite Pichwai painting depicting traditional cows and lotus flowers.', 'Traditional Gifts', 'Art', 120.00, '/images/gifts/pichwai-painting.jpg', 'heritage,artistic,luxurious', FALSE, FALSE, 4.8, 40),
('Pashmina Shawl', '100% authentic hand-woven cashmere Pashmina shawl, imported from Kashmir.', 'Traditional Gifts', 'Fashion', 199.99, '/images/gifts/pashmina-shawl.jpg', 'warm,luxurious,elegant', FALSE, FALSE, 5.0, 110),
('Handcrafted Wooden Jewelry Box', 'Intricately carved wooden box with velvet lining, brass latches and secret compartments.', 'Traditional Gifts', 'Accessories', 35.50, '/images/gifts/wooden-box.jpg', 'heritage,practical,beautiful', FALSE, FALSE, 4.6, 130);

-- =============================================
-- SEED DATA: Default Users
-- =============================================
-- Default passwords are both 'password123' (BCrypt hash below)
INSERT INTO users (email, password_hash, full_name, role, premium, feature_flags) VALUES
('concierge@corporategifts.com', '$2a$10$qyFh/uH7u7M1sOshk2w8oexw/uA6Pj2c7XGvO1QnK4K1F2S/eK7mK', 'Concierge Admin', 'ADMIN', TRUE, '{"aiAssistant":true,"budgetPlanner":true,"groupGifting":true,"secretSanta":true,"giftStories":true,"futureLocker":true}'),
('alex.jones@acme.com', '$2a$10$qyFh/uH7u7M1sOshk2w8oexw/uA6Pj2c7XGvO1QnK4K1F2S/eK7mK', 'Alex Jones', 'USER', TRUE, '{"aiAssistant":true,"budgetPlanner":true,"groupGifting":true,"secretSanta":true,"giftStories":true,"futureLocker":true}');

-- =============================================
-- SEED DATA: Soft Toys, Showpieces, Wallhangings, Mugs
-- =============================================
INSERT INTO gifts (name, description, category, subcategory, price, image_url, emotion_tags, is_digital, is_experience, rating, review_count, stock) VALUES
('Fluffy Teddy Bear Plush', 'Extremely soft and cuddly teddy bear plush toy, ideal for comforting gifts.', 'softtoy', 'Plush', 24.99, 'https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&q=80&w=600', 'cute,comfort,caring', FALSE, FALSE, 4.8, 120, 15),
('Artisan Brass Ganesha Showpiece', 'Beautifully hand-sculpted solid brass Ganesha idol, perfect for home decor.', 'showpiece', 'Metal Art', 59.99, 'https://images.unsplash.com/photo-1608744882201-52a7f7f3dd60?auto=format&fit=crop&q=80&w=600', 'traditional,prestige,artistic', FALSE, FALSE, 4.9, 85, 4),
('Handwoven Macrame Wallhanging', 'Elegant bohemian style macrame wall hanging cotton tapestry for bedroom decor.', 'wallhanging', 'Home Decor', 34.50, 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=600', 'artistic,minimalist,warm', FALSE, FALSE, 4.7, 45, 12),
('Premium Gold-Rimmed Ceramic Mug', 'Hand-glazed matte coffee mug with premium gold-plated rim.', 'Mug', 'Kitchenware', 18.99, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600', 'practical,elegant,modern', FALSE, FALSE, 4.6, 95, 3);
