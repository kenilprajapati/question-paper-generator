import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Custom hook to simplify React Hook Form with Zod validation
 * @param {z.ZodSchema} schema - Zod schema for validation
 * @param {Object} defaultValues - Default form values
 */
export const useZodForm = (schema, defaultValues) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange', // Validate on change for better UX
  });

  return {
    register,
    handleSubmit,
    errors,
    isValid,
    isSubmitting,
    reset,
    setValue,
    watch,
  };
};
