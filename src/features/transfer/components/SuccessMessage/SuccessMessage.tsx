import React from "react";
import { CheckCircle } from "lucide-react";

interface SuccessMessageProps {
  title: string;
  message: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  message,
}) => {
  return (
    <div className="bg-teal-50 p-4 rounded-md border border-teal-100 flex items-center mb-4">
      <div className="mr-3 bg-teal-100 rounded-full p-2">
        <CheckCircle className="h-6 w-6 text-teal-600" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-teal-800">{title}</h3>
        <p className="text-xs text-teal-700">{message}</p>
      </div>
    </div>
  );
};
