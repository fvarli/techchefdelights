type Locale = 'EN' | 'TR' | 'ES'

export type EquipmentSeed = {
  slug: string
  iconKey: string | null
  translations: Array<{ locale: Locale; name: string }>
}

export const equipment: EquipmentSeed[] = [
  {
    slug: 'oven',
    iconKey: 'oven',
    translations: [
      { locale: 'EN', name: 'Oven' },
      { locale: 'TR', name: 'Fırın' },
      { locale: 'ES', name: 'Horno' },
    ],
  },
  {
    slug: 'stovetop',
    iconKey: 'flame',
    translations: [
      { locale: 'EN', name: 'Stovetop' },
      { locale: 'TR', name: 'Ocak' },
      { locale: 'ES', name: 'Hornilla' },
    ],
  },
  {
    slug: 'blender',
    iconKey: 'blender',
    translations: [
      { locale: 'EN', name: 'Blender' },
      { locale: 'TR', name: 'Blender' },
      { locale: 'ES', name: 'Licuadora' },
    ],
  },
  {
    slug: 'mixer',
    iconKey: 'mixer',
    translations: [
      { locale: 'EN', name: 'Stand Mixer' },
      { locale: 'TR', name: 'Mikser' },
      { locale: 'ES', name: 'Batidora' },
    ],
  },
  {
    slug: 'food-processor',
    iconKey: 'processor',
    translations: [
      { locale: 'EN', name: 'Food Processor' },
      { locale: 'TR', name: 'Mutfak Robotu' },
      { locale: 'ES', name: 'Procesador de Alimentos' },
    ],
  },
  {
    slug: 'skillet',
    iconKey: 'pan',
    translations: [
      { locale: 'EN', name: 'Skillet' },
      { locale: 'TR', name: 'Tava' },
      { locale: 'ES', name: 'Sartén' },
    ],
  },
  {
    slug: 'saucepan',
    iconKey: 'pot',
    translations: [
      { locale: 'EN', name: 'Saucepan' },
      { locale: 'TR', name: 'Sos Tenceresi' },
      { locale: 'ES', name: 'Cazo' },
    ],
  },
  {
    slug: 'dutch-oven',
    iconKey: 'cast-iron',
    translations: [
      { locale: 'EN', name: 'Dutch Oven' },
      { locale: 'TR', name: 'Döküm Tencere' },
      { locale: 'ES', name: 'Cazuela de Hierro' },
    ],
  },
  {
    slug: 'baking-sheet',
    iconKey: 'tray',
    translations: [
      { locale: 'EN', name: 'Baking Sheet' },
      { locale: 'TR', name: 'Fırın Tepsisi' },
      { locale: 'ES', name: 'Bandeja de Horno' },
    ],
  },
  {
    slug: 'whisk',
    iconKey: 'whisk',
    translations: [
      { locale: 'EN', name: 'Whisk' },
      { locale: 'TR', name: 'Çırpıcı' },
      { locale: 'ES', name: 'Batidor de Mano' },
    ],
  },
  {
    slug: 'rolling-pin',
    iconKey: 'roller',
    translations: [
      { locale: 'EN', name: 'Rolling Pin' },
      { locale: 'TR', name: 'Oklava' },
      { locale: 'ES', name: 'Rodillo' },
    ],
  },
  {
    slug: 'thermometer',
    iconKey: 'thermometer',
    translations: [
      { locale: 'EN', name: 'Thermometer' },
      { locale: 'TR', name: 'Termometre' },
      { locale: 'ES', name: 'Termómetro' },
    ],
  },
]
