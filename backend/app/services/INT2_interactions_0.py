// formValidation.ts
import { z } from 'zod';

// Define the Zod schema for DJ booking form validation
const djBookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Event date must be in YYYY-MM-DD format" }),
  eventType: z.enum(["Wedding", "Corporate", "Private Party"], { message: "Invalid event type" }),
  additionalNotes: z.string().optional(),
});

// Function to validate the form data in real-time
export const validateForm = (formData: Record<string, any>) => {
  try {
    // Parse and validate the form data against the schema
    const validatedData = djBookingSchema.parse(formData);
    return { success: true, data: validatedData };
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    throw error; // Re-throw unexpected errors
  }
};

// Example usage
const exampleFormData = {
  name: "John Doe",
  email: "john.doe@example.com",
  eventDate: "2023-12-31",
  eventType: "Wedding",
  additionalNotes: "Please include a light show.",
};

const validationResult = validateForm(exampleFormData);

if (validationResult.success) {
  console.log("Form is valid:", validationResult.data);
} else {
  console.log("Form validation failed:", validationResult.errors);
}
