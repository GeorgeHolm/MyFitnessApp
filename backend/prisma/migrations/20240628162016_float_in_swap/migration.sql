/*
  Warnings:

  - You are about to alter the column `reps` on the `Set` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Set" ALTER COLUMN "weight" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "reps" SET DATA TYPE INTEGER;
