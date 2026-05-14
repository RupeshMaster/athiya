import { Target, Eye, Shield } from 'lucide-react';

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
              <h2 className="text-3xl font-bold mb-6">Our Legacy</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                At Athiya Inspired, we believe that real estate is not just about buying and selling land; it's about building a foundation for the future. With over a decade of experience, we have redefined premium real estate by focusing on strategic locations, clear titles, and sustainable development.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our journey started with a simple vision: to provide investors and families with properties they can trust. Today, we are proud to be a driving force in some of the most sought-after development zones, including Maha Mumbai and the pristine coastal regions.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
                alt="Office space" 
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
    </div>
  );
}
