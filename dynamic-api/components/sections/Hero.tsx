
'use client';
import Button from '../ui/Button';
import Section from '../ui/Section';

export default function Hero() {
  return (
    <div className='bg-brand-gradient text-on-brand'>
      <Section className='text-center'>
        <p className='font-display text-4xl md:text-5xl font-extrabold tracking-tight'>Mister DJ</p>
        <p className='mt-4 text-lg md:text-xl/normal opacity-95 max-w-3xl mx-auto'>
          Maak van jouw feest een onvergetelijke ervaring. Met 15+ jaar ervaring en onze unieke
          <strong> 100% dansgarantie</strong> blijft de dansvloer de hele avond vol.
        </p>
        <div className='mt-8 flex gap-4 justify-center'>
          <Button size='lg'>Vraag gratis offerte aan</Button>
          <Button size='lg' variant='secondary' className='text-gray-900'>Bekijk pakketten</Button>
        </div>
        <div className='mt-10 grid grid-cols-3 gap-6 max-w-3xl mx-auto text-sm opacity-90'>
          <div><div className='text-3xl font-bold'>15+</div><div>jaar ervaring</div></div>
          <div><div className='text-3xl font-bold'>2500+</div><div>events</div></div>
          <div><div className='text-3xl font-bold'>100%</div><div>dansgarantie</div></div>
        </div>
      </Section>
    </div>
  );
}
