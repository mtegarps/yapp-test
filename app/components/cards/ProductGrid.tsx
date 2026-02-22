'use client'

import { motion } from 'framer-motion'
import ProductCard from '@/app/components/cards/ProductCard'
import { Product } from '@/app/types'

interface ProductGridProps {
  products: Product[]
}

/**
 * Grid yang nampilin product cards di hero section.
 * Di mobile cuma keliatan 2 (pertama & terakhir),
 * di desktop keliatan semua 5 cards.
 */
export default function ProductGrid({ products }: ProductGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-5 gap-0 w-full"
    >
      {products.map((p, i) =>
        i === 0 || i === products.length - 1 ? (
          <motion.div key={p.id} variants={itemVariants}>
            <ProductCard product={p} allProducts={products} />
          </motion.div>
        ) : (
          <motion.div key={p.id} variants={itemVariants} className="hidden md:block">
            <ProductCard product={p} allProducts={products} />
          </motion.div>
        )
      )}
    </motion.section>
  )
}
