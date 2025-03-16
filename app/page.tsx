"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setImage(`${data.imageUrl}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">AI Image Generator</h1>
          <p className="text-gray-300 text-lg">
            Transform your ideas into stunning images using AI
          </p>
        </div>

        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <div className="flex gap-4 mb-8">
            <Input
              placeholder="Describe the image you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            <Button
              onClick={generateImage}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                "Generating..."
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>

          {loading && (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-pulse text-gray-400">
                Creating your masterpiece...
              </div>
            </div>
          )}

          {image && !loading && (
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={image}
                alt="Generated image"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          )}

          {!image && !loading && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400 border-2 border-dashed border-gray-700 rounded-lg">
              <Wand2 className="h-12 w-12 mb-4" />
              <p>Your generated image will appear here</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}