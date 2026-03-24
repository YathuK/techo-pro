import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  iconColor = "bg-accent/10 text-accent",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-3.5 sm:p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-stone-500 font-medium truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-charcoal-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
              {trend === "up" ? (
                <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-danger" />
              )}
              <span
                className={clsx(
                  "text-xs font-medium",
                  trend === "up" ? "text-success" : "text-danger"
                )}
              >
                {change}
              </span>
              <span className="text-xs text-stone-400 hidden sm:inline">vs last month</span>
            </div>
          )}
        </div>
        <div className={clsx("p-2 sm:p-2.5 rounded-lg flex-shrink-0", iconColor)}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
    </div>
  );
}
