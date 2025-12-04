import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Phone, Mail, MapPin, ExternalLink, Calendar } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-medium">
                <Leaf className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gradient-primary">Ayusutra</h3>
                <p className="text-sm text-muted-foreground">Panchakarma Wellness Platform</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Integrating traditional Ayurvedic Panchakarma therapies with modern technology 
              for comprehensive detoxification, rejuvenation, and chronic disease management.
            </p>
            
            {/* Quick Booking */}
            <div className="p-6 bg-gradient-primary rounded-xl text-white">
              <h4 className="font-bold text-lg mb-3">Book Your Therapy</h4>
              <p className="text-white/90 text-sm mb-4">
                Start your healing journey with personalized Panchakarma treatments
              </p>
              <Link 
                to="/book" 
                className="inline-flex items-center bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors gap-2"
              >
                Book Appointment
                <Calendar className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Panchakarma
                </Link>
              </li>
              <li>
                <Link to="/locate" className="text-muted-foreground hover:text-primary transition-colors">
                  Find Centers
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-muted-foreground hover:text-primary transition-colors">
                  Book Therapy
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+91 800-AYUSH-01</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>help@ayusutra.com</span>
              </li>
              <li className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span className="text-sm">
                  Ayurveda Research Centers<br />
                  Pan India Network
                </span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h5 className="font-medium text-foreground mb-2">Emergency Support</h5>
              <p className="text-sm text-muted-foreground">
                24/7 consultation available for post-therapy concerns
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Ayusutra. All rights reserved. | Traditional Ayurveda, Modern Technology
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Terms of Service
            </Link>
            <a 
              href="https://ayush.gov.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              Government Guidelines
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};