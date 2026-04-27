-- AlterTable
ALTER TABLE "RecipeEquipment" ADD COLUMN     "note" TEXT,
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "RecipeEquipment_recipeId_position_idx" ON "RecipeEquipment"("recipeId", "position");
