import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Shield, 
  Sparkles, 
  Heart, 
  Leaf,
  ExternalLink,
  CheckCircle,
  Star,
  Users,
  Clock
} from 'lucide-react';
import panchakarmaImage from '@/assets/ayurveda-background.jpg';

const Home = () => {
  const navigate = useNavigate();

  const therapies = [
    { name: 'Vaman', description: 'Therapeutic vomiting for kapha-dominated conditions', conditions: ['Weight gain', 'Asthma', 'Hyperacidity'], color: 'ayurveda-earth' },
    { name: 'Virechan', description: 'Purgation therapy for pitta imbalances', conditions: ['Herpes zoster', 'Jaundice', 'Colitis'], color: 'ayurveda-fire' },
    { name: 'Basti', description: 'Medicated enemas for vata disorders', conditions: ['Arthritis', 'Piles', 'Constipation'], color: 'ayurveda-water' },
    { name: 'Nasya', description: 'Nasal therapy for head and neck conditions', conditions: ['Headaches', 'Sinusitis', 'Sleep disorders'], color: 'ayurveda-air' },
    { name: 'Raktamokshan', description: 'Blood purification therapy', conditions: ['Skin infections', 'Psoriasis', 'Dermatitis'], color: 'ayurveda-space' }
  ];

  const benefits = [ 'Complete body purification', 'Toxin elimination', 'Accelerated metabolism', 'Weight management', 'Enhanced digestive fire', 'Unblocked energy channels', 'Mind-body relaxation', 'Tissue rejuvenation', 'Improved immunity', 'Stress relief' ];

  const sdgGoals = [
    { number: 3, title: "Good Health and Well-being", description: "Promoting holistic wellness through traditional Ayurvedic healing" },
    { number: 8, title: "Decent Work and Economic Growth",  description: "Supporting traditional healing practitioners and wellness industry" },
    { number: 10, title: "Reduced Inequalities", description: "Making quality healthcare accessible across socio-economic divides" },
    { number: 12, title: "Responsible Consumption", description: "Promoting natural, sustainable healing practices over synthetic alternatives" }
  ];

  const stats = [
    { number: '5000+', label: 'Patients Treated', icon: Users },
    { number: '150+', label: 'Certified Centers', icon: MapPin },
    { number: '98%', label: 'Success Rate', icon: Star },
    { number: '24/7', label: 'Support Available', icon: Clock }
  ];
  
  // --- UPDATED: Removed the imageUrl property ---
  const testimonials = [
    {
      name: 'Dr. Vasant Lad',
      speciality: 'Ayurvedic Physician',
      quote: "Ayusutra's platform bridges the gap between ancient wisdom and modern accessibility. It’s a vital tool for bringing authentic Ayurveda to a wider audience.",
      rating: 5,
    },
    {
      name: 'Dr. Priya Sharma',
      speciality: 'Panchakarma Expert',
      quote: "The ability to track patient progress and manage appointments seamlessly allows me to focus on what truly matters: healing. This is a game-changer.",
      rating: 5,
    },
    {
      name: 'Dr. Rajesh Kumar',
      speciality: 'Detox Therapist',
      quote: "I've seen remarkable transformations in my patients. The platform's focus on authentic therapies and detailed tracking is incredibly effective.",
      rating: 4,
    },
    {
      name: 'Dr. Anjali Mehta',
      speciality: 'Wellness Consultant',
      quote: "Connecting patients with certified centers they can trust is paramount. Ayusutra has created a reliable and essential ecosystem for wellness.",
      rating: 5,
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0">
          <img 
            src={panchakarmaImage} 
            alt="Traditional Panchakarma Therapy Session" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary-light/40"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                <span className="text-gradient-accent">Ayusutra</span>
                <br />
                <span className="text-3xl lg:text-4xl font-normal">Panchakarma Wellness</span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8 max-w-2xl">
                Transform your health with traditional Ayurvedic Panchakarma therapies, 
                enhanced by modern technology for comprehensive detoxification, 
                rejuvenation, and chronic disease management.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/signup')}
                  className="bg-white text-primary hover:bg-white/90 shadow-golden hover-glow"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/locate')}
                  className="border-white text-white hover:bg-white/10 hover-lift"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Find Centers
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block animate-float">
              <div className="relative">
                <div className="w-full max-w-md mx-auto card-3d bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-2xl">
                  <div className="text-center text-gray-800 space-y-4">
                    <Leaf className="w-12 h-12 mx-auto text-primary" />
                    <h3 className="text-xl font-bold">Quick Actions</h3>
                    
                    <Button 
                      onClick={() => navigate('/book')}
                      className="w-full bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                      variant="outline"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Appointment
                    </Button>
                    
                    <Button 
                      onClick={() => navigate('/locate')}
                      className="w-full bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                      variant="outline"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Find Centers
                    </Button>
                    
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">5 Panchakarma Therapies</p>
                      <div className="grid grid-cols-5 gap-1 mt-2">
                        {therapies.map((therapy, index) => (
                          <div key={index} className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">{stat.number}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDG Goals Section */}
      <section className="py-16 bg-gradient-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary text-primary">
              UN Sustainable Development Goals
            </Badge>
            <h2 className="text-3xl font-bold text-gradient-primary mb-4">
              Contributing to Global Wellness
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Ayusutra aligns with the United Nations Sustainable Development Goals, 
              promoting health, equality, and sustainable practices through traditional Ayurvedic wisdom.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sdgGoals.map((goal, index) => (
              <Card key={index} className="card-3d hover-lift text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {goal.number}
                  </div>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Panchakarma Details Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              The Five Sacred Actions
            </Badge>
            <h2 className="text-4xl font-bold text-gradient-primary mb-6">
              Understanding Panchakarma
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Panchakarma, a prominent branch of Ayurveda, literally means 'Five Actions.' 
              It is a healing technique that relies on five distinct basic actions to control the body, 
              embodying the core values of Ayurveda with medicated oils to eliminate impurities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {therapies.map((therapy, index) => (
              <Card key={index} className="card-3d hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full bg-${therapy.color}/20 flex items-center justify-center`}>
                      <span className="text-2xl font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <CardTitle className="text-xl">{therapy.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {therapy.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Effective for:</p>
                    {therapy.conditions.map((condition, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm">{condition}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="card-3d hover-lift bg-gradient-accent animate-fade-in md:col-span-2 lg:col-span-1" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Ask Grok AI</CardTitle>
                    <CardDescription className="text-white/80">
                      Personalized Ayurveda guidance
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 text-sm mb-4">
                  Get instant answers about Panchakarma, personalized recommendations, 
                  and 24/7 support powered by advanced AI.
                </p>
                <div className="space-y-2 text-white/80 text-xs">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3" />
                    <span>Therapy recommendations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3" />
                    <span>Symptom assessment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3" />
                    <span>Voice-enabled support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-gradient-primary">
              Transformative Benefits
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-2 p-3 bg-white rounded-lg shadow-soft hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Heart className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Doctor Testimonials Section --- */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary text-primary">
              Words from Our Experts
            </Badge>
            <h2 className="text-4xl font-bold text-gradient-primary mb-6">
              Meet Our Expert Vaidyas
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our team of certified Ayurvedic doctors brings a wealth of knowledge and experience, 
              dedicated to guiding you on your path to holistic wellness.
            </p>
          </div>
          
          <div className="flex space-x-8 pb-8 overflow-x-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="min-w-[320px] max-w-[320px] card-3d flex flex-col">
                <CardContent className="p-6 flex-grow flex flex-col">
                  {/* --- UPDATED: Removed the image and its container --- */}
                  <div className="mb-4">
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-primary">{testimonial.speciality}</p>
                  </div>
                  <blockquote className="text-muted-foreground border-l-4 border-primary/20 pl-4 italic flex-grow">
                    {testimonial.quote}
                  </blockquote>
                  <div className="flex mt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Shield className="w-16 h-16 mx-auto mb-6 text-accent" />
            <h2 className="text-4xl font-bold mb-6">
              Begin Your Healing Journey Today
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands who have transformed their health with authentic Panchakarma therapies. 
              Our certified centers and expert practitioners are ready to guide you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                className="bg-white text-primary hover:bg-white/90 shadow-golden hover-glow"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/book')}
                className="border-white text-white hover:bg-white/10"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Consultation
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-white/80 text-sm text-center">
                Learn more about traditional Ayurveda at{' '}
                <a 
                  href="https://ayush.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-accent transition-colors underline"
                >
                  Ministry of AYUSH
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UN SDG Goals Link Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">UN</span>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-primary">Sustainable Development Goals</h3>
                <p className="text-muted-foreground">Supporting global health and wellness initiatives</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Ayusutra is committed to advancing the United Nations Sustainable Development Goals through 
              accessible healthcare, traditional knowledge preservation, and sustainable wellness practices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="bg-primary hover:bg-primary/90"
              >
                <a 
                  href="https://sdgs.un.org/goals" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Explore UN SDG Goals
                </a>
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/about')}
              >
                Our Impact Story
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                  3
                </div>
                <span>Good Health</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                  8
                </div>
                <span>Economic Growth</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                  10
                </div>
                <span>Reduced Inequalities</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                  12
                </div>
                <span>Responsible Consumption</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

