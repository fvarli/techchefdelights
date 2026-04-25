import type { RecipeSeed } from '../../types'

import { redLentilSoup } from './red-lentil-soup'
import { misoButterSpaghetti } from './miso-butter-spaghetti'
import { avocadoToast } from './avocado-toast'
import { mediterraneanQuinoaSalad } from './mediterranean-quinoa-salad'

// 8 recipes total — remaining 4 (classic-baklava, lemon-cheesecake,
// dark-chocolate-souffle, margherita-pizza) added in next pass.
export const recipes: RecipeSeed[] = [
  redLentilSoup,
  misoButterSpaghetti,
  avocadoToast,
  mediterraneanQuinoaSalad,
]
