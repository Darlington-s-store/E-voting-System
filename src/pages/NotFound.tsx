import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-extrabold text-navy">404</h1>
        <h2 className="mt-2 text-2xl font-bold">Page not found</h2>
        <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/"><Button className="mt-6 bg-brand text-white">Back to home</Button></Link>
      </div>
    </div>
  );
}
