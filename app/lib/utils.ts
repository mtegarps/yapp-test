/**
 * Pad angka jadi 2 digit. Contoh: 5 -> "05", 12 -> "12"
 */
export const padNumber = (n: number): string => String(n).padStart(2, '0')

/**
 * Bikin array dummy sebanyak n item.
 * Berguna buat looping render placeholder.
 */
export const createArray = (n: number): number[] => Array.from({ length: n }, (_, i) => i)

/**
 * Clamp value di antara min dan max.
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))
