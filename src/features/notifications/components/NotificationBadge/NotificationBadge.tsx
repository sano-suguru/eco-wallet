import React from "react";
import { Badge } from "@/components/ui/badge";

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  className = "",
}) => {
  if (count === 0) {
    return null;
  }

  return (
    <Badge
      className={`bg-teal-100 text-teal-800 hover:bg-teal-100 ${className}`}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
};
