'use client'

import { useCallback, useEffect, useState } from 'react'
import { SK } from '@/lib/storage-keys'

export type ShoppingListItem = {
  id: string
  recipeSlug: string
  name: string
  quantity: number | null
  unit: string | null
  aisle: string
  checked: boolean
}

/**
 * v1 logged-out shopping list — backed by localStorage `tcd:shoppingList`.
 * Adding the same recipe again replaces its contributions (idempotent per recipe).
 */
export function useShoppingList(): {
  items: ShoppingListItem[]
  hydrated: boolean
  addRecipe: (recipeSlug: string, items: Omit<ShoppingListItem, 'id' | 'recipeSlug' | 'checked'>[]) => void
  removeRecipe: (recipeSlug: string) => void
  hasRecipe: (recipeSlug: string) => boolean
  clear: () => void
} {
  const [items, setItems] = useState<ShoppingListItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SK.shoppingList)
      if (raw) setItems(JSON.parse(raw) as ShoppingListItem[])
    } catch {}
    setHydrated(true)
  }, [])

  const persist = useCallback((next: ShoppingListItem[]) => {
    try {
      localStorage.setItem(SK.shoppingList, JSON.stringify(next))
    } catch {}
  }, [])

  const addRecipe = useCallback<
    (
      recipeSlug: string,
      items: Omit<ShoppingListItem, 'id' | 'recipeSlug' | 'checked'>[],
    ) => void
  >(
    (recipeSlug, newItems) => {
      setItems((prev) => {
        const without = prev.filter((i) => i.recipeSlug !== recipeSlug)
        const added: ShoppingListItem[] = newItems.map((it, idx) => ({
          ...it,
          id: `${recipeSlug}:${idx}`,
          recipeSlug,
          checked: false,
        }))
        const next = [...without, ...added]
        persist(next)
        return next
      })
    },
    [persist],
  )

  const removeRecipe = useCallback(
    (recipeSlug: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.recipeSlug !== recipeSlug)
        persist(next)
        return next
      })
    },
    [persist],
  )

  const hasRecipe = useCallback(
    (recipeSlug: string) => items.some((i) => i.recipeSlug === recipeSlug),
    [items],
  )

  const clear = useCallback(() => {
    setItems([])
    try {
      localStorage.removeItem(SK.shoppingList)
    } catch {}
  }, [])

  return { items, hydrated, addRecipe, removeRecipe, hasRecipe, clear }
}
