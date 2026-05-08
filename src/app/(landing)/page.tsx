'use client';

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowRight, Leaf, Truck, Users, ShieldCheck, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const { t, locale } = useSettings();

  return (
    <div className="flex flex-col gap-32 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-32 md:pt-40 md:pb-48 px-4 sm:px-6 lg:px-8">
        {/* Modern Background blob effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] pointer-events-none -z-10">
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[var(--primary)]/15 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
          <div className="absolute top-40 -left-20 w-[500px] h-[500px] bg-[var(--accent)]/15 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob [animation-delay:2s]" />
        </div>

        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-sm font-semibold shadow-sm border border-[var(--primary)]/20 hover:scale-105 transition-transform duration-300">
                <Leaf className="w-4 h-4 animate-bounce" />
                <span>{t.tagline}</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1]">
                {t.landing.heroTitle}
              </h1>
              
              <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed max-w-lg">
                {t.landing.heroSubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full gap-2 shadow-xl shadow-[var(--primary)]/20 hover:scale-110 hover:shadow-2xl transition-all duration-300">
                  {t.landing.heroCta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link href="/produk" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full text-lg px-8 h-14 rounded-full gap-2 hover:bg-[var(--bg-tertiary)] hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                    <ShoppingBag className="w-5 h-5" />
                    {locale === 'id' ? 'Lihat Produk' : 'View Products'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[400px] lg:h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl animate-float group">
              <Image 
                src="/images/farm.png" 
                alt="STM Farm Field" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute bottom-8 left-8 right-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex gap-4">
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-colors">
                    <div className="text-3xl font-bold">15+</div>
                    <div className="text-sm font-medium text-white/80">{t.landing.statsYears}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-colors">
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-sm font-medium text-white/80">{t.landing.statsPartners}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="layanan" className="container space-y-16 scroll-mt-32">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] hover:scale-105 transition-transform duration-300">{t.landing.servicesTitle}</h2>
          <p className="text-lg text-[var(--text-secondary)]">{t.landing.aboutVision}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Users, title: t.landing.serviceRetail, desc: t.landing.serviceRetailDesc, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40' },
            { icon: Truck, title: t.landing.serviceSupply, desc: t.landing.serviceSupplyDesc, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/40' },
            { icon: ShieldCheck, title: t.landing.serviceCorporate, desc: t.landing.serviceCorporateDesc, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40' },
            { icon: Leaf, title: t.landing.serviceExport, desc: t.landing.serviceExportDesc, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/40' },
          ].map((service, i) => (
            <Card key={i} className="border border-[var(--border-light)] shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 bg-[var(--bg-secondary)] rounded-3xl overflow-hidden group">
              <CardContent className="p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--bg-tertiary)] rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150"></div>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${service.bg} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative z-10`}>
                  <service.icon className={`w-8 h-8 ${service.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] relative z-10">{service.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed relative z-10">{service.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="container scroll-mt-32">
        <div className="bg-[var(--bg-tertiary)] rounded-[3rem] p-12 md:p-16 border border-[var(--border-light)] hover:shadow-xl transition-shadow duration-500">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] hover:-translate-y-1 transition-transform">
                {locale === 'id' ? 'Produk Pilihan Kami' : 'Our Featured Products'}
              </h2>
              <p className="text-lg text-[var(--text-secondary)]">
                {locale === 'id' 
                  ? 'Kualitas terbaik langsung dari kebun, diproses dengan standar tinggi untuk kepuasan Anda.' 
                  : 'Best quality straight from the farm, processed with high standards for your satisfaction.'}
              </p>
            </div>
            <Link href="/produk">
              <Button variant="outline" size="lg" className="rounded-full gap-2 hover:scale-105 transition-transform group">
                {locale === 'id' ? 'Lihat Semua Produk' : 'View All Products'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4 group cursor-pointer">
              <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                <Image src="/images/baked.png" alt="Ubi Bakar" fill className="object-cover group-hover:scale-125 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">{locale === 'id' ? 'Ubi Bakar Madu' : 'Honey Baked Sweet Potato'}</h3>
              <p className="text-[var(--text-secondary)]">{locale === 'id' ? 'Manis alami dan lembut.' : 'Naturally sweet and soft.'}</p>
            </div>
            <div className="space-y-4 group cursor-pointer md:-translate-y-8">
              <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                <Image src="/images/paste.png" alt="Pasta Ubi" fill className="object-cover group-hover:scale-125 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">{locale === 'id' ? 'Pasta Ubi Halus' : 'Smooth Sweet Potato Paste'}</h3>
              <p className="text-[var(--text-secondary)]">{locale === 'id' ? 'Murni tanpa gula tambahan.' : 'Pure without added sugar.'}</p>
            </div>
            <div className="space-y-4 group cursor-pointer">
              <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                <Image src="/images/pia.png" alt="Pia Ubi" fill className="object-cover group-hover:scale-125 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">{locale === 'id' ? 'Pia Isi Ubi' : 'Sweet Potato Pia Pastry'}</h3>
              <p className="text-[var(--text-secondary)]">{locale === 'id' ? 'Kue tradisional yang renyah.' : 'Crunchy traditional pastry.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="container scroll-mt-32">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-12 items-center">
          {/* Left: Image & Floating Cards */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative h-[450px] md:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group">
              <Image
                src="/images/farm.png"
                alt="Tentang Kami"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/80 via-transparent to-transparent opacity-60"></div>
            </div>
            
            {/* Floating Glassmorphism Card 1 */}
            <div className="absolute -bottom-8 -right-4 md:-right-8 bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-[240px] animate-float">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[var(--accent)] rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shrink-0">
                  15+
                </div>
                <div>
                  <h4 className="text-[var(--text-primary)] font-bold leading-tight">{locale === 'id' ? 'Tahun Pengalaman' : 'Years Experience'}</h4>
                  <p className="text-[var(--text-tertiary)] text-xs mt-1">{locale === 'id' ? 'Di industri pertanian ubi.' : 'In sweet potato farming.'}</p>
                </div>
              </div>
            </div>
            
            {/* Secondary Floating Card */}
            <div className="absolute top-12 -left-4 md:-left-8 bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-[240px] animate-float [animation-delay:2s]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-[var(--text-primary)] font-bold leading-tight">{locale === 'id' ? 'Kualitas Terjamin' : 'Quality Assured'}</h4>
                  <p className="text-[var(--text-tertiary)] text-xs mt-1">{locale === 'id' ? '100% Produk organik terbaik.' : '100% Best organic products.'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Detailed Content */}
          <div className="w-full lg:w-1/2 space-y-8 lg:pl-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-sm shadow-sm border border-[var(--primary)]/20 animate-fade-in-up">
              <Users className="w-4 h-4" />
              {locale === 'id' ? 'Mengenal Kami Lebih Dekat' : 'Getting to Know Us'}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] leading-tight">
              {t.landing.aboutTitle}
            </h2>
            
            <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed">
              <p>
                {t.landing.aboutDesc}
              </p>
              <p className="font-medium text-[var(--text-primary)] border-l-4 border-[var(--primary)] pl-6 py-2 italic bg-[var(--bg-tertiary)] rounded-r-2xl">
                {locale === 'id' 
                  ? '"Berdiri sejak tahun 2010, STM Farm bermula dari lahan kecil yang kini berkembang menjadi pemasok ubi terpercaya. Kualitas adalah prioritas utama kami."' 
                  : '"Established in 2010, STM Farm started from a small land and has grown into a trusted sweet potato supplier. Quality is our main priority."'}
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8 pt-6">
              {[
                { icon: Leaf, title: locale === 'id' ? 'Ramah Lingkungan' : 'Eco-Friendly', desc: locale === 'id' ? 'Praktik pertanian yang menjaga kelestarian alam.' : 'Farming practices that preserve nature.' },
                { icon: Users, title: locale === 'id' ? 'Petani Lokal' : 'Local Farmers', desc: locale === 'id' ? 'Memberdayakan komunitas di sekitar area kami.' : 'Empowering communities around our area.' },
                { icon: Truck, title: locale === 'id' ? 'Distribusi Cepat' : 'Fast Distribution', desc: locale === 'id' ? 'Armada kami menjamin barang tiba tepat waktu.' : 'Our fleet ensures goods arrive on time.' },
                { icon: ShieldCheck, title: locale === 'id' ? 'Standar Tinggi' : 'High Standards', desc: locale === 'id' ? 'Melewati proses Quality Control yang ketat.' : 'Passing strict Quality Control processes.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start group">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 shadow-sm border border-[var(--border-light)] text-[var(--primary)] group-hover:scale-110 group-hover:-rotate-3">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="pt-1">
                    <h4 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">{item.title}</h4>
                    <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-10">
              <Link href="#kontak">
                <Button size="lg" className="rounded-full px-10 h-16 text-lg font-bold hover:scale-105 shadow-xl shadow-[var(--primary)]/20 transition-all duration-300 gap-3 group">
                  {locale === 'id' ? 'Mari Bekerja Sama' : 'Let\'s Work Together'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section id="kontak" className="container scroll-mt-32">
        <div className="max-w-5xl mx-auto text-center space-y-10 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] p-12 md:p-24 rounded-[3rem] border border-[var(--border-light)] shadow-lg relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] group-hover:h-3 transition-all duration-300"></div>
          <div className="absolute -left-32 -top-32 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
          
          <h2 className="text-4xl md:text-6xl font-extrabold text-[var(--text-primary)] relative z-10 group-hover:scale-105 transition-transform duration-500">{t.landing.ctaTitle}</h2>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed relative z-10">{t.landing.ctaDesc}</p>
          <Button size="lg" className="h-16 px-10 text-xl rounded-full shadow-2xl hover:scale-110 hover:shadow-[0_0_40px_rgba(22,101,52,0.4)] transition-all duration-300 gap-3 relative z-10" onClick={() => window.open('https://wa.me/6281234567890', '_blank')}>
            {t.landing.ctaButton}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>
      </section>
    </div>
  );
}
