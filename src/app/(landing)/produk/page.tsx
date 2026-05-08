'use client';

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

const products = [
  {
    id: 'ubi-segar',
    name: { id: 'Ubi Segar Premium', en: 'Premium Raw Sweet Potato' },
    desc: {
      id: 'Ubi kualitas terbaik hasil panen langsung dari perkebunan kami. Kaya akan serat dan vitamin.',
      en: 'Top quality sweet potatoes harvested straight from our farm. Rich in fiber and vitamins.',
    },
    image: '/images/farm.png',
    price: 'Rp 15.000 / kg',
  },
  {
    id: 'ubi-bakar',
    name: { id: 'Ubi Bakar Madu', en: 'Honey Baked Sweet Potato' },
    desc: {
      id: 'Ubi bakar manis alami dengan tekstur lembut, siap dinikmati kapan saja. Aroma khas yang menggugah selera.',
      en: 'Naturally sweet baked sweet potatoes with a soft texture, ready to enjoy anytime. Appetizing aroma.',
    },
    image: '/images/baked.png',
    price: 'Rp 25.000 / box',
  },
  {
    id: 'pasta-ubi',
    name: { id: 'Pasta Ubi Halus', en: 'Smooth Sweet Potato Paste' },
    desc: {
      id: 'Pasta ubi murni tanpa tambahan gula, cocok untuk bahan kue, minuman, atau makanan bayi.',
      en: 'Pure sweet potato paste with no added sugar, perfect for baking, drinks, or baby food.',
    },
    image: '/images/paste.png',
    price: 'Rp 40.000 / jar',
  },
  {
    id: 'pia-ubi',
    name: { id: 'Pia Isi Ubi', en: 'Sweet Potato Pia Pastry' },
    desc: {
      id: 'Kue pia tradisional dengan isian ubi manis yang legit dan kulit yang renyah. Cocok untuk teman minum teh.',
      en: 'Traditional pia pastry with sweet, rich sweet potato filling and flaky crust. Perfect with tea.',
    },
    image: '/images/pia.png',
    price: 'Rp 35.000 / box',
  },
];

export default function ProdukPage() {
  const { t, locale } = useSettings();

  return (
    <div className="flex flex-col gap-24 pb-24 pt-32">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--text-primary)]">
          {locale === 'id' ? 'Produk Kami' : 'Our Products'}
        </h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          {locale === 'id'
            ? 'Temukan berbagai produk olahan ubi berkualitas tinggi, mulai dari ubi segar hingga camilan lezat.'
            : 'Discover various high-quality sweet potato products, from fresh produce to delicious snacks.'}
        </p>
      </section>

      {/* Product List */}
      <section className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 group bg-[var(--bg-secondary)]">
              <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name[locale]}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-8 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">{product.name[locale]}</h2>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                  {product.desc[locale]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Banner / CTA */}
      <section className="container">
        <div className="bg-[var(--primary)] rounded-3xl p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
          
          <h2 className="text-3xl md:text-4xl font-bold text-white relative z-10">
            {locale === 'id' ? 'Tertarik menjadi agen atau reseller?' : 'Interested in becoming an agent or reseller?'}
          </h2>
          <p className="text-primary-light text-lg max-w-2xl mx-auto relative z-10">
            {locale === 'id' 
              ? 'Dapatkan harga khusus untuk pembelian dalam jumlah besar. Hubungi tim kami untuk informasi lebih lanjut.'
              : 'Get special prices for bulk purchases. Contact our team for more information.'}
          </p>
          <div className="pt-4 relative z-10">
            <Button variant="secondary" size="lg" className="rounded-full px-8 gap-2 group" onClick={() => window.open('https://wa.me/628997777592', '_blank')}>
              {locale === 'id' ? 'Hubungi Kami' : 'Contact Us'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
