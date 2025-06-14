"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Volume2, Palette, AlertTriangle, Sparkles, BookOpen } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"

interface ComicPage {
  pageNumber: number
  script: string
  imageUrl: string // Now contains visual description text instead of actual image URL
}

interface ComicResponse {
  success: boolean
  pages: ComicPage[]
  error?: string
}

export default function HistorySnap() {
  const [topic, setTopic] = useState("")
  const [error, setError] = useState("")
  const [comicPages, setComicPages] = useState<ComicPage[]>([])

  const generateComicMutation = useMutation({
    mutationFn: async (topic: string) => {
      const response = await fetch("/api/generate-comic", {
        method: "POST",
        body: JSON.stringify({ topic }),
        headers: { "Content-Type": "application/json" }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data as ComicResponse
    },
    onSuccess: (data) => {
      if (data.success) {
        setComicPages(data.pages)
        setError("")
      } else {
        setError(data.error || "Failed to generate comic")
      }
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : "Failed to generate comic")
    }
  })

  const blockedTopics = [
    "holocaust",
    "war",
    "genocide",
    "slavery",
    "violence",
    "death",
    "murder",
    "battle",
    "conflict",
    "terrorism",
    "assassination",
  ]

  const sampleTopics = [
    "Egyptian Pyramids",
    "Roman Colosseum",
    "Medieval Castles",
    "Ancient Greece",
    "Dinosaurs",
    "Renaissance Art",
    "Viking Ships",
    "Samurai Warriors",
    "Great Wall of China",
    "Mayan Civilization",
  ]

  const isTopicBlocked = (inputTopic: string) => {
    return blockedTopics.some((blocked) => inputTopic.toLowerCase().includes(blocked.toLowerCase()))
  }

  const handleGenerateComic = async () => {
    if (!topic.trim()) {
      setError("Please enter a historical topic")
      return
    }

    if (isTopicBlocked(topic)) {
      setError(
        "This topic is too complex for our current content. Try something like 'Ancient Egypt' or 'Medieval Knights'",
      )
      return
    }

    setError("")
    setComicPages([])
    generateComicMutation.mutate(topic)
  }

  const handleSampleTopic = (sampleTopic: string) => {
    setTopic(sampleTopic)
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              HistorySnap
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform any historical topic into engaging 4-page comic books in minutes!
          </p>
          <Badge variant="secondary" className="text-sm">
            Ages 10+ • Comic Books • Educational Content
          </Badge>
        </div>

        {/* Main Input Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-center">What history topic interests you?</CardTitle>
            <CardDescription className="text-center">
              Enter any historical topic and we'll create a 4-page comic book just for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Topic Input */}
            <div className="space-y-2">
              <Input
                placeholder="e.g., Egyptian Pyramids, Roman Empire, Medieval Knights..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="text-lg h-12 border-2 focus:border-purple-400"
                disabled={generateComicMutation.isPending}
              />
            </div>

            {/* Sample Topics */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600 font-medium">Popular topics:</p>
              <div className="flex flex-wrap gap-2">
                {sampleTopics.map((sampleTopic) => (
                  <Button
                    key={sampleTopic}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleTopic(sampleTopic)}
                    disabled={generateComicMutation.isPending}
                    className="text-xs hover:bg-purple-50 hover:border-purple-300 hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-md"
                  >
                    {sampleTopic}
                  </Button>
                ))}
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">{error}</AlertDescription>
              </Alert>
            )}

            {/* Generation Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleGenerateComic}
                disabled={generateComicMutation.isPending || !topic.trim()}
                className="h-16 px-8 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg transform"
              >
                {generateComicMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Comic Book...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5 mr-2" />
                    Generate Comic Book
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Comic Pages */}
        {comicPages.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Historical Comic Book</h2>
              <p className="text-gray-600">"{topic}" - 4 Page Comic Story</p>
            </div>
            
            <div className="grid gap-8">
              {comicPages.map((page) => (
                <Card key={page.pageNumber} className="shadow-lg border-0 bg-white/90 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      Page {page.pageNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Visual Description */}
                    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Visual Description:
                      </h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{page.imageUrl}</p>
                    </div>
                    
                    {/* Script Text */}
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                      <h4 className="font-semibold text-gray-800 mb-2">Page Script:</h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{page.script}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Loading State for Comic Generation */}
        {generateComicMutation.isPending && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
                <h3 className="text-xl font-semibold text-gray-800">Creating Your Comic Book</h3>
                <p className="text-gray-600">
                  Generating script and illustrations for "{topic}"... This may take a few minutes.
                </p>
                <div className="max-w-md mx-auto bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 pt-8">
          <Card className="bg-white/60 backdrop-blur border-0 shadow-sm">
            <CardContent className="pt-6 text-center">
              <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">4-Page Comics</h3>
              <p className="text-sm text-gray-600">Complete comic book stories with historically accurate content</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur border-0 shadow-sm">
            <CardContent className="pt-6 text-center">
              <Palette className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">AI Illustrations</h3>
              <p className="text-sm text-gray-600">Beautiful, engaging artwork for each page of your comic</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur border-0 shadow-sm">
            <CardContent className="pt-6 text-center">
              <Sparkles className="w-8 h-8 text-pink-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Educational</h3>
              <p className="text-sm text-gray-600">Age-appropriate content designed for young learners</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}