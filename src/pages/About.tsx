import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Shield, 
  Leaf, 
  Droplets,
  Wind,
  Flame,
  Mountain,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Users,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ministryLogo from '@/assets/ministry-ayush-logo.png';

const About = () => {
  const navigate = useNavigate();

  const therapyDetails = [
    {
      name: 'Vamana',
      element: 'Kapha',
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'This treatment involves internal and external oleation and fomentation therapies for a few days, followed by emetic medicines and decoction to induce vomiting. It helps dispose of toxins from body tissues and is particularly recommended for kapha-dominated conditions such as weight gain, asthma, and hyperacidity.',
      process: 'Internal/external oleation → Fomentation → Emetic medicines → Therapeutic vomiting',
      conditions: ['Weight gain', 'Asthma', 'Hyperacidity', 'Respiratory disorders']
    },
    {
      name: 'Virechana',
      element: 'Pitta',
      icon: Flame,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'This therapy involves purgation or disposal of toxins through bowel clearance. It includes internal and external oleation and fomentation, followed by a herbal purgative to purify the body. It is prescribed for pitta-dominated conditions like herpes zoster, jaundice, colitis, and celiac disease.',
      process: 'Oleation → Fomentation → Herbal purgatives → Controlled elimination',
      conditions: ['Herpes zoster', 'Jaundice', 'Colitis', 'Celiac disease']
    },
    {
      name: 'Basti',
      element: 'Vata',
      icon: Wind,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'This treatment administers medicated substances, such as herbal decoctions, oils, ghee, or milk, through enema into the rectum. It is highly effective against vata-dominated conditions like arthritis, piles, and constipation, offering significant benefits for complicated and chronic diseases.',
      process: 'Medicated substances preparation → Specialized enema administration → Systematic treatment',
      conditions: ['Arthritis', 'Piles', 'Constipation', 'Chronic vata disorders']
    },
    {
      name: 'Nasya',
      element: 'Head Region',
      icon: Wind,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'This therapy focuses on clearing and purifying the head area. It begins with a gentle massage and fomentation of the head and shoulder areas, followed by the administration of nasal drops in both nostrils. It is effective for conditions like headaches, migraines, hair problems, sleep disorders, neurological disorders, sinusitis, chronic rhinitis, and respiratory ailments.',
      process: 'Head/shoulder massage → Fomentation → Nasal medication administration',
      conditions: ['Headaches', 'Migraines', 'Sleep disorders', 'Sinusitis', 'Neurological disorders']
    },
    {
      name: 'Raktamokshan',
      element: 'Blood',
      icon: Droplets,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'This treatment is used for cleaning the blood and is effective against ailments caused by impure blood. It can be applied to a specific area or the whole body and is particularly useful for skin infections like psoriasis and dermatitis, as well as local lesions such as abscesses and pigmentation.',
      process: 'Blood analysis → Targeted/systemic purification → Specialized cleansing techniques',
      conditions: ['Skin infections', 'Psoriasis', 'Dermatitis', 'Blood disorders']
    }
  ];

  const benefits = [
    'Completely purifying the body',
    'Riddance of toxins',
    'Speeding up metabolism',
    'Reducing weight',
    'Enhancing the strength of digestive fire',
    'Opening up blocked channels',
    'Relaxing the mind and body',
    'Rejuvenation of tissues',
    'Boosting immunity',
    'Relieving stress'
  ];

  const precautionsList = [
    'Avoid during fever and acute infections',
    'Not recommended during injuries or wounds',
    'Contraindicated during pregnancy',
    'Requires supervision by qualified Ayurvedic physician',
    'Individual health assessment mandatory',
    'Age and constitution considerations essential'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <img 
                src={ministryLogo} 
                alt="Ministry of AYUSH" 
                className="w-16 h-16 object-contain bg-white rounded-full p-2 shadow-medium"
              />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Ministry of AYUSH Recognized
              </Badge>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Understanding <span className="text-gradient-accent">Panchakarma</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Panchakarma, a prominent branch of Ayurveda, literally means 'Five Actions.' 
              It is a healing technique that relies on five distinct basic actions to control the body, 
              embodying the core values of Ayurveda.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="card-3d">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Leaf className="w-8 h-8 text-primary" />
                  The Science of Five Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-lg leading-relaxed space-y-4">
                <p>
                  Panchakarma is considered a pillar of Ayurvedic practices and works best with medicated oils 
                  to eliminate impurities from the body. The five distinct actions - Vomiting, Purgation, 
                  Niruham, Anuvaasan, and Nasyam - work systematically to restore balance and health.
                </p>
                <p>
                  This ancient healing system reverses the degenerative process caused by stress, 
                  environmental pollutants, and poor lifestyle choices, releasing stored toxins through 
                  a combination of massage, herbal saunas, special foods, nutritional directives, 
                  mild fasting, and colon treatments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Five Therapies */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-primary mb-6">The Five Sacred Therapies</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each therapy targets specific doshas and conditions, providing comprehensive healing through ancient wisdom
            </p>
          </div>

          <div className="space-y-12">
            {therapyDetails.map((therapy, index) => (
              <Card key={index} className="card-3d animate-fade-in overflow-hidden">
                <div className="grid lg:grid-cols-3 gap-0">
                  <div className={`${therapy.bgColor} p-8 flex flex-col items-center justify-center text-center`}>
                    <div className={`w-20 h-20 ${therapy.bgColor} rounded-full flex items-center justify-center mb-4 shadow-medium`}>
                      <therapy.icon className={`w-10 h-10 ${therapy.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{therapy.name}</h3>
                    <Badge variant="outline" className="mb-4">
                      {therapy.element}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Therapy #{index + 1}
                    </p>
                  </div>
                  
                  <div className="lg:col-span-2 p-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Description</h4>
                        <p className="text-muted-foreground leading-relaxed">{therapy.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Treatment Process</h4>
                        <p className="text-sm text-muted-foreground font-mono bg-muted/50 p-3 rounded-lg">
                          {therapy.process}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Effective Conditions</h4>
                        <div className="flex flex-wrap gap-2">
                          {therapy.conditions.map((condition, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-primary mb-6">Transformative Benefits</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Panchakarma offers comprehensive healing that addresses root causes and promotes lasting wellness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="card-3d hover-lift text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
                  <p className="text-sm font-medium leading-tight">{benefit}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="card-3d max-w-4xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Holistic Restoration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Panchakarma restores the body's natural healing ability by ensuring proper digestion of food, 
                  experiences, and emotions, preventing the accumulation of toxins (ama) that can lead to disease. 
                  This comprehensive approach addresses not just symptoms but the underlying imbalances that cause illness.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Precautions Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="card-3d border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3 text-amber-700">
                  <AlertTriangle className="w-8 h-8" />
                  Important Precautions
                </CardTitle>
                <CardDescription className="text-amber-600">
                  Essential safety guidelines for Panchakarma therapies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-600" />
                      Contraindications
                    </h4>
                    <ul className="space-y-2">
                      {precautionsList.map((precaution, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>{precaution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-600" />
                      Professional Guidance
                    </h4>
                    <div className="space-y-3">
                      <p className="text-sm text-amber-700 leading-relaxed">
                        It is essential to consult a trained and qualified Ayurvedic physician before 
                        undergoing therapy to ensure it is designed according to an individual's health status.
                      </p>
                      <p className="text-sm text-amber-700 leading-relaxed">
                        The therapy begins with a thorough examination by an Ayurvedic physician to prescribe 
                        a personalized program, which may include a special Ayurvedic diet routine and specific 
                        medicinal plants and essential oils for home use.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Government Recognition */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-6 mb-8">
              <img 
                src={ministryLogo} 
                alt="Ministry of AYUSH" 
                className="w-20 h-20 object-contain bg-white rounded-full p-3 shadow-golden"
              />
              <div className="text-left">
                <h3 className="text-2xl font-bold">Government Recognition</h3>
                <p className="text-white/80">Ministry of AYUSH, Government of India</p>
              </div>
            </div>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Our platform follows the guidelines and standards set by the Ministry of AYUSH, 
              ensuring authentic Ayurvedic practices and qualified practitioners for your safety and wellness.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/book')}
                className="bg-white text-primary hover:bg-white/90 shadow-golden hover-glow"
              >
                Start Your Healing Journey
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => window.open('https://ayush.gov.in/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Ministry of AYUSH
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gradient-primary mb-6">
              Ready to Experience Panchakarma?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Take the first step towards holistic healing with our certified Ayurvedic practitioners 
              and authentic Panchakarma therapies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/locate')}
                className="bg-gradient-primary hover-glow shadow-medium"
              >
                Find Centers Near You
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/book')}
              >
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;