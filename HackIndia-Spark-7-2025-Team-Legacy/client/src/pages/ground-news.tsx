import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ShieldIcon } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { safetyResources, blogPosts } from '@/lib/utils';

interface DisasterRegion {
  name: string;
  country: string;
  description: string;
  riskLevel: 'high' | 'medium' | 'low';
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface DisasterTypeInfo {
  type: string;
  description: string;
  regions: DisasterRegion[];
  physicalConditions: string[];
  warningSign: string;
  mapImageUrl: string;
}

const disasterTypes: DisasterTypeInfo[] = [
  {
    type: 'Earthquake',
    description: 'Earthquakes occur when there is a sudden release of energy in the Earth\'s crust, creating seismic waves that can cause significant damage.',
    regions: [
      {
        name: 'San Andreas Fault Zone',
        country: 'United States',
        description: 'One of the most studied fault lines in the world, running through California.',
        riskLevel: 'high',
        coordinates: { lat: 37.7749, lng: -122.4194 }
      },
      {
        name: 'Pacific Ring of Fire',
        country: 'Multiple Countries',
        description: 'Circum-Pacific belt responsible for 90% of world\'s earthquakes.',
        riskLevel: 'high',
        coordinates: { lat: 35.6762, lng: 139.6503 }
      },
      {
        name: 'North Anatolian Fault',
        country: 'Turkey',
        description: 'Major strike-slip fault in northern Turkey that has produced several destructive earthquakes.',
        riskLevel: 'high',
        coordinates: { lat: 41.0082, lng: 28.9784 }
      }
    ],
    physicalConditions: [
      'Located near tectonic plate boundaries',
      'Areas with historical seismic activity',
      'Regions with significant fault lines',
      'Solid bedrock amplifies shaking intensity'
    ],
    warningSign: 'There are typically no reliable short-term warning signs for earthquakes, though animals may show unusual behavior before an event.',
    mapImageUrl: 'https://earthquake.usgs.gov/earthquakes/map/images/plate-boundaries.svg'
  },
  {
    type: 'Landslide',
    description: 'Landslides involve the movement of rock, earth, or debris down a sloped section of land, often triggered by rainfall, earthquakes, or human activities.',
    regions: [
      {
        name: 'Himalayan Region',
        country: 'Multiple Countries',
        description: 'Young mountain ranges with unstable slopes and heavy monsoon rains.',
        riskLevel: 'high',
        coordinates: { lat: 27.9881, lng: 86.9250 }
      },
      {
        name: 'Pacific Northwest',
        country: 'United States',
        description: 'Combination of steep terrain, heavy rainfall, and soil conditions.',
        riskLevel: 'medium',
        coordinates: { lat: 47.6062, lng: -122.3321 }
      },
      {
        name: 'Andes Mountains',
        country: 'Multiple Countries',
        description: 'Steep slopes, seismic activity, and heavy seasonal rainfall.',
        riskLevel: 'medium',
        coordinates: { lat: -33.4489, lng: -70.6693 }
      }
    ],
    physicalConditions: [
      'Steep slopes and unstable terrain',
      'Areas with heavy rainfall or snowmelt',
      'Regions with loose soil or rock',
      'Previously deforested or altered landscapes'
    ],
    warningSign: 'Changes in landscape, newly appearing cracks in soil or foundations, tilting trees, and unusual sounds from the ground.',
    mapImageUrl: 'https://www.preventionweb.net/files/14374_14374LandslideHazardv1.jpg'
  },
  {
    type: 'Tsunami',
    description: 'Tsunamis are series of ocean waves caused by underwater seismic activity or other disturbances that displace large volumes of water.',
    regions: [
      {
        name: 'Pacific Ocean Coastlines',
        country: 'Multiple Countries',
        description: 'Most tsunami-prone area due to seismic activity around the Ring of Fire.',
        riskLevel: 'high',
        coordinates: { lat: 21.3099, lng: -157.8581 }
      },
      {
        name: 'Indian Ocean Coastlines',
        country: 'Multiple Countries',
        description: 'Site of the devastating 2004 tsunami that killed over 230,000 people.',
        riskLevel: 'high',
        coordinates: { lat: -6.2088, lng: 106.8456 }
      },
      {
        name: 'Mediterranean Sea Coastlines',
        country: 'Multiple Countries',
        description: 'Less frequent but historically significant tsunami events.',
        riskLevel: 'medium',
        coordinates: { lat: 37.9838, lng: 23.7275 }
      }
    ],
    physicalConditions: [
      'Coastal regions near tectonic plate boundaries',
      'Areas prone to submarine landslides',
      'Regions with underwater volcanic activity',
      'Coastal zones with specific basin configurations'
    ],
    warningSign: 'Rapid unusual withdrawal of water from the shore, exposing seabed. Strong earthquake in coastal areas may also be a precursor.',
    mapImageUrl: 'https://www.preventionweb.net/files/14383_14383TsunamiHazardv1.jpg'
  },
  {
    type: 'Volcanic Activity',
    description: 'Volcanic eruptions occur when magma from beneath the Earth\'s crust rises to the surface, releasing gases, ash, and lava.',
    regions: [
      {
        name: 'Pacific Ring of Fire',
        country: 'Multiple Countries',
        description: 'Contains 75% of the world\'s active volcanoes.',
        riskLevel: 'high',
        coordinates: { lat: -8.4095, lng: 115.1889 }
      },
      {
        name: 'East African Rift System',
        country: 'Multiple Countries',
        description: 'Continental rift zone with active volcanic mountains.',
        riskLevel: 'medium',
        coordinates: { lat: -3.0674, lng: 37.3556 }
      },
      {
        name: 'Mediterranean Region',
        country: 'Multiple Countries',
        description: 'Includes historically significant volcanoes like Vesuvius and Etna.',
        riskLevel: 'medium',
        coordinates: { lat: 40.8518, lng: 14.2681 }
      }
    ],
    physicalConditions: [
      'Located along tectonic plate boundaries',
      'Areas with thin crust and magma hotspots',
      'Regions with historical volcanic activity',
      'Characteristic conical mountains or calderas'
    ],
    warningSign: 'Increased seismic activity, ground deformation, changes in gas emissions, and unusual heating of surrounding water bodies.',
    mapImageUrl: 'https://www.preventionweb.net/files/14384_14384VolcanoHazardv1.jpg'
  },
  {
    type: 'Floods',
    description: 'Floods occur when water overflows onto land that is normally dry, often caused by heavy rainfall, storm surges, or dam failures.',
    regions: [
      {
        name: 'Ganges-Brahmaputra Delta',
        country: 'Bangladesh/India',
        description: 'Low-lying delta region affected by monsoons and cyclones.',
        riskLevel: 'high',
        coordinates: { lat: 23.8103, lng: 90.4125 }
      },
      {
        name: 'Mississippi River Basin',
        country: 'United States',
        description: 'Large river system with historically significant flooding events.',
        riskLevel: 'medium',
        coordinates: { lat: 29.9511, lng: -90.0715 }
      },
      {
        name: 'Yangtze River Basin',
        country: 'China',
        description: 'Densely populated river basin with seasonal flooding issues.',
        riskLevel: 'high',
        coordinates: { lat: 30.5928, lng: 114.3055 }
      }
    ],
    physicalConditions: [
      'Low-lying areas near water bodies',
      'Regions with poor drainage systems',
      'Highly developed urban areas with impermeable surfaces',
      'Areas with monsoon or heavy seasonal rainfall'
    ],
    warningSign: 'Prolonged or intense rainfall, rapidly rising water levels, and weather forecasts indicating severe precipitation.',
    mapImageUrl: 'https://www.preventionweb.net/files/14372_14372FloodHazardv1.jpg'
  },
  {
    type: 'Wildfire',
    description: 'Wildfires are uncontrolled fires that burn in wildland vegetation, often caused by human activities, lightning, or drought conditions.',
    regions: [
      {
        name: 'Western United States',
        country: 'United States',
        description: 'Dry climate, vegetation types, and increasing temperatures contributing to severe fire seasons.',
        riskLevel: 'high',
        coordinates: { lat: 34.0522, lng: -118.2437 }
      },
      {
        name: 'Mediterranean Basin',
        country: 'Multiple Countries',
        description: 'Hot, dry summers and vegetation adapted to fire regimes.',
        riskLevel: 'high',
        coordinates: { lat: 37.9838, lng: 23.7275 }
      },
      {
        name: 'Australian Outback',
        country: 'Australia',
        description: 'Eucalyptus forests, dry conditions, and increasing temperatures.',
        riskLevel: 'high',
        coordinates: { lat: -33.8688, lng: 151.2093 }
      }
    ],
    physicalConditions: [
      'Areas with prolonged drought conditions',
      'Regions with high temperatures and low humidity',
      'Landscapes with abundant flammable vegetation',
      'Zones with strong prevailing winds'
    ],
    warningSign: 'Extended dry periods, high temperatures, low humidity, and strong winds. Red flag warnings issued by meteorological agencies.',
    mapImageUrl: 'https://www.preventionweb.net/files/14370_14370FireHazardv1.jpg'
  },
  {
    type: 'Cyclone',
    description: 'Cyclones (also called hurricanes or typhoons in different regions) are powerful tropical storms with strong winds and heavy rainfall.',
    regions: [
      {
        name: 'Caribbean and Gulf of Mexico',
        country: 'Multiple Countries',
        description: 'Hurricane-prone region during the Atlantic hurricane season.',
        riskLevel: 'high',
        coordinates: { lat: 25.7617, lng: -80.1918 }
      },
      {
        name: 'Bay of Bengal',
        country: 'Multiple Countries',
        description: 'Densely populated coastal areas affected by cyclones.',
        riskLevel: 'high',
        coordinates: { lat: 22.5726, lng: 88.3639 }
      },
      {
        name: 'Western Pacific',
        country: 'Multiple Countries',
        description: 'Experiences the most typhoons globally each year.',
        riskLevel: 'high',
        coordinates: { lat: 14.5995, lng: 120.9842 }
      }
    ],
    physicalConditions: [
      'Coastal regions in tropical and subtropical latitudes',
      'Areas with warm ocean temperatures (above 26°C)',
      'Regions that experience seasonal cyclone patterns',
      'Low-lying coastal zones vulnerable to storm surge'
    ],
    warningSign: 'Meteorological forecasts are the primary warning system. Physical signs include increasing winds, rapid barometric pressure drops, and high ocean swells.',
    mapImageUrl: 'https://www.preventionweb.net/files/14382_14382StormHazardv1.jpg'
  },
  {
    type: 'Storms',
    description: 'Severe storms include thunderstorms, blizzards, ice storms, and other extreme weather events that can cause significant damage.',
    regions: [
      {
        name: 'Central United States',
        country: 'United States',
        description: '"Tornado Alley" - prone to severe thunderstorms and tornadoes.',
        riskLevel: 'high',
        coordinates: { lat: 35.4676, lng: -97.5164 }
      },
      {
        name: 'Northern Europe',
        country: 'Multiple Countries',
        description: 'Experiences severe winter storms and windstorms.',
        riskLevel: 'medium',
        coordinates: { lat: 51.5074, lng: -0.1278 }
      },
      {
        name: 'East Asian Monsoon Region',
        country: 'Multiple Countries',
        description: 'Seasonal severe storms associated with monsoon systems.',
        riskLevel: 'high',
        coordinates: { lat: 35.6762, lng: 139.6503 }
      }
    ],
    physicalConditions: [
      'Areas with significant temperature gradients',
      'Regions where different air masses converge',
      'Landscapes that create orographic lifting',
      'Coastal zones affected by marine weather systems'
    ],
    warningSign: 'Meteorological forecasts, darkening skies, sudden temperature changes, and increased wind activity.',
    mapImageUrl: 'https://www.preventionweb.net/files/14382_14382StormHazardv1.jpg'
  }
];

const GroundNewsPage: React.FC = () => {
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterTypeInfo | null>(null);

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
            <span className="text-white font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full">Ground News</span>
            <a href="/social-media" className="text-white/80 hover:text-white font-medium transition-colors">Social Media</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8">
                <h2 className="text-3xl font-bold mb-4">Ground-based Disaster Monitoring</h2>
                <p className="text-neutral-700 mb-6">
                  Our comprehensive monitoring system analyzes ground reports, news sources, and historical data to identify disaster-prone regions around the world. Select a disaster type below to see affected areas and physical conditions.
                </p>
              </div>
              <div className="md:w-1/2 bg-neutral-100 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1527482797697-8795b05a13fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="World map with disaster markers" 
                  className="object-cover h-full w-full max-h-80 md:max-h-none"
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Disaster Selection Section */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Select the Disaster Type</CardTitle>
              <CardDescription className="text-center">
                Choose a disaster type to view vulnerable regions and physical conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="w-full max-w-md relative">
                  <select 
                    className="w-full p-4 pl-5 pr-10 appearance-none border border-neutral-200 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-lg font-medium"
                    onChange={(e) => {
                      const selected = disasterTypes.find(d => d.type === e.target.value);
                      setSelectedDisaster(selected || null);
                    }}
                    value={selectedDisaster?.type || ''}
                  >
                    <option value="" disabled>-- Select Disaster Type --</option>
                    {disasterTypes.map(disaster => (
                      <option key={disaster.type} value={disaster.type}>
                        {disaster.type}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-neutral-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Disaster Information Section */}
        {selectedDisaster && (
          <section className="mb-12">
            <Card>
              <CardHeader className={`bg-${selectedDisaster.type === 'Earthquake' || selectedDisaster.type === 'Tsunami' || selectedDisaster.type === 'Cyclone' ? 'red-600' : selectedDisaster.type === 'Floods' || selectedDisaster.type === 'Storms' ? 'blue-600' : selectedDisaster.type === 'Wildfire' ? 'orange-600' : 'amber-600'} text-white`}>
                <CardTitle>{selectedDisaster.type} Prone Regions</CardTitle>
                <CardDescription className="text-white opacity-90">
                  Areas with historical {selectedDisaster.type.toLowerCase()} activity and high risk factors
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">About {selectedDisaster.type}</h3>
                  <p className="text-neutral-700">{selectedDisaster.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Early Warning Signs</h3>
                  <p className="text-neutral-700">{selectedDisaster.warningSign}</p>
                </div>

                <Separator className="my-6" />

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Physical Conditions Contributing to {selectedDisaster.type} Risk</h3>
                  <ul className="list-disc list-inside text-neutral-700 space-y-1">
                    {selectedDisaster.physicalConditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>

                <Separator className="my-6" />

                <h3 className="text-lg font-semibold mb-4">High-Risk Regions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {selectedDisaster.regions.map((region, index) => (
                    <Card key={index} className={`border-l-4 ${region.riskLevel === 'high' ? 'border-red-600' : region.riskLevel === 'medium' ? 'border-amber-600' : 'border-yellow-600'}`}>
                      <CardContent className="p-4">
                        <h4 className="font-semibold">{region.name}</h4>
                        <p className="text-sm text-neutral-500">{region.country}</p>
                        <p className="text-sm mt-2">{region.description}</p>
                        <div className="mt-2 flex items-center">
                          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${region.riskLevel === 'high' ? 'bg-red-600' : region.riskLevel === 'medium' ? 'bg-amber-600' : 'bg-yellow-600'}`}></span>
                          <span className="text-xs capitalize">{region.riskLevel} Risk</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Global {selectedDisaster.type} Risk Map</h3>
                  <div className="bg-neutral-100 rounded-lg overflow-hidden relative" style={{ height: '400px' }}>
                    <img 
                      src={selectedDisaster.mapImageUrl}
                      alt={`Global ${selectedDisaster.type} risk map`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-white/75">
                      <p className="text-center p-4">
                        Map view placeholder - In a real application, this would display an interactive map showing {selectedDisaster.type.toLowerCase()}-prone regions.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-6">
                <Button variant="outline" onClick={() => setSelectedDisaster(null)}>
                  View Different Disaster
                </Button>
                <Button>
                  Download Full Report
                </Button>
              </CardFooter>
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

export default GroundNewsPage;