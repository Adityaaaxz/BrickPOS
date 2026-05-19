-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "pieces" INTEGER NOT NULL DEFAULT 0,
    "ageRange" TEXT NOT NULL DEFAULT '6+',
    "rating" REAL NOT NULL DEFAULT 4.5,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");
