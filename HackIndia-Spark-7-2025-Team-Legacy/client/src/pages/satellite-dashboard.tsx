import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertIcon, CheckIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';

// Simulated satellite data
interface Satellite {
  id: string;
  name: string;
  operator: string;
  altitude: string;
  type: string;
  launchDate: string;
  status: 'active' | 'standby' | 'offline';
  lastImageTimestamp: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  speed: string;
  coverage: string;
}

interface SatelliteImage {
  id: number;
  satelliteId: string;
  timestamp: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  processed: boolean;
  analysisResult?: {
    isDisaster: boolean;
    confidence: number;
    disasterType?: string;
    details: string;
  };
}

// Sample satellite data
const satellites: Satellite[] = [
  {
    id: 'sat-001',
    name: 'EarthGuard-1',
    operator: 'Global Disaster Monitoring Initiative',
    altitude: '705 km',
    type: 'Earth Observation',
    launchDate: '2021-04-18',
    status: 'active',
    lastImageTimestamp: new Date().toISOString(),
    coordinates: { lat: 32.7157, lng: -117.1611 },
    speed: '7.8 km/s',
    coverage: 'Global, 16-day repeat cycle'
  },
  {
    id: 'sat-002',
    name: 'RapidResponse-3',
    operator: 'International Space Agency',
    altitude: '620 km',
    type: 'Earth Observation & Emergency Response',
    launchDate: '2019-11-05',
    status: 'active',
    lastImageTimestamp: new Date().toISOString(),
    coordinates: { lat: 28.5383, lng: -80.5983 },
    speed: '7.6 km/s',
    coverage: 'Global, 14-day repeat cycle'
  },
  {
    id: 'sat-003',
    name: 'DisasterTrack-2',
    operator: 'Planetary Data Systems',
    altitude: '770 km',
    type: 'Thermal & Multispectral Imaging',
    launchDate: '2020-06-30',
    status: 'standby',
    lastImageTimestamp: new Date().toISOString(),
    coordinates: { lat: 9.0820, lng: 8.6753 },
    speed: '7.9 km/s',
    coverage: 'Focused on high-risk regions'
  }
];

// Sample image URLs and corresponding disaster types for simulation
const sampleImageData = [
  { 
    url: 'https://images.unsplash.com/photo-1618412057838-ccf075a26b80?auto=format&fit=crop&w=800&q=80',
    isDisaster: false, 
    location: 'Pacific Ocean, Northern Region',
    details: 'Clear waters with no visible anomalies. Normal ocean currents and temperature patterns.'
  },
  { 
    url: 'https://images.unsplash.com/photo-1593005510509-d05b264f29f7?auto=format&fit=crop&w=800&q=80',
    isDisaster: true, 
    disasterType: 'Wildfire', 
    location: 'Western Forest Region, Sector 7',
    details: 'Active wildfire detected covering approximately 3,400 hectares. Smoke patterns indicate high-intensity burning.'
  },
  { 
    url: 'https://images.unsplash.com/photo-1620059310606-e047439369c9?auto=format&fit=crop&w=800&q=80',
    isDisaster: true, 
    disasterType: 'Flooding', 
    location: 'Coastal Lowlands, Eastern Basin',
    details: 'Severe flooding observed with approximately 60% of the region inundated. Multiple communities affected.'
  },
  { 
    url: 'https://images.unsplash.com/photo-1597571557303-a7f68a315441?auto=format&fit=crop&w=800&q=80',
    isDisaster: false, 
    location: 'Agricultural Plains, Central Zone',
    details: 'Normal cultivation patterns visible. Crop health indicators within expected parameters.'
  },
  { 
    url: 'https://images.unsplash.com/photo-1590055531409-5d576b3f7bd4?auto=format&fit=crop&w=800&q=80',
    isDisaster: true, 
    disasterType: 'Hurricane', 
    location: 'Atlantic Basin, Sector 23',
    details: 'Category 3 hurricane with well-defined eye wall. Wind speeds estimated at 195 km/h based on cloud patterns.'
  }
];

