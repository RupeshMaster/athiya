import { Target, Eye, Shield } from 'lucide-react';
import Logo from '../assets/Images/Logo.jpeg'
import Founder from '../assets/Images/Founder.jpeg'
import Architech from '../assets/Images/Architech.jpeg'

export default function About() {
  return (
    <div className="pt-20">
      {/* Page Header */}
      <div className="bg-primary py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Us</h1>
        <p className="text-accent font-medium">Building Trust, Delivering Excellence</p>
      </div>

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">At GRAZIA Inspired</h2>
              <p className="text-slate-600 mb-6 leading-relaxed text-justify">
                At Athiya Inspired, we believe that real estate is not just about buying and selling land; it's about building a foundation for the future. With over a decade of experience, we have redefined premium real estate by focusing on strategic locations, clear titles, and sustainable development.
              </p>
              <p className="text-slate-600 leading-relaxed text-justify">
                Our journey started with a simple vision: to provide investors and families with properties they can trust. Today, we are proud to be a driving force in some of the most sought-after development zones, including Third Mumbai and nearest area.
              </p>
            </div>
            <div>
              <img 
                src={Logo} 
                alt="Logo" 
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">Our Mission</h3>
              <p className="text-slate-600">
                To deliver premium, high-value real estate projects that exceed customer expectations through transparency, quality, and timely execution.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">Our Vision</h3>
              <p className="text-slate-600">
                To be the most trusted and innovative real estate developer, setting new benchmarks in design, sustainability, and customer satisfaction.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">Core Values</h3>
              <p className="text-slate-600">
                Integrity, Transparency, Excellence, and Customer-Centricity form the pillars of every project we undertake.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Founder */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Text */}
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
                Leadership
              </span>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Our Founder
              </h2>
              <div className="w-12 h-1 bg-blue-600 rounded mb-6" />
                <p className="text-slate-600 leading-relaxed text-lg text-justify">
                  Founder Premanand Nathu Kamble — those who received good qualities from
                  their Mother &amp; Father — is known for his honesty, strong relationships
                  with people, and a heartfelt commitment to serving others. His values of
                  trust, transparency, and meaningful human connection form the foundation
                  of the company's vision and growth.
                </p>
              </div>

              {/* Image */}
              <div className="flex justify-center">
                <img
                  src={Founder}
                  alt="Founder Premanand Nathu Kamble"
                  className="rounded-2xl shadow-2xl w-full max-w-md object-cover aspect-[4/5]"
                />
              </div>

            </div>
          </div>
        </section>

      {/* Lead Architech */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="flex justify-center">
              <img
                src={Architech}
                alt="Leading Architech "
                className="rounded-2xl shadow-2xl w-full max-w-md object-cover aspect-[4/5]"
              />
            </div>
            {/* Text */}
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
                Leadership
              </span>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Our Leading Architech
              </h2>
              <div className="w-12 h-1 bg-blue-600 rounded mb-6" />
                <p className="text-slate-600 leading-relaxed text-lg text-justify">
                  Shraddha Badekar with years of expertise in Architectural planning and government sector work, She brings trust, experience and efficiency to every projec
                </p>
              </div>
            </div>
          </div>
      </section>
    </div>
  );
}
