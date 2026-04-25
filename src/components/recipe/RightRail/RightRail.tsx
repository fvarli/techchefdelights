import { NutritionCard } from '@/components/recipe/NutritionCard'
import { DietaryCard } from '@/components/recipe/DietaryCard'
import { CostCard } from '@/components/recipe/CostCard'
import { UtilitiesCard } from '@/components/recipe/UtilitiesCard'
import type { ApiRecipe } from '@/lib/api/types'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './RightRail.module.css'

type Props = {
  recipe: ApiRecipe
  locale: ApiLocale
  labels: {
    nutrition: Parameters<typeof NutritionCard>[0]['labels']
    dietary: Parameters<typeof DietaryCard>[0]['labels']
    cost: Parameters<typeof CostCard>[0]['labels']
    utilities: Parameters<typeof UtilitiesCard>[0]['labels']
  }
}

export function RightRail({ recipe, locale, labels }: Props) {
  return (
    <div className={styles.rail}>
      <NutritionCard nutrition={recipe.nutrition} labels={labels.nutrition} />
      <DietaryCard
        diets={recipe.diets}
        allergens={recipe.allergens}
        labels={labels.dietary}
      />
      <CostCard
        cost={recipe.costPerServing}
        servings={recipe.meta.servings}
        locale={locale}
        labels={labels.cost}
      />
      <UtilitiesCard recipe={recipe} labels={labels.utilities} />
    </div>
  )
}
