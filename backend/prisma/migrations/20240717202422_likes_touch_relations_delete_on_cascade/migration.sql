-- DropForeignKey
ALTER TABLE "ProfileMealLikes" DROP CONSTRAINT "ProfileMealLikes_mealId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileMealLikes" DROP CONSTRAINT "ProfileMealLikes_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileMealTouched" DROP CONSTRAINT "ProfileMealTouched_mealId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileMealTouched" DROP CONSTRAINT "ProfileMealTouched_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileWorkoutLikes" DROP CONSTRAINT "ProfileWorkoutLikes_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileWorkoutLikes" DROP CONSTRAINT "ProfileWorkoutLikes_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileWorkoutTouched" DROP CONSTRAINT "ProfileWorkoutTouched_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileWorkoutTouched" DROP CONSTRAINT "ProfileWorkoutTouched_workoutId_fkey";

-- AddForeignKey
ALTER TABLE "ProfileWorkoutLikes" ADD CONSTRAINT "ProfileWorkoutLikes_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileWorkoutLikes" ADD CONSTRAINT "ProfileWorkoutLikes_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileWorkoutTouched" ADD CONSTRAINT "ProfileWorkoutTouched_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileWorkoutTouched" ADD CONSTRAINT "ProfileWorkoutTouched_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMealLikes" ADD CONSTRAINT "ProfileMealLikes_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMealLikes" ADD CONSTRAINT "ProfileMealLikes_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMealTouched" ADD CONSTRAINT "ProfileMealTouched_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMealTouched" ADD CONSTRAINT "ProfileMealTouched_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
