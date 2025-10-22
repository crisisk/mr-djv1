
import { Card } from '../ui/Card';
type Props = { quote: string; author: string; role?: string; rating?: number; };
export default function Testimonial({ quote, author, role, rating=5 }: Props) {
  return (
    <Card className='space-y-3'>
      <div className='flex gap-1 text-amber-400' aria-label={`${rating} van 5 sterren`}>
        {Array.from({length:rating}).map((_,i)=>(<span key={i}>★</span>))}
      </div>
      <p className='text-lg font-medium'>&ldquo;{quote}&rdquo;</p>
      <div className='text-sm text-text-muted font-semibold'>{author}{role ? ` · ${role}` : ''}</div>
    </Card>
  );
}