const SatelliteDashboard: React.FC = () => {
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const [satelliteImages, setSatelliteImages] = useState<SatelliteImage[]>([]);
  const [currentImage, setCurrentImage] = useState<SatelliteImage | null>(null);
  const { toast } = useToast();

  // Function to generate a random satellite image
  const generateRandomImage = useCallback(() => {
    if (!selectedSatellite) return null;
    
    const randomSample = sampleImageData[Math.floor(Math.random() * sampleImageData.length)];
    const confidence = 70 + Math.floor(Math.random() * 25); // 70-95% confidence
    
    const newImage: SatelliteImage = {
      id: Date.now(),
      satelliteId: selectedSatellite.id,
      timestamp: new Date().toISOString(),
      location: randomSample.location,
      coordinates: {
        lat: selectedSatellite.coordinates.lat + (Math.random() * 10 - 5),
        lng: selectedSatellite.coordinates.lng + (Math.random() * 10 - 5)
      },
      imageUrl: randomSample.url,
      processed: false,
      analysisResult: undefined
    };
    
    return { newImage, sampleData: randomSample, confidence };
  }, [selectedSatellite]);

  // Process the image (simulate ML analysis)
  const processImage = useCallback((image: SatelliteImage, sampleData: any, confidence: number) => {
    setProcessingImage(true);
    
    // Simulate processing time
    setTimeout(() => {
      const processedImage: SatelliteImage = {
        ...image,
        processed: true,
        analysisResult: {
          isDisaster: sampleData.isDisaster,
          confidence: confidence,
          disasterType: sampleData.disasterType,
          details: sampleData.details
        }
      };
      
      setCurrentImage(processedImage);
      setSatelliteImages(prev => [processedImage, ...prev].slice(0, 10)); // Keep last 10 images
      setProcessingImage(false);
      
      if (sampleData.isDisaster) {
        toast({
          title: `⚠️ ${sampleData.disasterType || 'Disaster'} Detected`,
          description: `${sampleData.location} - Confidence: ${confidence}%`,
          variant: 'destructive',
        });
      }
    }, 3000); // 3 second processing time
  }, [toast]);

  // Effect for live mode
  useEffect(() => {
    if (!isLiveMode || !selectedSatellite) return;
    
    let interval: NodeJS.Timeout;
    
    const runLiveCapture = () => {
      const imageData = generateRandomImage();
      if (imageData) {
        setCurrentImage({...imageData.newImage, processed: false});
        processImage(imageData.newImage, imageData.sampleData, imageData.confidence);
      }
    };
    
    // Initial run
    runLiveCapture();
    
    // Set interval for subsequent runs
    interval = setInterval(runLiveCapture, 8000); // 8 seconds
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLiveMode, selectedSatellite, generateRandomImage, processImage]);

  // Handler for manually capturing an image
  const handleCaptureImage = useCallback(() => {
    if (!selectedSatellite) {
      toast({
        title: 'No satellite selected',
        description: 'Please select a satellite first',
        variant: 'destructive',
      });
      return;
    }
    
    const imageData = generateRandomImage();
    if (imageData) {
      setCurrentImage({...imageData.newImage, processed: false});
      processImage(imageData.newImage, imageData.sampleData, imageData.confidence);
    }
  }, [selectedSatellite, generateRandomImage, processImage, toast]);

  // Handler for toggling live mode
  const toggleLiveMode = useCallback(() => {
    if (!selectedSatellite) {
      toast({
        title: 'No satellite selected',
        description: 'Please select a satellite first',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLiveMode(prev => !prev);
  }, [selectedSatellite, toast]);

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
            <a href="/ground-news" className="text-white/80 hover:text-white font-medium transition-colors">Ground News</a>
            <a href="/social-media" className="text-white/80 hover:text-white font-medium transition-colors">Social Media</a>
            <span className="text-white font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full">Satellite Dashboard</span>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Satellite Selection Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Satellite Control Center</CardTitle>
                <CardDescription>Select a satellite to begin monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {satellites.map(satellite => (
                  <div 
                    key={satellite.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedSatellite?.id === satellite.id 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-neutral-200 hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setSelectedSatellite(satellite);
                      setIsLiveMode(false);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{satellite.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        satellite.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : satellite.status === 'standby'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {satellite.status.charAt(0).toUpperCase() + satellite.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">{satellite.operator}</p>
                    <div className="flex justify-between mt-2 text-xs text-neutral-500">
                      <span>Altitude: {satellite.altitude}</span>
                      <span>Type: {satellite.type.split(' ')[0]}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  className="w-full"
                  disabled={!selectedSatellite || processingImage}
                  onClick={handleCaptureImage}
                >
                  Capture Image
                </Button>
                <Button 
                  variant={isLiveMode ? "destructive" : "outline"} 
                  className="w-full"
                  disabled={!selectedSatellite}
                  onClick={toggleLiveMode}
                >
                  {isLiveMode ? "Stop Live Monitoring" : "Start Live Monitoring"}
                </Button>
              </CardFooter>
            </Card>

            {selectedSatellite && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Satellite Telemetry</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-neutral-500">Launch Date</p>
                      <p className="text-sm font-medium">{formatDate(selectedSatellite.launchDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Current Speed</p>
                      <p className="text-sm font-medium">{selectedSatellite.speed}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-neutral-500">Coverage</p>
                      <p className="text-sm font-medium">{selectedSatellite.coverage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Current Coordinates</p>
                      <p className="text-sm font-medium">
                        {selectedSatellite.coordinates.lat.toFixed(2)}, {selectedSatellite.coordinates.lng.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="bg-black rounded-lg p-3 font-mono text-xs text-green-400 h-24 overflow-auto">
                      <p>&gt; Satellite {selectedSatellite.name} connected</p>
                      <p>&gt; Signal strength: Excellent</p>
                      <p>&gt; Data downlink active: 85 Mbps</p>
                      <p>&gt; Sensors calibrated and operating normally</p>
                      {isLiveMode && <p>&gt; LIVE MODE ACTIVE - continuous monitoring</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Display Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Image Preview */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-neutral-900 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle>Satellite Feed</CardTitle>
                  {isLiveMode && (
                    <div className="flex items-center">
                      <span className="relative flex h-3 w-3 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span className="text-sm font-medium">LIVE</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <div className="aspect-video bg-neutral-800 relative overflow-hidden">
                {currentImage ? (
                  <>
                    <img 
                      src={currentImage.imageUrl} 
                      alt="Satellite imagery" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{currentImage.location}</p>
                          <p className="text-sm opacity-75">
                            Captured: {formatDate(currentImage.timestamp)}
                          </p>
                        </div>
                        {processingImage ? (
                          <div className="flex items-center bg-neutral-800/80 px-3 py-1 rounded-full">
                            <div className="animate-pulse h-3 w-3 bg-amber-500 rounded-full mr-2"></div>
                            <span className="text-xs">Processing...</span>
                          </div>
                        ) : currentImage.processed && (
                          <div className={`flex items-center ${
                            currentImage.analysisResult?.isDisaster 
                              ? 'bg-red-600/80' 
                              : 'bg-green-600/80'
                          } px-3 py-1 rounded-full`}>
                            {currentImage.analysisResult?.isDisaster ? (
                              <>
                                <AlertIcon className="h-3 w-3 mr-1" />
                                <span className="text-xs font-medium">
                                  {currentImage.analysisResult.disasterType || 'Disaster'} Detected
                                </span>
                              </>
                            ) : (
                              <>
                                <CheckIcon className="h-3 w-3 mr-1" />
                                <span className="text-xs font-medium">No Threats Detected</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-white">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="48" 
                      height="48" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="mb-4 text-neutral-400"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polygon points="11 8 15 12 11 16 11 8"></polygon>
                    </svg>
                    <p className="text-neutral-400">Select a satellite and capture an image</p>
                  </div>
                )}
              </div>
              {currentImage && currentImage.processed && currentImage.analysisResult && (
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Analysis Results</h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        {currentImage.analysisResult.details}
                      </p>
                    </div>
                    <div 
                      className={`text-sm font-medium px-2 py-1 rounded-full ${
                        currentImage.analysisResult.confidence > 85
                          ? 'bg-green-100 text-green-800'
                          : currentImage.analysisResult.confidence > 75
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Confidence: {currentImage.analysisResult.confidence}%
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Recent Analyses */}
            {satelliteImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Analyses</CardTitle>
                  <CardDescription>History of recent satellite image analyses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {satelliteImages.slice(0, 5).map((image) => (
                      <div key={image.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-100 transition-colors">
                        <div className="w-24 h-16 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={image.imageUrl} 
                            alt={`Satellite capture of ${image.location}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="font-medium truncate">{image.location}</h3>
                            <span className="text-xs text-neutral-500">{new Date(image.timestamp).toLocaleTimeString()}</span>
                          </div>
                          {image.processed && image.analysisResult && (
                            <div className="mt-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                image.analysisResult.isDisaster 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {image.analysisResult.isDisaster 
                                  ? image.analysisResult.disasterType || 'Disaster Detected' 
                                  : 'No Threats'
                                }
                              </span>
                              <p className="text-xs text-neutral-600 mt-1 line-clamp-1">
                                {image.analysisResult.details}
                              </p>
                            </div>
                          )}
                        </div>
                        {image.analysisResult?.isDisaster && (
                          <div className="flex-shrink-0">
                            <button className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 rounded transition-colors">
                              Alert
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
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
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors">Twitter</a>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors">Facebook</a>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors">Instagram</a>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors">LinkedIn</a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-neutral-400 hover:text-primary transition-colors">Home</a></li>
                <li><a href="/ground-news" className="text-neutral-400 hover:text-primary transition-colors">Ground News</a></li>
                <li><a href="/social-media" className="text-neutral-400 hover:text-primary transition-colors">Social Media</a></li>
                <li><a href="/satellite-dashboard" className="text-neutral-400 hover:text-primary transition-colors">Satellite Dashboard</a></li>
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

export default SatelliteDashboard;