"use client"

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Incident, Asset, User } from "@/lib/types";
import { Loader2 } from "lucide-react";

// In a real app, this would likely be a server action that updates a database.
const saveIncident = async (data: IncidentFormValues, incidentId?: string) => {
    console.log("Saving incident:", { id: incidentId, ...data });
    // Simulate network delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app you would revalidate the path to see changes: revalidatePath('/incidents')
    alert("Incident saved! (Check console for data). In a real app, this list would update.");
};

const incidentFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  assetId: z.string().min(1, "Asset is required."),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  status: z.enum(["Pending", "In Progress", "Resolved", "Unresolved"]),
  description: z.string().min(1, "Description is required."),
  resolutionNotes: z.string().optional(),
});

type IncidentFormValues = z.infer<typeof incidentFormSchema>;

interface IncidentFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    incident?: Incident;
    assets: Asset[];
    users: User[];
}

export function IncidentForm({ isOpen, onOpenChange, incident, assets }: IncidentFormProps) {
    const isEditMode = !!incident;

    const form = useForm<IncidentFormValues>({
        resolver: zodResolver(incidentFormSchema),
        defaultValues: {
            title: "",
            assetId: "",
            priority: "Medium",
            status: "Pending",
            description: "",
            resolutionNotes: "",
        },
    });
    
    useEffect(() => {
        // Reset form when dialog opens or incident changes
        if (isOpen) {
            if (isEditMode && incident) {
                form.reset({
                    title: incident.title,
                    assetId: incident.assetId,
                    priority: incident.priority,
                    status: incident.status,
                    description: incident.description,
                    resolutionNotes: incident.resolutionNotes || "",
                });
            } else {
                form.reset({
                    title: "",
                    assetId: "",
                    priority: "Medium",
                    status: "Pending",
                    description: "",
                    resolutionNotes: "",
                });
            }
        }
    }, [isOpen, isEditMode, incident, form]);


    const onSubmit = async (data: IncidentFormValues) => {
        await saveIncident(data, incident?.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Incident" : "Log New Incident"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? "Update the details for this incident." : "Fill out the form to log a new incident."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Unresponsive Call Button" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="assetId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Asset</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an asset" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {assets.map(asset => (
                                                    <SelectItem key={asset.id} value={asset.id}>{asset.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {(["Low", "Medium", "High", "Critical"] as const).map(p => (
                                                    <SelectItem key={p} value={p}>{p}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {isEditMode && (
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {(["Pending", "In Progress", "Resolved", "Unresolved"] as const).map(s => (
                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe the incident in detail..." {...field} rows={5} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         {isEditMode && form.watch('status') === 'Resolved' && (
                            <FormField
                                control={form.control}
                                name="resolutionNotes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Resolution Notes</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Describe how the incident was resolved..." {...field} rows={3}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                         )}

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditMode ? 'Save Changes' : 'Log Incident'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
