export interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Extend the FormErrors interface to include the 'form' property
export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string; // Add this line
}
