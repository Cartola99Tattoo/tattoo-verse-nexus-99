
# Database Migration Plan

This document outlines the current database schema and the plan for migrating to a new Supabase instance.

## Current Database Schema

### Tables

#### 1. Profiles
- **id**: UUID (Primary Key, references auth.users.id)
- **first_name**: Text
- **last_name**: Text
- **avatar_url**: Text (nullable)
- **phone**: Text (nullable)
- **role**: Text (enum: 'cliente', 'artista', 'admin')
- **tattoo_preferences**: JSON (nullable)
- **created_at**: Timestamp with time zone
- **updated_at**: Timestamp with time zone

#### 2. Blog Posts
- **id**: UUID (Primary Key)
- **title**: Text
- **content**: Text
- **excerpt**: Text (nullable)
- **cover_image**: Text (nullable)
- **published_at**: Timestamp with time zone (nullable)
- **slug**: Text (nullable, unique)
- **author_id**: UUID (Foreign Key to profiles.id)
- **category_id**: UUID (Foreign Key to blog_categories.id)
- **reading_time**: Integer (nullable)
- **view_count**: Integer (nullable, default: 0)
- **tags**: Text[] (nullable)
- **meta_description**: Text (nullable)
- **meta_keywords**: Text (nullable)
- **created_at**: Timestamp with time zone
- **updated_at**: Timestamp with time zone

#### 3. Blog Categories
- **id**: UUID (Primary Key)
- **name**: Text
- **description**: Text (nullable)
- **created_at**: Timestamp with time zone
- **updated_at**: Timestamp with time zone

#### 4. Products
- **id**: UUID (Primary Key)
- **name**: Text
- **description**: Text (nullable)
- **price**: Numeric
- **images**: Text[] (array of image URLs)
- **category**: Text (nullable)
- **artist_id**: UUID (Foreign Key to profiles.id, nullable)
- **rating**: Numeric (nullable)
- **status**: Text (nullable, enum: 'available', 'unavailable', 'limited')
- **created_at**: Timestamp with time zone
- **updated_at**: Timestamp with time zone

#### 5. Orders
- **id**: UUID (Primary Key)
- **reference_code**: Text
- **status**: Text (enum: 'pending', 'paid', 'shipped', 'delivered', 'canceled')
- **total_amount**: Numeric
- **customer_id**: UUID (Foreign Key to profiles.id)
- **created_at**: Timestamp with time zone
- **updated_at**: Timestamp with time zone

#### 6. Order Items
- **id**: UUID (Primary Key)
- **order_id**: UUID (Foreign Key to orders.id)
- **product_id**: UUID (Foreign Key to products.id)
- **quantity**: Integer
- **unit_price**: Numeric
- **created_at**: Timestamp with time zone

#### 7. Appointments
- **id**: UUID (Primary Key)
- **client_id**: UUID (Foreign Key to profiles.id)
- **artist_id**: UUID (Foreign Key to profiles.id)
- **start_date**: Timestamp with time zone
- **end_date**: Timestamp with time zone
- **status**: Text (enum: 'agendado', 'confirmado', 'concluído', 'cancelado')
- **description**: Text (nullable)
- **created_at**: Timestamp with time zone
- **updated_at**: Timestamp with time zone

## Migration Plan

### 1. Schema Creation
- Create all necessary tables in the new Supabase instance
- Set up appropriate indexes and constraints
- Configure Row Level Security (RLS) policies

### 2. Data Export and Import
- Export data from current Supabase instance using pgAdmin or Supabase CLI
- Process exported data if necessary (data cleaning, transformation)
- Import data into the new Supabase instance

### 3. Authentication Migration
- Export user accounts from current Supabase auth schema
- Import user accounts into new Supabase instance
- Ensure user IDs are preserved to maintain relationships

### 4. Storage Migration
- Export files from the current Supabase storage
- Import files into the new Supabase storage buckets
- Update references in database records if necessary

### 5. Edge Functions Migration
- Document and recreate all edge functions in the new Supabase instance
- Update any webhook URLs or endpoints that reference the functions

### 6. Testing
- Verify data integrity after migration
- Test all application functionalities with the new database
- Verify authentication flows and permissions

### 7. Switchover
- Update the application to connect to the new Supabase instance
- Monitor for any issues after switchover
- Keep the old instance available for a period in case rollback is needed

## Recommended Tools
- Supabase CLI
- pg_dump and pg_restore
- Database migration scripts (custom)
- Database comparison tools

## Timeframe
- Estimated migration time: 1-2 days
- Recommended to perform during low-traffic period
