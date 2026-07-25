-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "visitor_ip" TEXT,
    "browser" TEXT,
    "country" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" TEXT,
    CONSTRAINT "contact_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meeting_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "meeting_topic" TEXT NOT NULL,
    "requested_date" TEXT NOT NULL,
    "requested_time" TEXT NOT NULL,
    "notes" TEXT,
    "visitor_ip" TEXT,
    "browser" TEXT,
    "country" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "accepted_date" TEXT,
    "accepted_time" TEXT,
    "meet_link" TEXT,
    "admin_message" TEXT,
    "admin_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" TEXT,
    CONSTRAINT "meeting_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "visitors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visitor_id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "country" TEXT,
    "browser" TEXT,
    "device" TEXT,
    "os" TEXT,
    "visitor_ip" TEXT,
    "visit_count" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "visitors_visitor_id_key" ON "visitors"("visitor_id");
