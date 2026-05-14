import { Trees, HardHat, FileSignature, Ruler, Building, HeadphonesIcon } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: <Trees className="h-10 w-10 text-accent" />,
      title: "Landscaping Works",
      description: "Professional landscaping services that transform raw land into beautiful, sustainable, and functional outdoor spaces."
    },
    {
      icon: <HardHat className="h-10 w-10 text-accent" />,
      title: "Project Management",
      description: "End-to-end management of real estate developments, ensuring timely delivery and uncompromising quality."
    },
    {
      icon: <FileSignature className="h-10 w-10 text-accent" />,
      title: "Legal & Documentation",
      description: "Complete assistance with property legalities, clear title verification, and hassle-free documentation."
    },
    {
      icon: <Ruler className="h-10 w-10 text-accent" />,
      title: "Architecture & Design",
      description: "Innovative architectural planning and interior design services tailored for premium living spaces."
    },
    {
      icon: <Building className="h-10 w-10 text-accent" />,
      title: "Real Estate Consulting",
      description: "Expert guidance on high-return investments, strategic land acquisitions, and market analysis."
    },
    {
      icon: <HeadphonesIcon className="h-10 w-10 text-accent" />,
      title: "Post-Sales Support",
      description: "Dedicated customer service to assist you with maintenance, queries, and community management."
    }
  ];

  return (
    <div className="pt-20">
      <div className="bg-primary py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Services</h1>
        <p className="text-accent font-medium">Comprehensive Solutions for Real Estate</p>
      </div>

      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group border border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
