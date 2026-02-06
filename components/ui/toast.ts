import { toast } from "sonner";

type ToastOptions = {
  title: string;
  description?: string;
};

export const showSuccessToast = ({ title, description }: ToastOptions) => {
  toast.success(title, {
    description,
  });
};

export const showErrorToast = ({ title, description }: ToastOptions) => {
  toast.error(title, {
    description,
  });
};
