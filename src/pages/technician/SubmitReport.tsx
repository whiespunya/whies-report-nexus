
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/utils/routes";

// Define the schema for the report form
const reportFormSchema = z.object({
  unitId: z.string().min(1, "Unit ID is required"),
  locationId: z.string().min(1, "Location is required"),
  deviceId: z.string().min(1, "Device ID is required"),
  cardNumber: z.string().min(1, "Card Number is required"),
  description: z.string().min(1, "Description is required"),
  notes: z.string().optional(),
  // In a real app, you would handle image uploads differently
  images: z.any().optional(),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

const SubmitReport = () => {
  const { locations, currentUser, addReport } = useAppContext();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      unitId: "",
      locationId: "",
      deviceId: "",
      cardNumber: "",
      description: "",
      notes: "",
      images: null,
    },
  });
  
  const handleSubmit = async (data: ReportFormValues) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      const selectedLocation = locations.find((loc) => loc.id === data.locationId);
      
      const reportData = {
        technicianId: currentUser.id,
        technicianName: currentUser.fullName,
        badgeNumber: currentUser.badgeNumber,
        unitId: data.unitId,
        locationId: data.locationId,
        locationName: selectedLocation?.name || "",
        deviceId: data.deviceId,
        cardNumber: data.cardNumber,
        status: "pending" as const,
        date: new Date().toISOString(),
        description: data.description,
        notes: data.notes || "",
        images: selectedImages.length > 0 ? selectedImages : ["/placeholder.svg"],
      };
      
      await addReport(reportData);
      navigate(ROUTES.TECHNICIAN_REPORTS);
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle image selection (simplified for demo)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // In a real app, you would upload these files to a server
      // For this demo, we'll use the placeholder image
      const imageCount = e.target.files.length;
      setSelectedImages(Array(imageCount).fill("/placeholder.svg"));
    }
  };
  
  if (!currentUser) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(ROUTES.TECHNICIAN_DASHBOARD)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Submit New Report</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="unitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. UNIT-001" {...field} />
                      </FormControl>
                      <FormDescription>Enter the unit identifier</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Select the service location</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. DEV-001" {...field} />
                      </FormControl>
                      <FormDescription>Enter the device identifier</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. CARD-001" {...field} />
                      </FormControl>
                      <FormDescription>Enter the card number</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the work performed or issue found"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of the service or issue
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional notes or observations"
                        className="min-h-[100px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="images"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Images (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          handleImageChange(e);
                          onChange(e.target.files);
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload images related to the service or issue (Max: 5MB each)
                    </FormDescription>
                    <FormMessage />
                    
                    {selectedImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                        {selectedImages.map((src, index) => (
                          <div
                            key={index}
                            className="aspect-square rounded-md overflow-hidden bg-gray-100"
                          >
                            <img
                              src={src}
                              alt={`Selected image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(ROUTES.TECHNICIAN_DASHBOARD)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitReport;
