
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordUpdateValues = z.infer<typeof passwordUpdateSchema>;

const TechnicianProfile = () => {
  const { currentUser, updateUser } = useAppContext();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  const passwordForm = useForm<PasswordUpdateValues>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const handlePasswordUpdate = async (data: PasswordUpdateValues) => {
    if (currentUser) {
      // In a real application, you would validate the current password
      // and send the new password to the server for updating
      
      // For this demo, we'll simulate a successful password update
      await updateUser(currentUser.id, {});
      setIsPasswordDialogOpen(false);
      passwordForm.reset();
    }
  };
  
  if (!currentUser) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal information and credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
                <p className="font-medium">{currentUser.fullName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Username</h3>
                <p>{currentUser.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                <p>{currentUser.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Badge Number</h3>
                <p>{currentUser.badgeNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Role</h3>
                <p className="capitalize">{currentUser.role}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Account Created</h3>
                <p>{format(new Date(currentUser.createdAt), "PPP")}</p>
              </div>
            </div>
            
            <div>
              <Button
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(true)}
              >
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Password Update Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Update Password</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechnicianProfile;
