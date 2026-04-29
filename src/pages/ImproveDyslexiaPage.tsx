
import React, { useEffect } from "react";

const ImproveDyslexiaPage = () => {
  useEffect(() => {
    // Redirect to the external site immediately
    window.location.href = "https://read-well-now-app.vercel.app";
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to improvement activities...</p>
      </div>
    </div>
  );
};

export default ImproveDyslexiaPage;
