
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TestCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  className?: string;
}

export function TestCard({ title, description, icon, link, className }: TestCardProps) {
  return (
    <Link to={link}>
      <Card className={cn(
        "card-hover relative overflow-hidden transition-all group", 
        className
      )}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 bg-primary rounded-2xl transition-all duration-300" />
        
        <div className="absolute hidden md:block h-24 w-24 -top-12 -right-12 opacity-5 dark:opacity-10 blur-xl overflow-hidden rounded-full bg-primary group-hover:bg-secondary transition-colors duration-300" />
        
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="bg-accent rounded-xl p-2 text-primary">
              {icon}
            </div>
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
              <svg 
                width="15" 
                height="15" 
                viewBox="0 0 15 15" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
              >
                <path 
                  d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" 
                  fill="currentColor" 
                  fillRule="evenodd" 
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
          <CardTitle className="text-lg font-heading mt-2">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium text-primary mt-1">
            Start Test
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
