import React from "react";
import Hero from "../../components/hero/Hero";
import SlidesEditor from "../../components/editor/SlidesEditor";
import Features from "../../components/features/Features";
import Pricing from "../../components/pricing/Pricing";
import Testimonials from "../../components/testimonials/Testimonials";
import CTA from "../../components/cta/CTA";

export default function Home() {
  return (
    <div className="pt-6">
      <Hero />

      <section className="max-w-8xl mx-auto px-6 md:px-10 py-6">
        {/* Slides editor and tools */}
        <SlidesEditor />
      </section>

      <section className="max-w-8xl mx-auto px-6 md:px-10 py-16">
        <Features />
      </section>

      <section className="max-w-8xl mx-auto px-6 md:px-10 py-16">
        <Pricing />
      </section>

      <section className="max-w-8xl mx-auto px-6 md:px-10 py-16">
        <Testimonials />
      </section>

      <section className="max-w-8xl mx-auto px-6 md:px-10 py-16">
        <CTA />
      </section>
    </div>
  );
}
