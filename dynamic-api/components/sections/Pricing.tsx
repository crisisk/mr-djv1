
import Section from '../ui/Section';
import Button from '../ui/Button';
import { Card } from '../ui/Card';

const tiers = [
  { name:'Brons', price:795, hours:4, bullets:['Professionele allround DJ','Compact geluidsysteem','Basis sfeerverlichting','Online muziekplanner','Voorbereidend intakegesprek'] },
  { name:'Zilver', price:995, hours:5, popular:true, bullets:['Senior DJ','Premium geluidsysteem','Intelligente LED-verlichting','Persoonlijk draaiboek & muziekprofiel','100% dansgarantie'] },
  { name:'Goud', price:1295, hours:6, bullets:['Senior event-DJ','Line-array geluid','Moving heads & lichttechnicus','Custom DJ-booth met logo','Aftermovie & opnamerechten'] },
];

export default function Pricing() {
  return (
    <Section id='pricing'>
      <div className='text-center mb-10'>
        <h2 className='font-display text-3xl md:text-4xl font-extrabold'>Onze Pakketten</h2>
        <p className='text-text-muted mt-3'>Kies het pakket dat bij jouw feest past.</p>
      </div>
      <div className='grid md:grid-cols-3 gap-6'>
        {tiers.map((t) => (
          <Card key={t.name} className={t.popular ? 'ring-2 ring-brand-600' : ''}>
            <div className='flex items-baseline justify-between'>
              <h3 className='text-xl font-bold'>{t.name} Pakket</h3>
              <div className='text-2xl font-extrabold'>€{t.price}</div>
            </div>
            <div className='text-sm text-text-muted mt-1'>{t.hours} uur</div>
            <ul className='mt-4 space-y-2'>
              {t.bullets.map((b) => (<li key={b} className='flex items-start gap-2'><span>✓</span><span>{b}</span></li>))}
            </ul>
            <Button className='mt-6 w-full'>Boek nu</Button>
          </Card>
        ))}
      </div>
    </Section>
  );
}
