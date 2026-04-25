-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('EN', 'TR', 'ES');

-- CreateEnum
CREATE TYPE "Skill" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "UnitKey" AS ENUM ('G', 'KG', 'ML', 'L', 'TSP', 'TBSP', 'CUP', 'OZ', 'LB', 'PIECE', 'PINCH');

-- CreateEnum
CREATE TYPE "AisleKey" AS ENUM ('PRODUCE', 'MEAT', 'DAIRY', 'PANTRY', 'BAKERY', 'FROZEN', 'SPICES', 'OTHER');

-- CreateEnum
CREATE TYPE "AllergenPresence" AS ENUM ('CONTAINS', 'MAY_CONTAIN', 'FREE');

-- CreateEnum
CREATE TYPE "VideoProvider" AS ENUM ('YOUTUBE', 'VIMEO', 'SELF');

-- CreateEnum
CREATE TYPE "NewsletterStatus" AS ENUM ('PENDING', 'CONFIRMED', 'UNSUBSCRIBED');

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "authorId" TEXT,
    "cuisineId" TEXT,
    "skill" "Skill" NOT NULL,
    "servings" INTEGER NOT NULL,
    "prepMinutes" INTEGER NOT NULL,
    "cookMinutes" INTEGER NOT NULL,
    "totalMinutes" INTEGER NOT NULL,
    "heroImageCloudinary" TEXT NOT NULL,
    "heroBlurhash" TEXT,
    "costPerServingCents" INTEGER,
    "costCurrency" TEXT,
    "ratingAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "ratingDist" INTEGER[] DEFAULT ARRAY[0, 0, 0, 0, 0]::INTEGER[],
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeTranslation" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "searchVector" tsvector,

    CONSTRAINT "RecipeTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientGroup" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "IngredientGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientGroupTranslation" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "IngredientGroupTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION,
    "unit" "UnitKey",
    "quantityUS" DOUBLE PRECISION,
    "unitUS" "UnitKey",
    "optional" BOOLEAN NOT NULL DEFAULT false,
    "aisle" "AisleKey" NOT NULL DEFAULT 'OTHER',

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientTranslation" (
    "id" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "prep" TEXT,
    "substitutes" TEXT[],

    CONSTRAINT "IngredientTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Step" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "timerSeconds" INTEGER,
    "ingredientRefs" TEXT[],

    CONSTRAINT "Step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StepTranslation" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "note" TEXT,
    "timerLabel" TEXT,

    CONSTRAINT "StepTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "iconKey" TEXT,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentTranslation" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EquipmentTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeEquipment" (
    "recipeId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,

    CONSTRAINT "RecipeEquipment_pkey" PRIMARY KEY ("recipeId","equipmentId")
);

-- CreateTable
CREATE TABLE "Variation" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Variation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariationTranslation" (
    "id" TEXT NOT NULL,
    "variationId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "VariationTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQTranslation" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "q" TEXT NOT NULL,
    "a" TEXT NOT NULL,

    CONSTRAINT "FAQTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nutrition" (
    "recipeId" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "proteinG" DOUBLE PRECISION NOT NULL,
    "proteinDailyPct" DOUBLE PRECISION,
    "carbsG" DOUBLE PRECISION NOT NULL,
    "carbsDailyPct" DOUBLE PRECISION,
    "fatG" DOUBLE PRECISION NOT NULL,
    "fatDailyPct" DOUBLE PRECISION,
    "fiberG" DOUBLE PRECISION,
    "fiberDailyPct" DOUBLE PRECISION,
    "sugarG" DOUBLE PRECISION,
    "sodiumMg" DOUBLE PRECISION,
    "sodiumDailyPct" DOUBLE PRECISION,

    CONSTRAINT "Nutrition_pkey" PRIMARY KEY ("recipeId")
);

-- CreateTable
CREATE TABLE "RecipeVideo" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "provider" "VideoProvider" NOT NULL,
    "videoId" TEXT NOT NULL,
    "poster" TEXT,
    "duration" INTEGER,

    CONSTRAINT "RecipeVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "iconKey" TEXT,
    "popularityRank" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryTranslation" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,

    CONSTRAINT "CategoryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeCategory" (
    "recipeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "RecipeCategory_pkey" PRIMARY KEY ("recipeId","categoryId")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagTranslation" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TagTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeTag" (
    "recipeId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "RecipeTag_pkey" PRIMARY KEY ("recipeId","tagId")
);

-- CreateTable
CREATE TABLE "Diet" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Diet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DietTranslation" (
    "id" TEXT NOT NULL,
    "dietId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "DietTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeDiet" (
    "recipeId" TEXT NOT NULL,
    "dietId" TEXT NOT NULL,

    CONSTRAINT "RecipeDiet_pkey" PRIMARY KEY ("recipeId","dietId")
);

