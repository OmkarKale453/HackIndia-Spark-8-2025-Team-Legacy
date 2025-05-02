import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ShieldIcon, AlertIcon, CheckIcon, SpinnerIcon } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { safetyResources, blogPosts } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SocialMediaAlert {
  id: number;
  message: string;
  username: string;
  timestamp: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  severity: 'high' | 'medium' | 'low';
}

const mockSocialMediaAlerts: SocialMediaAlert[] = [
  {
    id: 1,
    message: "Heavy flooding in downtown area. Roads completely submerged. #FloodAlert",
    username: "@emergency_reporter",
    timestamp: "5 minutes ago",
    location: "Downtown, River District",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    severity: 'high'
  },
  {
    id: 2,
    message: "Trees down on Main St blocking traffic. Power lines affected. #StormDamage",
    username: "@local_news",
    timestamp: "12 minutes ago",
    location: "Main Street, North End",
    coordinates: { lat: 40.7328, lng: -73.9860 },
    severity: 'medium'
  },
  {
    id: 3,
    message: "Starting to see water levels rise near the creek. Situation developing. #FloodWatch",
    username: "@weather_watcher",
    timestamp: "18 minutes ago",
    location: "Riverside Park",
    coordinates: { lat: 40.7028, lng: -74.0160 },
    severity: 'low'
  },
  {
    id: 4,
    message: "Several buildings reporting structural damage after tremors. Taking shelter. #EarthquakeAlert",
    username: "@city_resident",
    timestamp: "7 minutes ago",
    location: "Financial District",
    coordinates: { lat: 40.7228, lng: -73.9960 },
    severity: 'high'
  },
  {
    id: 5,
    message: "Smoke visible from hillside, appears to be spreading. Fire department notified. #FireHazard",
    username: "@hillside_community",
    timestamp: "22 minutes ago",
    location: "West Hills",
    coordinates: { lat: 40.7228, lng: -74.0260 },
    severity: 'medium'
  }
];

