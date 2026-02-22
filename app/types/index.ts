// Tipe data produk buat raffle items
export type Product = {
  id: string
  imageSrc: string
  name: string
  price: string
  ticket: string
}

// Data untuk card di CardSwipeSection
export interface CardData {
  frontImage: string
  backTitle: string
  backDescription: string
}

// Item raffle buat carousel
export interface RaffleItem {
  id: string
  image: string
  name: string
  saleEnded: string
  ticketPrice: number
  countdown: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
}
