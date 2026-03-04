import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { PatientData } from '@/types/healthcare';

const patientSchema = z.object({
  // Basic Information
  age: z.number().min(1).max(120),
  gender: z.enum(['male', 'female']),
  smokingHistory: z.enum(['never', 'former', 'current']),
  familyHistory: z.boolean(),
  
  // Physical Measurements
  bmi: z.number().min(10).max(50),
  bloodPressureSystolic: z.number().min(70).max(200),
  bloodPressureDiastolic: z.number().min(40).max(120),
  
  // Blood Work & Lab Results
  cholesterol: z.number().min(100).max(400),
  glucose: z.number().min(50).max(300),
  hemoglobin: z.number().min(5).max(20),
  whiteBloodCells: z.number().min(1000).max(20000),
  platelets: z.number().min(50000).max(500000),
  
  // Enhanced Cancer-Specific Information
  alcoholConsumption: z.enum(['never', 'occasional', 'moderate', 'heavy']),
  exerciseFrequency: z.enum(['none', 'light', 'moderate', 'heavy']),
  dietType: z.enum(['vegetarian', 'non-vegetarian', 'vegan', 'mixed']),
  stressLevel: z.enum(['low', 'moderate', 'high']),
  sleepHours: z.number().min(3).max(12),
  
  // Detailed Cancer Risk Factors
  sunExposure: z.enum(['minimal', 'moderate', 'high']),
  occupationalExposure: z.string().optional(),
  environmentalFactors: z.string().optional(),
  reproductiveHistory: z.string().optional(),
  hormonalFactors: z.string().optional(),
  immuneSystemStatus: z.enum(['normal', 'compromised', 'enhanced']),
  inflammatoryConditions: z.string().optional(),
  geneticMutations: z.string().optional(),
  
  // Symptom Assessment
  unexplainedWeightLoss: z.boolean().optional(),
  persistentFatigue: z.boolean().optional(),
  unusualBleeding: z.boolean().optional(),
  persistentCough: z.boolean().optional(),
  skinChanges: z.boolean().optional(),
  digestiveIssues: z.boolean().optional(),
  
  // Medical History
  chronicConditions: z.string().optional(),
  currentMedications: z.string().optional(),
  symptoms: z.string().optional(),
  previousSurgeries: z.string().optional(),
  occupationalHazards: z.string().optional(),
  
  // Cancer-Specific Information
  tumorSize: z.number().optional(),
  lymphNodes: z.number().optional(),
  metastasis: z.boolean().optional(),
  previousCancerHistory: z.boolean().optional(),
  radiationExposure: z.boolean().optional(),
  chemotherapyHistory: z.boolean().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  onSubmit: (data: PatientData) => void;
  isLoading?: boolean;
}

export function PatientForm({ onSubmit, isLoading }: PatientFormProps) {
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      age: 45,
      gender: 'female',
      smokingHistory: 'never',
      familyHistory: false,
      bmi: 25,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      cholesterol: 200,
      glucose: 90,
      hemoglobin: 14,
      whiteBloodCells: 7000,
      platelets: 250000,
      alcoholConsumption: 'never',
      exerciseFrequency: 'moderate',
      dietType: 'mixed',
      stressLevel: 'moderate',
      sleepHours: 7,
      sunExposure: 'moderate',
      immuneSystemStatus: 'normal',
      metastasis: false,
      previousCancerHistory: false,
      radiationExposure: false,
      chemotherapyHistory: false,
    },
  });

  const handleSubmit = (data: PatientFormData): void => {
    const patientData: PatientData = {
      age: data.age,
      gender: data.gender,
      smokingHistory: data.smokingHistory,
      familyHistory: data.familyHistory,
      bmi: data.bmi,
      bloodPressure: {
        systolic: data.bloodPressureSystolic,
        diastolic: data.bloodPressureDiastolic,
      },
      cholesterol: data.cholesterol,
      glucose: data.glucose,
      hemoglobin: data.hemoglobin,
      whiteBloodCells: data.whiteBloodCells,
      platelets: data.platelets,
      tumorSize: data.tumorSize,
      lymphNodes: data.lymphNodes,
      metastasis: data.metastasis,
      previousCancerHistory: data.previousCancerHistory,
      alcoholConsumption: data.alcoholConsumption,
      exerciseFrequency: data.exerciseFrequency,
      dietType: data.dietType,
      stressLevel: data.stressLevel,
      sleepHours: data.sleepHours,
      sunExposure: data.sunExposure,
      occupationalExposure: data.occupationalExposure,
      environmentalFactors: data.environmentalFactors,
      reproductiveHistory: data.reproductiveHistory,
      hormonalFactors: data.hormonalFactors,
      immuneSystemStatus: data.immuneSystemStatus,
      inflammatoryConditions: data.inflammatoryConditions,
      geneticMutations: data.geneticMutations,
      unexplainedWeightLoss: data.unexplainedWeightLoss,
      persistentFatigue: data.persistentFatigue,
      unusualBleeding: data.unusualBleeding,
      persistentCough: data.persistentCough,
      skinChanges: data.skinChanges,
      digestiveIssues: data.digestiveIssues,
      chronicConditions: data.chronicConditions,
      currentMedications: data.currentMedications,
      symptoms: data.symptoms,
      previousSurgeries: data.previousSurgeries,
      occupationalHazards: data.occupationalHazards,
      radiationExposure: data.radiationExposure,
      chemotherapyHistory: data.chemotherapyHistory,
    };
    onSubmit(patientData);
  };

  return (
    <Card className="w-full max-w-6xl animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Enhanced Cancer Risk Assessment</CardTitle>
        <CardDescription>
          Comprehensive health evaluation with detailed cancer risk factors analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="smokingHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Smoking History *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="former">Former</SelectItem>
                          <SelectItem value="current">Current</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Enhanced Risk Factors */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Detailed Risk Factors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="sunExposure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sun Exposure Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal (indoor work)</SelectItem>
                          <SelectItem value="moderate">Moderate (occasional outdoor)</SelectItem>
                          <SelectItem value="high">High (outdoor work/sports)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="immuneSystemStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Immune System Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="compromised">Compromised</SelectItem>
                          <SelectItem value="enhanced">Enhanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alcoholConsumption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alcohol Consumption</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="occasional">Occasional</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="heavy">Heavy</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exerciseFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="light">Light (1-2 times/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (3-4 times/week)</SelectItem>
                          <SelectItem value="heavy">Heavy (5+ times/week)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dietType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diet Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stressLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stress Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="sleepHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Sleep Hours</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="3" 
                          max="12"
                          {...field} 
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BMI *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bloodPressureSystolic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Systolic BP *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="bloodPressureDiastolic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diastolic BP *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cholesterol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cholesterol (mg/dL) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="glucose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Glucose (mg/dL) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Symptom Assessment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Current Symptoms (Check if applicable)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="unexplainedWeightLoss"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Unexplained Weight Loss</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Significant weight loss without trying
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="persistentFatigue"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Persistent Fatigue</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Extreme tiredness not relieved by rest
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unusualBleeding"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Unusual Bleeding</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Bleeding or bruising without known cause
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="persistentCough"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Persistent Cough</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Cough that lasts for more than a few weeks
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skinChanges"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Skin Changes</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          New moles, changes in existing moles, or sores that don't heal
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="digestiveIssues"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Digestive Issues</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Changes in bowel habits, persistent abdominal pain, or nausea
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Blood Work */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Blood Work Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="hemoglobin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hemoglobin (g/dL) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="whiteBloodCells"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WBC Count (/μL) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="platelets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platelet Count (/μL) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Medical History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Medical History & Symptoms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="chronicConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chronic Conditions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List any chronic conditions (diabetes, hypertension, etc.)"
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentMedications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Medications</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List current medications and dosages"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Symptoms</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe any current symptoms or concerns"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupationalHazards"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupational Hazards</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any exposure to chemicals, radiation, asbestos, etc."
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Cancer-Specific Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Cancer-Specific Information (If Applicable)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="tumorSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tumor Size (cm) - Optional</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="Enter if known"
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lymphNodes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Affected Lymph Nodes - Optional</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter if known"
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Risk Factors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="familyHistory"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Family History of Cancer</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Check if any immediate family members had cancer
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="previousCancerHistory"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Previous Cancer History</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Check if you have been diagnosed with cancer before
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="radiationExposure"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Previous Radiation Exposure</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Check if you have been exposed to radiation therapy or high-dose radiation
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="metastasis"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Evidence of Metastasis</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Check if there is evidence of cancer spread to other organs
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Enhanced Assessment:</strong> This comprehensive evaluation includes detailed cancer risk factors, 
                symptom assessment, and lifestyle factors for more accurate predictions.
              </p>
              <p className="text-xs text-muted-foreground">
                * Required fields. All information is processed securely and used only for analysis purposes.
              </p>
            </div>

            <Button type="submit" className="w-full hover-scale" size="lg" disabled={isLoading}>
              {isLoading ? 'Analyzing Enhanced Health Data...' : 'Complete Enhanced Analysis'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
