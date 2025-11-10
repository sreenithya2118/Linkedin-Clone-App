import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  headline: text('headline'),
  bio: text('bio'),
  avatar: text('avatar'),
  location: text('location'),
  company: text('company'),
  position: text('position'),
  createdAt: text('created_at').notNull(),
});

// Posts table
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  likesCount: integer('likes_count').default(0),
  commentsCount: integer('comments_count').default(0),
  createdAt: text('created_at').notNull(),
});

// Likes table
export const likes = sqliteTable('likes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  postId: integer('post_id').notNull().references(() => posts.id),
  createdAt: text('created_at').notNull(),
});

// Comments table
export const comments = sqliteTable('comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  postId: integer('post_id').notNull().references(() => posts.id),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull(),
});

// Connections table
export const connections = sqliteTable('connections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  connectedUserId: integer('connected_user_id').notNull().references(() => users.id),
  status: text('status').notNull().default('pending'),
  createdAt: text('created_at').notNull(),
});