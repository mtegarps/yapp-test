import { Product, CardData, RaffleItem, NFTData } from '@/app/types'

// Produk dummy buat hero section dan marquee
export const PRODUCTS: Product[] = [
  { id: '1', imageSrc: './products/pudgy.svg', name: 'PUDGY PENGUINS', price: '$200,000', ticket: '10' },
  { id: '2', imageSrc: './products/sol.svg', name: '10 SOL', price: '$200,000', ticket: '10' },
  { id: '3', imageSrc: './products/worldOfWoman.svg', name: 'WORLD OF WOMAN', price: '$200,000', ticket: '10' },
  { id: '4', imageSrc: './products/btc.svg', name: '1 BTC', price: '$200,000', ticket: '10' },
  { id: '5', imageSrc: './products/gemesis.svg', name: 'GEMESIS', price: '$200,000', ticket: '10' },
  { id: '6', imageSrc: './products/pudgy.svg', name: 'PUDGY PENGUINS', price: '$200,000', ticket: '10' },
  { id: '7', imageSrc: './products/sol.svg', name: '10 SOL', price: '$200,000', ticket: '10' },
  { id: '8', imageSrc: './products/worldOfWoman.svg', name: 'WORLD OF WOMAN', price: '$200,000', ticket: '10' },
  { id: '9', imageSrc: './products/btc.svg', name: '1 BTC', price: '$200,000', ticket: '10' },
  { id: '10', imageSrc: './products/gemesis.svg', name: 'GEMESIS', price: '$200,000', ticket: '10' },
]

// Data card buat section "How it Works" (CardSwipeSection)
export const CARD_DATA: CardData[] = [
  {
    frontImage: '/cards/card-nft-tickets.png',
    backTitle: 'NFT TICKETS YOU CONTROL',
    backDescription: 'Every ticket is minted as an NFT on-chain. You can buy just one or as many as you want',
  },
  {
    frontImage: '/cards/card-higher-odds.png',
    backTitle: 'MORE TICKETS, HIGHER ODDS',
    backDescription: 'Each ticket is an entry. The more you hold, the better your chance to win.',
  },
  {
    frontImage: '/cards/card-evm-compatible.png',
    backTitle: 'FAIRNESS GUARANTEED BY CHAINLINK VRF',
    backDescription: 'Even if you buy many tickets, the winner is always chosen randomly and provably fair using Chainlink VRF',
  },
]

// Config posisi kartu untuk animasi fan -> spread -> flat
export const CARD_POSITIONS = {
  // Fan: kartu numpuk overlapping (tampak depan)
  fan: [
    { rotate: -12, x: -140, y: 40 },
    { rotate: -2, x: 0, y: -10 },
    { rotate: 8, x: 150, y: 30 },
  ],
  // Spread: kartu mulai merenggang (tampak depan)
  spread: [
    { rotate: -6, x: -340, y: 20 },
    { rotate: 0, x: 0, y: 0 },
    { rotate: 6, x: 340, y: 20 },
  ],
  // Flat: posisi final pas udah kebalik (tampak belakang)
  flat: [
    { rotate: 0, x: -390, y: 0 },
    { rotate: 0, x: 0, y: 0 },
    { rotate: 0, x: 390, y: 0 },
  ],
}

export const nftDataDummy: NFTData[] = [
  {
    id: 1,
    name: "Pudgy Penguin",
    image: "/nfts/nft-1.png",
    price: 200000,
    rafflePrice: 10,
    quota: 50,
    sold: 3,
    type: 'NFT',
    saleEnd: "2026-02-28"
  },
  {
    id: 2,
    name: "Pudgy Penguin",
    image: "/nfts/nft-1.png",
    price: 200000,
    rafflePrice: 10,
    quota: 50,
    sold: 3,
    type: 'NFT',
    saleEnd: "2026-02-28"
  },
  {
    id: 3,
    name: "Pudgy Penguin",
    image: "/nfts/nft-1.png",
    price: 200000,
    rafflePrice: 10,
    quota: 50,
    sold: 3,
    type: 'NFT',
    saleEnd: "2026-02-28"
  },
  {
    id: 4,
    name: "Pudgy Penguin",
    image: "/nfts/nft-1.png",
    price: 200000,
    rafflePrice: 10,
    quota: 50,
    sold: 3,
    type: 'NFT',
    saleEnd: "2026-02-28"
  },
  {
    id: 5,
    name: "Pudgy Penguin",
    image: "/nfts/nft-1.png",
    price: 200000,
    rafflePrice: 10,
    quota: 50,
    sold: 3,
    type: 'NFT',
    saleEnd: "2026-02-28"
  },
  {
    id: 6,
    name: "Pudgy Penguin",
    image: "/nfts/nft-1.png",
    price: 200000,
    rafflePrice: 10,
    quota: 50,
    sold: 3,
    type: 'NFT',
    saleEnd: "2026-02-28"
  },
  {
    id: 7,
    name: "Pudgy Penguin",
    image: "/nfts/nft-1.png",
    price: 200000,
    rafflePrice: 10,
    quota: 50,
    sold: 3,
    type: 'NFT',
    saleEnd: "2026-02-28"
  },
  {
    id: 8,
    name: "Pudgy Penguin",
    image: "/nfts/nft-1.png",
    price: 200000,
    rafflePrice: 10,
    quota: 50,
    sold: 3,
    type: 'NFT',
    saleEnd: "2026-02-28"
  },
  {
    id: 9,
    name: "Pudgy Penguin",
    image: "/nfts/nft-1.png",
    price: 200000,
    rafflePrice: 10,
    quota: 50,
    sold: 3,
    type: 'NFT',
    saleEnd: "2026-02-28"
  },
  {
    id: 10,
    name: "Pudgy Penguin",
    image: "/nfts/nft-1.png",
    price: 200000,
    rafflePrice: 10,
    quota: 50,
    sold: 3,
    type: 'NFT',
    saleEnd: "2026-02-28"
  },
]

// Dummy raffle items buat carousel section (legacy, kept for compatibility)
export const DUMMY_RAFFLES: RaffleItem[] = Array.from({ length: 8 }).map((_, i) => ({
  id: String(i + 1),
  image: '/products/pudgy.svg',
  name: 'Pudgy Penguins #7105',
  saleEnded: '29 Feb 2026',
  ticketPrice: 5,
  countdown: { days: 13, hours: 2, minutes: 4, seconds: 24 },
}))

// Tagline buat marquee section
export const TAGLINES = [
  'NFTS STARTING FROM JUST $10!',
  'JOIN THE WAVE',
  'MORE LIQUID THAN OPENSEA',
  'START SELLING ON RAFLUX',
]
