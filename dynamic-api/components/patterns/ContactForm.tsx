
'use client';
import Button from '../ui/Button';
export default function ContactForm() {
  return (
    <form className='bg-white p-6 rounded-2xl shadow-md grid grid-cols-1 gap-4'>
      <input className='h-11 rounded-xl border border-gray-200 px-3' placeholder='Naam' />
      <input className='h-11 rounded-xl border border-gray-200 px-3' placeholder='Email' type='email' />
      <input className='h-11 rounded-xl border border-gray-200 px-3' placeholder='Telefoon' />
      <textarea className='min-h-[120px] rounded-xl border border-gray-200 p-3' placeholder='Bericht' />
      <Button className='w-full'>Verstuur</Button>
    </form>
  );
}
