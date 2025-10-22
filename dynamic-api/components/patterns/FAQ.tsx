
type Props = { question: string; answer: string; };
export default function FAQ({ question, answer }: Props) {
  return (
    <details className='bg-white rounded-2xl shadow-sm p-6 open:shadow-md transition-shadow'>
      <summary className='cursor-pointer font-semibold text-lg'>{question}</summary>
      <div className='mt-4 text-text-muted leading-relaxed'>{answer}</div>
    </details>
  );
}
