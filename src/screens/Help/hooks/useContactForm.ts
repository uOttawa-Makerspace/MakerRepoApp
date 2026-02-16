import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import * as HTTPRequest from "../../../utils/HTTPRequests";
import EnvVariables from "../../../utils/EnvVariables";
import { FormData, FormErrors } from "../types";
import { INITIAL_FORM_DATA } from "../constants";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALIDATION_RULES: Record<
  keyof FormData,
  { required: string; minLength?: { value: number; message: string } }
> = {
  name: {
    required: "Name is required",
    minLength: { value: 2, message: "Name must be at least 2 characters" },
  },
  email: {
    required: "Email is required",
  },
  subject: {
    required: "Subject is required",
    minLength: {
      value: 5,
      message: "Subject must be at least 5 characters",
    },
  },
  comments: {
    required: "Message is required",
    minLength: {
      value: 10,
      message: "Message must be at least 10 characters",
    },
  },
};

export const useContactForm = () => {
  const [formData, setFormData] = useState<FormData>({ ...INITIAL_FORM_DATA });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    for (const [field, rules] of Object.entries(VALIDATION_RULES)) {
      const key = field as keyof FormData;
      const value = formData[key].trim();

      if (!value) {
        errors[key] = rules.required;
      } else if (key === "email" && !EMAIL_REGEX.test(value)) {
        errors[key] = "Please enter a valid email address";
      } else if (rules.minLength && value.length < rules.minLength.value) {
        errors[key] = rules.minLength.message;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setFormErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        toast.error("Please fix the errors in the form", {
          position: "bottom-center",
        });
        return;
      }

      setSubmitting(true);

      try {
        await HTTPRequest.put("send_email", {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          comments: formData.comments,
          app_version: `${EnvVariables.app_version} ${EnvVariables.app_release_type}`,
        });

        setSubmitSuccess(true);
        toast.success("Your message has been sent successfully!", {
          position: "bottom-center",
          icon: "✉️",
          duration: 4000,
        });
        setFormData({ ...INITIAL_FORM_DATA });
      } catch (error) {
        console.error(error);
        toast.error(
          "Failed to send your message. Please try again or email us directly at uottawa.makerepo@gmail.com",
          { position: "bottom-center", duration: 6000 }
        );
      } finally {
        setSubmitting(false);
      }
    },
    [formData, validateForm]
  );

  const dismissSuccess = useCallback(() => setSubmitSuccess(false), []);

  return {
    formData,
    formErrors,
    submitting,
    submitSuccess,
    handleInputChange,
    handleSubmit,
    dismissSuccess,
  };
};