import { Progress } from "@/components/ui/progress";
import { TreePine, Droplets } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  currentFunding: number;
  targetFunding: number;
  imageType: "mountain" | "ocean" | "forest";
  selected: boolean;
  onSelect: () => void;
}

export function ProjectCard({
  title,
  description,
  currentFunding,
  targetFunding,
  imageType,
  selected,
  onSelect,
}: ProjectCardProps) {
  const progressPercent = Math.round((currentFunding / targetFunding) * 100);

  // 背景色を決定
  const getBackgroundGradient = () => {
    switch (imageType) {
      case "ocean":
        return "from-blue-600 to-blue-500";
      case "mountain":
        return "from-green-700 to-green-600";
      case "forest":
      default:
        return "from-teal-700 to-teal-600";
    }
  };

  // アイコンを決定
  const getIcon = () => {
    switch (imageType) {
      case "ocean":
        return <Droplets className="h-16 w-16 text-white opacity-30" />;
      case "mountain":
      case "forest":
      default:
        return <TreePine className="h-16 w-16 text-white opacity-30" />;
    }
  };

  return (
    <div
      className={`relative border rounded-lg overflow-hidden eco-transition cursor-pointer
        ${
          selected
            ? "border-teal-500 shadow-md"
            : "border-stone-200 hover:border-teal-300"
        }`}
      onClick={onSelect}
    >
      <div
        className={`aspect-video bg-gradient-to-br ${getBackgroundGradient()} relative`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {getIcon()}
        </div>

        {selected && (
          <div className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="#0F766E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-stone-800">{title}</h3>
        <p className="text-xs text-stone-600 mt-1 line-clamp-2">
          {description}
        </p>

        <div className="mt-3 flex justify-between items-center">
          <div className="text-xs">
            <span className="text-teal-700 font-medium">
              {formatCurrency(currentFunding, { withSymbol: false })}
            </span>
            <span className="text-stone-500">
              {" / "}
              {formatCurrency(targetFunding, { withSymbol: false })}
            </span>
          </div>
          <Progress
            value={progressPercent}
            className="h-1.5 w-1/2 bg-teal-100"
          />
        </div>
      </div>
    </div>
  );
}
