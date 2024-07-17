-- CreateTable
CREATE TABLE "ProfileWorkoutLikes" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER,
    "workoutId" INTEGER,

    CONSTRAINT "ProfileWorkoutLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileWorkoutTouched" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER,
    "workoutId" INTEGER,

    CONSTRAINT "ProfileWorkoutTouched_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileMealLikes" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER,
    "mealId" INTEGER,

    CONSTRAINT "ProfileMealLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileMealTouched" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER,
    "mealId" INTEGER,

    CONSTRAINT "ProfileMealTouched_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileWorkoutLikes" ADD CONSTRAINT "ProfileWorkoutLikes_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileWorkoutLikes" ADD CONSTRAINT "ProfileWorkoutLikes_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileWorkoutTouched" ADD CONSTRAINT "ProfileWorkoutTouched_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileWorkoutTouched" ADD CONSTRAINT "ProfileWorkoutTouched_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMealLikes" ADD CONSTRAINT "ProfileMealLikes_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMealLikes" ADD CONSTRAINT "ProfileMealLikes_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMealTouched" ADD CONSTRAINT "ProfileMealTouched_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMealTouched" ADD CONSTRAINT "ProfileMealTouched_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
