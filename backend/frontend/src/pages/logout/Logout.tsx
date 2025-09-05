"use client";

import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Logout = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-[10%] left-[50%] transform -translate-x-1/2">
      <Card className="w-72 bg-gray-800 text-gray-100 border border-gray-700 shadow-md">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
          <p className="text-center">You have been logged out.</p>
          <Button
            onClick={() => navigate("/login")}
            className="bg-indigo-600 hover:bg-indigo-700 w-full"
          >
            Back to Login Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logout;
