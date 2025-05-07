import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from './ui/skeleton';
import { cn } from "@/lib/utils"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { MultiSelect } from './multi-select';
import axiosInstance from '../api/axios';
import { toast } from 'sonner';

const FormSchema = z.object({
  serviceTitle: z.string().min(2, {
    message: "Service title must be at least 2 characters.",
  }),
  serviceCategory: z.array(z.string()).optional(), // Revert to array of strings
  serviceRequired: z.string().min(2, {
    message: "Service required must be at least 2 characters.",
  }),
  serviceDescription: z.string().optional(),
  yearsOfExperience: z.number().min(0).optional(),
  preferredLocation: z.string().optional(),
  deadline: z.date().optional(),
  contactName: z.string().min(2, {
    message: "Contact name must be at least 2 characters.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email.",
  }),
  contactPhoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
});

const SwapRequestForm = () => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      serviceTitle: "",
      serviceCategory: [],
      serviceRequired: "",
      serviceDescription: "",
      yearsOfExperience: 0,
      preferredLocation: "",
      deadline: undefined,
      contactName: "",
      contactEmail: "",
      contactPhoneNumber: "",
    },
  });

const [categories, setCategories] = useState([]); // State for fetched categories
  const [loadingCategories, setLoadingCategories] = useState(true); // Loading state for categories

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axiosInstance.get('/api/categories');
        setCategories(response.data.map(category => ({ value: category._id, label: category.name })));
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories.');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []); // Fetch categories on component mount

  const onSubmit = async (values) => {
    try {
      const response = await axiosInstance.post('/api/swap-requests', values);
      console.log('Swap request created:', response.data);
      toast.success('Swap request created successfully!');
      form.reset();
    } catch (error) {
      console.error('Error creating swap request:', error);
      toast.error('Failed to create swap request.');
    }
  };

  return (
<div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center text-primary mb-8">Post A Swap Request</h2>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="serviceTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter service title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceCategory"
            render={({ field }) => {
              return (
               <FormItem>
                 <FormLabel>Service Category</FormLabel>
                 {loadingCategories ? ( // Show skeleton while loading
                   <Skeleton className="h-10 w-full" />
                 ) : (
                 <MultiSelect
                   options={categories}
                   onValueChange={field.onChange}
                   defaultValue={field.value}
                   placeholder="Select categories"
                 />
                 )}
                 <FormMessage />
               </FormItem>
             )}
           }
           />
           <FormField
             control={form.control}
           name="serviceRequired"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Required</FormLabel>
                <FormControl>
                  <Input placeholder="Enter service required" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter service description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter years of experience"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferredLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter preferred location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-8"> {/* Container for Contact Details */}
            <FormItem>
              <FormLabel>Contact Details</FormLabel> {/* Combined label */}
            </FormItem>
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact phone number" {...field} />
                  </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  );
};

export default SwapRequestForm;