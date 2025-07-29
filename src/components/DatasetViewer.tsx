import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Database, 
  FileText, 
  BarChart3, 
  Users, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface Dataset {
  id: string;
  name: string;
  description: string;
  cancer_type: string;
  source: string;
  samples: number;
  features: number;
  file_size: number;
  download_url: string;
  status: 'success' | 'fallback';
  last_updated: string;
}

interface DatasetCatalog {
  last_updated: string;
  total_datasets: number;
  datasets: Dataset[];
}

export function DatasetViewer() {
  const [catalog, setCatalog] = useState<DatasetCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDatasetCatalog();
  }, []);

  const loadDatasetCatalog = async () => {
    try {
      setLoading(true);
      const mockCatalog: DatasetCatalog = {
        last_updated: new Date().toISOString(),
        total_datasets: 10,
        datasets: [
          {
            id: 'breast_cancer_wisconsin',
            name: 'Breast Cancer Wisconsin',
            description: 'Wisconsin Breast Cancer Database - Original dataset from UCI ML Repository',
            cancer_type: 'Breast Cancer',
            source: 'UCI ML Repository',
            samples: 699,
            features: 11,
            file_size: 25600,
            download_url: '/datasets/breast_cancer_wisconsin.csv',
            status: 'success',
            last_updated: '2024-01-15T10:30:00Z'
          },
          {
            id: 'lung_cancer_survey',
            name: 'Lung Cancer Survey',
            description: 'Lung Cancer Survey Dataset with lifestyle and demographic factors',
            cancer_type: 'Lung Cancer',
            source: 'Kaggle/GitHub',
            samples: 309,
            features: 16,
            file_size: 18400,
            download_url: '/datasets/lung_cancer_survey.csv',
            status: 'fallback',
            last_updated: '2024-01-15T10:30:00Z'
          },
          {
            id: 'comprehensive_multi_cancer',
            name: 'Comprehensive Multi-Cancer Dataset',
            description: 'Comprehensive synthetic dataset covering multiple cancer types with realistic risk factors',
            cancer_type: 'Multiple Cancer Types',
            source: 'Generated Synthetic',
            samples: 15000,
            features: 35,
            file_size: 2048000,
            download_url: '/datasets/comprehensive_multi_cancer_dataset.csv',
            status: 'success',
            last_updated: '2024-01-15T10:30:00Z'
          },
          {
            id: 'cervical_cancer_risk',
            name: 'Cervical Cancer Risk Factors',
            description: 'Cervical Cancer Risk Factors Dataset with comprehensive medical history',
            cancer_type: 'Cervical Cancer',
            source: 'UCI ML Repository',
            samples: 858,
            features: 36,
            file_size: 156800,
            download_url: '/datasets/cervical_cancer_risk.csv',
            status: 'success',
            last_updated: '2024-01-15T10:30:00Z'
          },
          {
            id: 'skin_cancer_mnist',
            name: 'Skin Cancer MNIST',
            description: 'Skin Cancer MNIST: HAM10000 Dataset metadata with dermatoscopic features',
            cancer_type: 'Skin Cancer',
            source: 'Harvard Dataverse',
            samples: 10015,
            features: 7,
            file_size: 512000,
            download_url: '/datasets/skin_cancer_mnist.csv',
            status: 'fallback',
            last_updated: '2024-01-15T10:30:00Z'
          },
          {
            id: 'prostate_cancer_dataset',
            name: 'Prostate Cancer Dataset',
            description: 'Prostate Cancer Dataset with PSA levels and clinical indicators',
            cancer_type: 'Prostate Cancer',
            source: 'Medical Research',
            samples: 1200,
            features: 14,
            file_size: 89600,
            download_url: '/datasets/prostate_cancer_dataset.csv',
            status: 'success',
            last_updated: '2024-01-15T10:30:00Z'
          },
          {
            id: 'colon_cancer_dataset',
            name: 'Colon Cancer Dataset',
            description: 'Colon Cancer Dataset with genetic markers and clinical features',
            cancer_type: 'Colon Cancer',
            source: 'Cancer Research Institute',
            samples: 2000,
            features: 22,
            file_size: 256000,
            download_url: '/datasets/colon_cancer_dataset.csv',
            status: 'success',
            last_updated: '2024-01-15T10:30:00Z'
          },
          {
            id: 'ovarian_cancer_dataset',
            name: 'Ovarian Cancer Dataset',
            description: 'Ovarian Cancer Dataset with biomarkers and patient history',
            cancer_type: 'Ovarian Cancer',
            source: 'Women\'s Health Research',
            samples: 750,
            features: 18,
            file_size: 67200,
            download_url: '/datasets/ovarian_cancer_dataset.csv',
            status: 'success',
            last_updated: '2024-01-15T10:30:00Z'
          },
          {
            id: 'liver_cancer_dataset',
            name: 'Liver Cancer Dataset',
            description: 'Liver Cancer Dataset with liver function tests and risk factors',
            cancer_type: 'Liver Cancer',
            source: 'Hepatology Research',
            samples: 583,
            features: 12,
            file_size: 41856,
            download_url: '/datasets/liver_cancer_dataset.csv',
            status: 'success',
            last_updated: '2024-01-15T10:30:00Z'
          },
          {
            id: 'pancreatic_cancer_dataset',
            name: 'Pancreatic Cancer Dataset',
            description: 'Pancreatic Cancer Dataset with biomarkers and imaging features',
            cancer_type: 'Pancreatic Cancer',
            source: 'Pancreatic Research Foundation',
            samples: 643,
            features: 25,
            file_size: 96450,
            download_url: '/datasets/pancreatic_cancer_dataset.csv',
            status: 'fallback',
            last_updated: '2024-01-15T10:30:00Z'
          }
        ]
      };
      
      setCatalog(mockCatalog);
    } catch (err) {
      setError('Failed to load dataset catalog');
      console.error('Error loading catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (dataset: Dataset) => {
    setDownloadingIds(prev => new Set(prev).add(dataset.id));
    
    try {
      const link = document.createElement('a');
      link.href = dataset.download_url;
      link.download = `${dataset.id}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(dataset.id);
        return newSet;
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fallback':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Real Data</Badge>;
      case 'fallback':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Synthetic</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const groupDatasetsByCancerType = (datasets: Dataset[]) => {
    const grouped: { [key: string]: Dataset[] } = {};
    datasets.forEach(dataset => {
      const type = dataset.cancer_type;
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(dataset);
    });
    return grouped;
  };

  const calculateStats = (datasets: Dataset[]) => {
    const totalSamples = datasets.reduce((sum, d) => sum + d.samples, 0);
    const totalSize = datasets.reduce((sum, d) => sum + d.file_size, 0);
    const realDatasets = datasets.filter(d => d.status === 'success').length;
    const syntheticDatasets = datasets.filter(d => d.status === 'fallback').length;
    
    return {
      totalSamples,
      totalSize,
      realDatasets,
      syntheticDatasets,
      cancerTypes: new Set(datasets.map(d => d.cancer_type)).size
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dataset catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!catalog) {
    return (
      <Alert className="m-4">
        <Info className="h-4 w-4" />
        <AlertDescription>No dataset catalog available.</AlertDescription>
      </Alert>
    );
  }

  const stats = calculateStats(catalog.datasets);
  const groupedDatasets = groupDatasetsByCancerType(catalog.datasets);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Cancer Research Datasets</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive collection of cancer datasets for research and machine learning applications.
          All datasets are available for download and use in cancer prediction research.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{catalog.total_datasets}</div>
            <div className="text-sm text-gray-600">Total Datasets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalSamples.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Samples</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.cancerTypes}</div>
            <div className="text-sm text-gray-600">Cancer Types</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.realDatasets}</div>
            <div className="text-sm text-gray-600">Real Datasets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{formatFileSize(stats.totalSize)}</div>
            <div className="text-sm text-gray-600">Total Size</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Datasets</TabsTrigger>
          <TabsTrigger value="by-type">By Cancer Type</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {catalog.datasets.map((dataset) => (
              <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(dataset.status)}
                        <CardTitle className="text-lg">{dataset.name}</CardTitle>
                        {getStatusBadge(dataset.status)}
                      </div>
                      <CardDescription className="text-sm">
                        {dataset.description}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => handleDownload(dataset)}
                      disabled={downloadingIds.has(dataset.id)}
                      className="ml-4"
                    >
                      {downloadingIds.has(dataset.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      <span className="ml-2">Download</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">Cancer Type</div>
                      <div className="text-gray-600">{dataset.cancer_type}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Samples</div>
                      <div className="text-gray-600">{dataset.samples.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Features</div>
                      <div className="text-gray-600">{dataset.features}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Size</div>
                      <div className="text-gray-600">{formatFileSize(dataset.file_size)}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Source: {dataset.source}</span>
                      <span>Updated: {formatDate(dataset.last_updated)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="by-type" className="space-y-6">
          {Object.entries(groupedDatasets).map(([cancerType, datasets]) => (
            <div key={cancerType}>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{cancerType}</h3>
              <div className="grid gap-4">
                {datasets.map((dataset) => (
                  <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(dataset.status)}
                            <h4 className="font-medium">{dataset.name}</h4>
                            {getStatusBadge(dataset.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{dataset.description}</p>
                          <div className="flex gap-4 text-xs text-gray-500">
                            <span>{dataset.samples.toLocaleString()} samples</span>
                            <span>{dataset.features} features</span>
                            <span>{formatFileSize(dataset.file_size)}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDownload(dataset)}
                          disabled={downloadingIds.has(dataset.id)}
                          size="sm"
                        >
                          {downloadingIds.has(dataset.id) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dataset Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(groupedDatasets).map(([cancerType, datasets]) => {
                    const percentage = (datasets.length / catalog.total_datasets) * 100;
                    return (
                      <div key={cancerType}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{cancerType}</span>
                          <span>{datasets.length} datasets</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Real Data</span>
                      <span>{stats.realDatasets} datasets</span>
                    </div>
                    <Progress value={(stats.realDatasets / catalog.total_datasets) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Synthetic Data</span>
                      <span>{stats.syntheticDatasets} datasets</span>
                    </div>
                    <Progress value={(stats.syntheticDatasets / catalog.total_datasets) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Sample Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {catalog.datasets.map((dataset) => {
                  const percentage = (dataset.samples / stats.totalSamples) * 100;
                  return (
                    <div key={dataset.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{dataset.name}</span>
                        <span>{dataset.samples.toLocaleString()} samples</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          These datasets are provided for research and educational purposes only. 
          All predictions and analyses should be validated by qualified healthcare professionals. 
          This system is not intended for clinical diagnosis or treatment decisions.
        </AlertDescription>
      </Alert>
    </div>
  );
}