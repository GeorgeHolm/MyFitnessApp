-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "age" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bio" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "sex" TEXT NOT NULL DEFAULT '';
