-- DropIndex
DROP INDEX "RecipeTranslation_searchVector_idx";

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "masterId" TEXT;

-- CreateTable
CREATE TABLE "IngredientMaster" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "defaultAisle" "AisleKey",
    "canonicalUnit" "UnitKey",
    "isStaple" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "IngredientMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientMasterTranslation" (
    "id" TEXT NOT NULL,
    "masterId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "pluralName" TEXT,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "IngredientMasterTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IngredientMaster_slug_key" ON "IngredientMaster"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientMasterTranslation_masterId_locale_key" ON "IngredientMasterTranslation"("masterId", "locale");

-- CreateIndex
CREATE INDEX "Ingredient_masterId_idx" ON "Ingredient"("masterId");

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "IngredientMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientMasterTranslation" ADD CONSTRAINT "IngredientMasterTranslation_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "IngredientMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
