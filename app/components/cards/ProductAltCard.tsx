import Image from 'next/image'
import { Product } from '@/app/types'

export default function ProductAltCard({ product }: { product: Product }) {
  return (
    <div className="flex w-[170px] md:w-[210px] h-[160px] md:h-[180px] items-center justify-center border-x border-border flex-col gap-3 md:gap-4">
      <div className="h-[80px] md:h-[108px] w-[80px] md:w-[108px] relative flex items-center justify-center">
        {/* Corner brackets — detail kecil yang bikin desainnya jadi lebih "techy" */}
        <div className="absolute top-0 left-0 right-0 w-full flex justify-between pointer-events-none">
          <div className="w-1.5 h-1.5 border-l border-t border-primary" />
          <div className="w-1.5 h-1.5 border-r border-t border-primary" />
        </div>
        <Image
          loading="lazy"
          src={product.imageSrc}
          alt={product.name}
          width={200}
          height={200}
          className="object-cover w-[60px] md:w-[80px] h-[60px] md:h-[80px] rounded"
        />
        <div className="absolute bottom-0 left-0 right-0 w-full flex justify-between pointer-events-none">
          <div className="w-1.5 h-1.5 border-l border-b border-primary" />
          <div className="w-1.5 h-1.5 border-r border-b border-primary" />
        </div>
      </div>
      <p className="text-sm text-center text-foreground mt-4">{product.name}</p>
    </div>
  )
}
