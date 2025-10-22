
import { Card } from '../ui/Card';
import Image from 'next/image';

type Props = { title: string; category?: string; imageUrl: string; onClick?: () => void; };
export default function MediaCard({ title, category, imageUrl }: Props) {
  return (
    <Card className='p-0 overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow'>
      <div className='relative h-60 w-full bg-gray-200'>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-300'
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className='p-5'>
        {category && <div className='text-xs text-brand-600 font-semibold uppercase mb-2'>{category}</div>}
        <div className='text-lg font-semibold'>{title}</div>
      </div>
    </Card>
  );
}
