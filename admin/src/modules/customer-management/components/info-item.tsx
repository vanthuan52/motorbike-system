import React from "react";

const InfoItem = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="text-gray-500">{icon}</div>
    <span className="text-sm font-medium break-words">{label}</span>
  </div>
);

export default InfoItem;
