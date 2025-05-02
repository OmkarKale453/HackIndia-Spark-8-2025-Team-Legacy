import React, { useState, useRef, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ShieldIcon, UploadIcon, AlertIcon, CheckIcon, SpinnerIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { formatDate, safetyResources, blogPosts } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  uploadId: number;
  filename: string;
  isAlert: boolean;
  details: string;
  date: string;
}

const Home: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await apiRequest('POST', '/api/upload', formData);
      return response.json();
    },
    onSuccess: (data) => {
      setUploadId(data.uploadId);
      toast({
        title: 'Upload successful',
        description: 'Your image has been uploaded successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Upload failed',
        description: error.message || 'There was an error uploading your image.',
        variant: 'destructive',
      });
    }
  });

  const analyzeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('POST', `/api/analyze/${id}`);
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast({
        title: 'Analysis complete',
        description: 'Your image has been analyzed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Analysis failed',
        description: error.message || 'There was an error analyzing your image.',
        variant: 'destructive',
      });
    }
  });

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file.',
          variant: 'destructive',
        });
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'File size exceeds 10MB limit.',
          variant: 'destructive',
        });
        return;
      }
      
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      const file = e.dataTransfer.files[0];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file.',
          variant: 'destructive',
        });
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'File size exceeds 10MB limit.',
          variant: 'destructive',
        });
        return;
      }
      
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  }, [toast]);

  const uploadFile = useCallback(() => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  }, [selectedFile, uploadMutation]);

  const analyzeImage = useCallback(() => {
    if (uploadId) {
      analyzeMutation.mutate(uploadId);
    }
  }, [uploadId, analyzeMutation]);

  const resetUpload = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadId(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="font-sans bg-neutral-50 text-neutral-900 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary/90 to-primary text-white shadow-md">
        <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold tracking-tight">DisasterGuard</h1>
          </div>
          <nav className="flex space-x-8">
            <span className="text-white font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full">Satellite Image</span>
            <a href="/satellite-dashboard" className="text-white/80 hover:text-white font-medium transition-colors">Satellite Dashboard</a>
            <a href="/ground-news" className="text-white/80 hover:text-white font-medium transition-colors">Ground News</a>
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
                <h2 className="text-3xl font-bold mb-4">Disaster Early Warning System</h2>
                <p className="text-neutral-700 mb-6">Upload satellite imagery for real-time disaster risk assessment. Our ML-powered analysis provides instant alerts to help communities prepare and respond to potential threats.</p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="default" 
                    onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Analyze Image
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 bg-neutral-100 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1618090584176-7132b9911bd9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="Satellite view of Earth" 
                  className="object-cover h-full w-full max-h-80 md:max-h-none"
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Image Upload Section */}
        <section id="upload-section" className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Upload Satellite Image for Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedFile ? (
                <div 
                  className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center cursor-pointer transition hover:border-primary"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <UploadIcon className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Drag & Drop or Click to Upload</h3>
                  <p className="text-neutral-500 mb-4">Supported formats: JPG, PNG, TIFF (Max: 10MB)</p>
                  <Button variant="info" onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}>
                    <i className="fas fa-folder-open mr-2"></i>
                    Browse Files
                  </Button>
                  <Input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileSelect}
                  />
                </div>
              ) : (
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Selected Image</h3>
                    <Button variant="ghost" onClick={resetUpload}>
                      <i className="fas fa-times"></i> Remove
                    </Button>
                  </div>
                  <div className="relative overflow-hidden rounded-lg" style={{ height: '300px' }}>
                    {previewUrl && (
                      <img 
                        className="absolute inset-0 w-full h-full object-contain"
                        src={previewUrl} 
                        alt="Preview of uploaded satellite image"
                      />
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-neutral-700 mb-2">{selectedFile.name}</p>
                    {!uploadId ? (
                      <Button 
                        onClick={uploadFile} 
                        disabled={uploadMutation.isPending}
                      >
                        {uploadMutation.isPending ? (
                          <>
                            <SpinnerIcon className="mr-2 h-4 w-4" />
                            Uploading...
                          </>
                        ) : (
                          <>Upload Image</>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        onClick={analyzeImage} 
                        disabled={analyzeMutation.isPending}
                      >
                        {analyzeMutation.isPending ? (
                          <>
                            <SpinnerIcon className="mr-2 h-4 w-4" />
                            Analyzing...
                          </>
                        ) : (
                          <>Analyze Image</>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Analysis Result Section */}
        {analysisResult && (
          <section className="mb-12">
            <Card className="overflow-hidden">
              <div className={`bg-${analysisResult.isAlert ? 'red-600' : 'green-600'} text-white p-4`}>
                <h3 className="text-xl font-bold text-center">Analysis Result</h3>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="bg-neutral-100 rounded-lg overflow-hidden">
                      {previewUrl && (
                        <img src={previewUrl} alt="Analyzed image" className="w-full h-auto" />
                      )}
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${analysisResult.isAlert ? 'bg-red-600' : 'bg-green-600'} text-white mr-3`}>
                        {analysisResult.isAlert ? (
                          <AlertIcon className="h-6 w-6" />
                        ) : (
                          <CheckIcon className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <h3 className={`text-2xl font-bold ${analysisResult.isAlert ? 'text-red-600' : 'text-green-600'}`}>
                          {analysisResult.isAlert ? 'ALERT: Potential Disaster Detected' : 'SAFE: No Disaster Risk Detected'}
                        </h3>
                        <p className="text-neutral-500">Analyzed on {formatDate(analysisResult.date)}</p>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium mb-2">Analysis Details:</h4>
                      <p className="text-neutral-700">
                        {analysisResult.details}
                      </p>
                    </div>
                    
                    <div className={`bg-${analysisResult.isAlert ? 'red-50' : 'green-50'} rounded-lg p-4 border-l-4 ${analysisResult.isAlert ? 'border-red-600' : 'border-green-600'}`}>
                      <h4 className="font-medium mb-2">{analysisResult.isAlert ? 'Recommended Actions:' : 'Preventive Measures:'}</h4>
                      <ul className="list-disc list-inside space-y-1 text-neutral-700">
                        {analysisResult.isAlert ? (
                          <>
                            <li>Evacuate low-lying areas immediately</li>
                            <li>Move valuable items to higher ground</li>
                            <li>Follow local authority instructions</li>
                            <li>Prepare emergency supplies</li>
                          </>
                        ) : (
                          <>
                            <li>Continue monitoring for changes</li>
                            <li>Maintain emergency preparedness</li>
                            <li>Review evacuation plans regularly</li>
                            <li>Stay informed about weather patterns</li>
                          </>
                        )}
                      </ul>
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <Button variant="outline" onClick={resetUpload}>
                        <i className="fas fa-redo-alt mr-2"></i> New Analysis
                      </Button>
                      <Button variant="info">
                        <i className="fas fa-download mr-2"></i> Download Report
                      </Button>
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
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                    <i className={`fas fa-${resource.icon} text-white text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                  <p className="text-neutral-700 mb-4">{resource.description}</p>
                  <a href={resource.link} className="text-blue-600 hover:underline font-medium inline-flex items-center">
                    {resource.linkText} <i className="fas fa-arrow-right ml-2"></i>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Blogs Section */}
        <section id="blogs" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Educational Blogs & Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.map((post, index) => (
              <Card key={index} className="overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-neutral-100">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">{post.category}</span>
                  <h3 className="text-xl font-semibold mt-1 mb-2">{post.title}</h3>
                  <p className="text-neutral-700 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 text-xs">{post.date}</span>
                    <a href={post.link} className="text-blue-600 hover:underline text-sm font-medium">Read more</a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline">
              View All Articles
            </Button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-md p-8 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Community of Disaster Prevention</h2>
              <p className="mb-6">Get updates on the latest disaster prevention technology, research, and community initiatives.</p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-white/20 border border-white/30 text-white placeholder-white/60 focus:ring-white"
                />
                <Button className="bg-white text-blue-600 hover:bg-neutral-100">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">DisasterGuard</h3>
              </div>
              <p className="text-neutral-400 mb-4">Using technology to predict, prevent, and respond to natural disasters worldwide.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white">Safety Guides</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Emergency Preparation</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Disaster Types</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Early Warning Systems</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">About Us</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white">Our Mission</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Technology</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Partners</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <address className="not-italic text-neutral-400">
                <p className="mb-2">123 Prevention Ave</p>
                <p className="mb-2">Safety City, SC 10101</p>
                <p className="mb-2">
                  <a href="mailto:info@disastersafetypoint.com" className="hover:text-white">info@disastersafetypoint.com</a>
                </p>
                <p>
                  <a href="tel:+11234567890" className="hover:text-white">+1 (123) 456-7890</a>
                </p>
              </address>
            </div>
          </div>

          <Separator className="bg-neutral-800" />

          <div className="pt-6 text-center text-neutral-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Disaster Safety Point. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
