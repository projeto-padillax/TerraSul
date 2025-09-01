import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface AdminCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  href: string;
}

export function AdminCard({
  title,
  subtitle,
  icon: Icon,
  color,
  href,
}: AdminCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group h-full w-full">
        <CardContent className="p-6 text-center">
          <div
            className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
          >
            <Icon className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
