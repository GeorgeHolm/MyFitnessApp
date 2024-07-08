/*
  Warnings:

  - Added the required column `totalCalories` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCarbs` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalFats` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalGrams` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalProteins` to the `Meal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meal" ADD COLUMN     "totalCalories" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalCarbs" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalFats" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalGrams" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalProteins" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Food" (
    "id" SERIAL NOT NULL,
    "mealId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fats" DOUBLE PRECISION NOT NULL,
    "proteins" DOUBLE PRECISION NOT NULL,
    "grams" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
