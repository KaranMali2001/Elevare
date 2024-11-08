"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, Clock, Mail, Shield, Zap } from "lucide-react";
import SignInButton from "./SignInButton";

export function LoginPageComponent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Mail className="h-6 w-6 text-gray-600 mr-2" />
            <span className="text-xl font-semibold text-gray-800">Elevare</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sign-in box */}
          <Card className="w-full bg-white shadow-lg border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-gray-300 to-gray-400"></div>
            <CardHeader className="pt-6">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Welcome to Elevare
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Sign in to access your AI-powered email management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInButton />
              {/* <Button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center space-x-2 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg> */}
              {/* <span>Sign in with Google</span> */}
              {/* </Button> */}
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500 text-center w-full">
                By signing in, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </CardFooter>
          </Card>

          {/* AI-powered features */}
          <div className="w-full space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              AI-Powered Features
            </h2>
            {[
              {
                icon: Zap,
                title: "Smart Categorization",
                description: "Automatically organize your emails",
              },
              {
                icon: Brain,
                title: "Intelligent Responses",
                description: "Generate context-aware replies",
              },
              {
                icon: Clock,
                title: "Time-Saving Summaries",
                description: "Get concise email thread summaries",
              },
              {
                icon: Shield,
                title: "Advanced Security",
                description: "AI-powered threat detection",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 transition-all hover:border-gray-300 hover:shadow-md"
              >
                <div className="mt-1">
                  <feature.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <p className="text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Elevare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
