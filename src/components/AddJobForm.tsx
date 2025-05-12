
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Job, JobStatus } from '@/types/job';
import JobStatusSelect from './JobStatusSelect';
import PrioritySelect from './PrioritySelect';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AddJobFormProps {
  onSave: (job: Job) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  position: z.string().min(1, 'Position is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  job_description: z.string().optional(),
  job_type: z.string().optional(),
  remote_policy: z.string().optional(),
  seniority_level: z.string().optional(),
  possible_salary: z.string().optional(),
  requirements: z.string().optional(),
  tech_stack: z.string().optional(),
  recruiter_contact: z.string().optional(),
  applied_date: z.string().optional(),
  interview_notes: z.string().optional(),
});

export default function AddJobForm({ onSave, onCancel }: AddJobFormProps) {
  const [status, setStatus] = useState<JobStatus>('Applied');
  const [priority, setPriority] = useState<number>(3);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: '',
      company: '',
      location: '',
      job_description: '',
      job_type: '',
      remote_policy: '',
      seniority_level: '',
      possible_salary: '',
      requirements: '',
      tech_stack: '',
      recruiter_contact: '',
      applied_date: new Date().toISOString().split('T')[0],
      interview_notes: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const techStackArray = data.tech_stack
      ? data.tech_stack.split(',').map(item => item.trim()).filter(Boolean)
      : [];

    // Ensure position and company are required
    const newJob: Job = {
      id: uuidv4(),
      position: data.position, // non-optional field
      company: data.company, // non-optional field
      location: data.location,
      job_description: data.job_description,
      job_type: data.job_type,
      remote_policy: data.remote_policy,
      seniority_level: data.seniority_level,
      possible_salary: data.possible_salary,
      requirements: data.requirements,
      tech_stack: techStackArray,
      recruiter_contact: data.recruiter_contact,
      applied_date: data.applied_date,
      interview_notes: data.interview_notes,
      priority_level: priority,
      status: status,
      last_updated: new Date().toISOString(),
    };

    onSave(newJob);
    toast.success('Job added successfully!');
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-screen overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add New Job</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="job_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Full-time, Contract, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remote_policy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remote Policy</FormLabel>
                    <FormControl>
                      <Input placeholder="Remote, Hybrid, On-site" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seniority_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seniority Level</FormLabel>
                    <FormControl>
                      <Input placeholder="Junior, Mid-level, Senior" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="possible_salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Range</FormLabel>
                    <FormControl>
                      <Input placeholder="$80,000 - $100,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tech_stack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tech Stack</FormLabel>
                    <FormControl>
                      <Input placeholder="React, TypeScript, CSS (comma separated)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter technologies separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recruiter_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recruiter Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Email or phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applied_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Applied Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Status</FormLabel>
                <JobStatusSelect value={status} onChange={setStatus} />
              </div>

              <div className="space-y-2">
                <FormLabel>Priority</FormLabel>
                <PrioritySelect value={priority} onChange={setPriority} />
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="job_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description of the job responsibilities..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requirements</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Job requirements and qualifications..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interview_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional notes about the application..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Add Job</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
