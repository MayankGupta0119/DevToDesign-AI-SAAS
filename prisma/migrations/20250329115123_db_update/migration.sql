-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WireframeToCode" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "imageUrl" TEXT,
    "model" TEXT,
    "description" TEXT,
    "code" JSONB,
    "createdBy" TEXT,

    CONSTRAINT "WireframeToCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WireframeToCode_uid_key" ON "WireframeToCode"("uid");