-- CreateTable
CREATE TABLE "Cuisine" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Cuisine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuisineTranslation" (
    "id" TEXT NOT NULL,
    "cuisineId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CuisineTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allergen" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Allergen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllergenTranslation" (
    "id" TEXT NOT NULL,
    "allergenId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AllergenTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeAllergen" (
    "recipeId" TEXT NOT NULL,
    "allergenId" TEXT NOT NULL,
    "presence" "AllergenPresence" NOT NULL,

    CONSTRAINT "RecipeAllergen_pkey" PRIMARY KEY ("recipeId","allergenId")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorTranslation" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "bio" TEXT,
    "title" TEXT,

    CONSTRAINT "AuthorTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeImage" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "cloudinaryId" TEXT NOT NULL,
    "w" INTEGER NOT NULL,
    "h" INTEGER NOT NULL,
    "blurhash" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "RecipeImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeImageTranslation" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "alt" TEXT NOT NULL,

    CONSTRAINT "RecipeImageTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StepImage" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "cloudinaryId" TEXT NOT NULL,
    "w" INTEGER NOT NULL,
    "h" INTEGER NOT NULL,
    "blurhash" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "StepImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StepImageTranslation" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "alt" TEXT NOT NULL,

    CONSTRAINT "StepImageTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorLocale" "Locale",
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSignup" (
    "id" TEXT NOT NULL,
    "emailHash" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "status" "NewsletterStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSignup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditorialPick" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EditorialPick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditorialPickTranslation" (
    "id" TEXT NOT NULL,
    "pickId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "pullQuote" TEXT,
    "byline" TEXT,

    CONSTRAINT "EditorialPickTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Recipe_cuisineId_idx" ON "Recipe"("cuisineId");

-- CreateIndex
CREATE INDEX "Recipe_skill_idx" ON "Recipe"("skill");

-- CreateIndex
CREATE INDEX "Recipe_publishedAt_idx" ON "Recipe"("publishedAt");

-- CreateIndex
CREATE INDEX "Recipe_authorId_idx" ON "Recipe"("authorId");

-- CreateIndex
CREATE INDEX "RecipeTranslation_locale_idx" ON "RecipeTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeTranslation_recipeId_locale_key" ON "RecipeTranslation"("recipeId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeTranslation_locale_slug_key" ON "RecipeTranslation"("locale", "slug");

-- CreateIndex
CREATE INDEX "IngredientGroup_recipeId_idx" ON "IngredientGroup"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientGroupTranslation_groupId_locale_key" ON "IngredientGroupTranslation"("groupId", "locale");

-- CreateIndex
CREATE INDEX "Ingredient_groupId_idx" ON "Ingredient"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientTranslation_ingredientId_locale_key" ON "IngredientTranslation"("ingredientId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Step_recipeId_index_key" ON "Step"("recipeId", "index");

-- CreateIndex
CREATE UNIQUE INDEX "StepTranslation_stepId_locale_key" ON "StepTranslation"("stepId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_slug_key" ON "Equipment"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentTranslation_equipmentId_locale_key" ON "EquipmentTranslation"("equipmentId", "locale");

-- CreateIndex
CREATE INDEX "RecipeEquipment_equipmentId_idx" ON "RecipeEquipment"("equipmentId");

-- CreateIndex
CREATE INDEX "Variation_recipeId_idx" ON "Variation"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "VariationTranslation_variationId_locale_key" ON "VariationTranslation"("variationId", "locale");

-- CreateIndex
CREATE INDEX "FAQ_recipeId_idx" ON "FAQ"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "FAQTranslation_faqId_locale_key" ON "FAQTranslation"("faqId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeVideo_recipeId_key" ON "RecipeVideo"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_categoryId_locale_key" ON "CategoryTranslation"("categoryId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_locale_slug_key" ON "CategoryTranslation"("locale", "slug");

-- CreateIndex
CREATE INDEX "RecipeCategory_categoryId_idx" ON "RecipeCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TagTranslation_tagId_locale_key" ON "TagTranslation"("tagId", "locale");

-- CreateIndex
CREATE INDEX "RecipeTag_tagId_idx" ON "RecipeTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Diet_slug_key" ON "Diet"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DietTranslation_dietId_locale_key" ON "DietTranslation"("dietId", "locale");

-- CreateIndex
CREATE INDEX "RecipeDiet_dietId_idx" ON "RecipeDiet"("dietId");

-- CreateIndex
CREATE UNIQUE INDEX "Cuisine_slug_key" ON "Cuisine"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CuisineTranslation_cuisineId_locale_key" ON "CuisineTranslation"("cuisineId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Allergen_slug_key" ON "Allergen"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AllergenTranslation_allergenId_locale_key" ON "AllergenTranslation"("allergenId", "locale");

-- CreateIndex
CREATE INDEX "RecipeAllergen_allergenId_idx" ON "RecipeAllergen"("allergenId");

-- CreateIndex
CREATE UNIQUE INDEX "Author_slug_key" ON "Author"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AuthorTranslation_authorId_locale_key" ON "AuthorTranslation"("authorId", "locale");

-- CreateIndex
CREATE INDEX "RecipeImage_recipeId_idx" ON "RecipeImage"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeImageTranslation_imageId_locale_key" ON "RecipeImageTranslation"("imageId", "locale");

-- CreateIndex
CREATE INDEX "StepImage_stepId_idx" ON "StepImage"("stepId");

-- CreateIndex
CREATE UNIQUE INDEX "StepImageTranslation_imageId_locale_key" ON "StepImageTranslation"("imageId", "locale");

-- CreateIndex
CREATE INDEX "Review_recipeId_idx" ON "Review"("recipeId");

-- CreateIndex
CREATE INDEX "Review_isPlaceholder_idx" ON "Review"("isPlaceholder");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSignup_emailHash_key" ON "NewsletterSignup"("emailHash");

-- CreateIndex
CREATE INDEX "EditorialPick_isActive_position_idx" ON "EditorialPick"("isActive", "position");

-- CreateIndex
CREATE INDEX "EditorialPick_recipeId_idx" ON "EditorialPick"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "EditorialPickTranslation_pickId_locale_key" ON "EditorialPickTranslation"("pickId", "locale");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_cuisineId_fkey" FOREIGN KEY ("cuisineId") REFERENCES "Cuisine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTranslation" ADD CONSTRAINT "RecipeTranslation_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientGroup" ADD CONSTRAINT "IngredientGroup_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientGroupTranslation" ADD CONSTRAINT "IngredientGroupTranslation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "IngredientGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "IngredientGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientTranslation" ADD CONSTRAINT "IngredientTranslation_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepTranslation" ADD CONSTRAINT "StepTranslation_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentTranslation" ADD CONSTRAINT "EquipmentTranslation_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeEquipment" ADD CONSTRAINT "RecipeEquipment_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeEquipment" ADD CONSTRAINT "RecipeEquipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variation" ADD CONSTRAINT "Variation_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariationTranslation" ADD CONSTRAINT "VariationTranslation_variationId_fkey" FOREIGN KEY ("variationId") REFERENCES "Variation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQ" ADD CONSTRAINT "FAQ_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQTranslation" ADD CONSTRAINT "FAQTranslation_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "FAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutrition" ADD CONSTRAINT "Nutrition_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeVideo" ADD CONSTRAINT "RecipeVideo_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeCategory" ADD CONSTRAINT "RecipeCategory_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeCategory" ADD CONSTRAINT "RecipeCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagTranslation" ADD CONSTRAINT "TagTranslation_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DietTranslation" ADD CONSTRAINT "DietTranslation_dietId_fkey" FOREIGN KEY ("dietId") REFERENCES "Diet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeDiet" ADD CONSTRAINT "RecipeDiet_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeDiet" ADD CONSTRAINT "RecipeDiet_dietId_fkey" FOREIGN KEY ("dietId") REFERENCES "Diet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuisineTranslation" ADD CONSTRAINT "CuisineTranslation_cuisineId_fkey" FOREIGN KEY ("cuisineId") REFERENCES "Cuisine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllergenTranslation" ADD CONSTRAINT "AllergenTranslation_allergenId_fkey" FOREIGN KEY ("allergenId") REFERENCES "Allergen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeAllergen" ADD CONSTRAINT "RecipeAllergen_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeAllergen" ADD CONSTRAINT "RecipeAllergen_allergenId_fkey" FOREIGN KEY ("allergenId") REFERENCES "Allergen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorTranslation" ADD CONSTRAINT "AuthorTranslation_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeImage" ADD CONSTRAINT "RecipeImage_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeImageTranslation" ADD CONSTRAINT "RecipeImageTranslation_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "RecipeImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepImage" ADD CONSTRAINT "StepImage_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepImageTranslation" ADD CONSTRAINT "StepImageTranslation_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "StepImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorialPick" ADD CONSTRAINT "EditorialPick_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorialPickTranslation" ADD CONSTRAINT "EditorialPickTranslation_pickId_fkey" FOREIGN KEY ("pickId") REFERENCES "EditorialPick"("id") ON DELETE CASCADE ON UPDATE CASCADE;