const SocialMediaPage: React.FC = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState<SocialMediaAlert[]>([]);
  const { toast } = useToast();

  const startDetecting = useCallback(() => {
    setIsDetecting(true);
    
    // Simulate loading
    setTimeout(() => {
      setAlerts(mockSocialMediaAlerts);
      setShowAlerts(true);
      setIsDetecting(false);
      
      toast({
        title: 'Detection complete',
        description: 'Found 5 potential disaster-related social media posts',
      });
    }, 2000);
  }, [toast]);

  return (
    <div className="font-sans bg-neutral-50 text-neutral-900 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary/90 to-primary text-white shadow-md">
        <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold tracking-tight">DisasterGuard</h1>
          </div>
          <nav className="flex space-x-8">
            <a href="/" className="text-white/80 hover:text-white font-medium transition-colors">Satellite Image</a>
            <a href="/satellite-dashboard" className="text-white/80 hover:text-white font-medium transition-colors">Satellite Dashboard</a>
            <a href="/ground-news" className="text-white/80 hover:text-white font-medium transition-colors">Ground News</a>
            <span className="text-white font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full">Social Media</span>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8">
                <h2 className="text-3xl font-bold mb-4">Social Media Disaster Detection</h2>
                <p className="text-neutral-700 mb-6">
                  Our AI-powered system monitors social media in real-time to detect emerging disasters based on user posts and activity patterns. Early detection can provide critical time for emergency response.
                </p>
                {!showAlerts && (
                  <Button 
                    variant="default" 
                    onClick={startDetecting}
                    disabled={isDetecting}
                  >
                    {isDetecting ? (
                      <>
                        <SpinnerIcon className="mr-2 h-4 w-4" />
                        Scanning social media...
                      </>
                    ) : (
                      <>Start Detecting</>
                    )}
                  </Button>
                )}
              </div>
              <div className="md:w-1/2 bg-neutral-100 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Social media monitoring" 
                  className="object-cover h-full w-full max-h-80 md:max-h-none"
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Alerts Section */}
        {showAlerts && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Detected Disaster Alerts</h2>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className="overflow-hidden border-l-4" style={{borderLeftColor: alert.severity === 'high' ? 'rgb(220, 38, 38)' : alert.severity === 'medium' ? 'rgb(234, 88, 12)' : 'rgb(234, 179, 8)'}}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        alert.severity === 'high' 
                          ? 'bg-red-600' 
                          : alert.severity === 'medium'
                            ? 'bg-orange-500'
                            : 'bg-yellow-500'
                      } text-white`}>
                        <AlertIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <p className="font-medium">{alert.username}</p>
                          <p className="text-sm text-neutral-500">{alert.timestamp}</p>
                        </div>
                        <p className="text-neutral-800 mb-2">{alert.message}</p>
                        <div className="flex items-center text-sm text-neutral-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {alert.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Map Section */}
        {showAlerts && (
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Alert Locations Map</CardTitle>
                <CardDescription>
                  Geographic distribution of detected disaster-related social media posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-neutral-100 rounded-lg w-full h-96 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=13&size=800x600&maptype=roadmap&markers=color:red%7C40.7128,-74.0060%7C40.7328,-73.9860%7C40.7028,-74.0160%7C40.7228,-73.9960%7C40.7228,-74.0260&key=YOUR_API_KEY" 
                      alt="Map showing alert locations" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-white/75">
                      <p className="text-center p-4">
                        Map view placeholder - In a real application, this would display an interactive map with alert locations marked.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Safety Measures Section */}
        <section id="resources" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Safety Measures & Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyResources.map((resource, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      {resource.icon === 'house-damage' && (
                        <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>
                      )}
                      {resource.icon === 'first-aid' && (
                        <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></>
                      )}
                      {resource.icon === 'mobile-alt' && (
                        <><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>
                      )}
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                  <p className="text-neutral-600 mb-4">{resource.description}</p>
                  <a href={resource.link} className="text-primary font-medium hover:underline">{resource.linkText} →</a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Blog Posts Section */}
        <section id="blogs" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Awareness Blog</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.map((post, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">{post.category}</span>
                    <span className="text-sm text-neutral-500">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-neutral-600 mb-4">{post.excerpt}</p>
                  <a href={post.link} className="text-primary font-medium hover:underline">Read more →</a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>About the Disaster Safety Point</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700 mb-4">
                The Disaster Safety Point platform combines advanced technology with practical safety information to help communities prepare for, respond to, and recover from natural disasters.
              </p>
              <p className="text-neutral-700 mb-4">
                Our social media monitoring system uses machine learning algorithms to detect patterns in public posts that may indicate emerging disaster situations, providing earlier warnings than traditional detection methods.
              </p>
              <p className="text-neutral-700">
                This platform is developed as an educational tool to demonstrate how technology can enhance disaster preparedness and response strategies.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">DisasterGuard</h3>
              </div>
              <p className="text-neutral-400 mb-4">
                Advanced AI technology for disaster detection and analysis to help communities prepare and respond effectively.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-neutral-400 hover:text-primary transition-colors">Home</a></li>
                <li><a href="#resources" className="text-neutral-400 hover:text-primary transition-colors">Resources</a></li>
                <li><a href="#blogs" className="text-neutral-400 hover:text-primary transition-colors">Blogs</a></li>
                <li><a href="#about" className="text-neutral-400 hover:text-primary transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <address className="not-italic text-neutral-400">
                <p className="mb-2">Email: <a href="mailto:info@disasterguard.example" className="hover:text-primary transition-colors">info@disasterguard.example</a></p>
                <p>Emergency: <a href="tel:+15551234567" className="hover:text-primary transition-colors">+1 (555) 123-4567</a></p>
              </address>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-800 text-center text-neutral-500">
            <p>&copy; {new Date().getFullYear()} DisasterGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SocialMediaPage;