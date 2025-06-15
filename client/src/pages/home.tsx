"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Loader2, Volume2, Palette, AlertTriangle, Sparkles, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"

interface ComicPage {
  pageNumber: number
  script: string
  imageUrl: string // Contains actual image URL from DALL-E
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
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState("")
  const [totalPages, setTotalPages] = useState(0)

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
    setIsGenerating(true)
    setCurrentStatus("Starting generation...")
    setTotalPages(0)

    try {
      const response = await fetch("/api/generate-comic", {
        method: "POST",
        body: JSON.stringify({ topic }),
        headers: { "Content-Type": "application/json" }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!response.body) {
        throw new Error("No response body")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          setIsGenerating(false)
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              switch (data.type) {
                case 'status':
                  setCurrentStatus(data.message)
                  break
                case 'script_complete':
                  setTotalPages(data.pages)
                  setCurrentStatus(`Script complete! Generating ${data.pages} pages...`)
                  break
                case 'generating_page':
                  setCurrentStatus(`Generating page ${data.pageNumber}...`)
                  break
                case 'page_complete':
                  setComicPages(prev => [...prev, data.page])
                  setCurrentStatus(`Page ${data.page.pageNumber} complete!`)
                  break
                case 'complete':
                  setCurrentStatus("Comic generation complete!")
                  setIsGenerating(false)
                  return
                case 'error':
                  setError(data.error)
                  setIsGenerating(false)
                  return
                case 'page_error':
                  setError(`Error generating page ${data.pageNumber}: ${data.error}`)
                  break
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to generate comic")
      setIsGenerating(false)
    }
  }

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
                disabled={isGenerating}
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
                    disabled={isGenerating}
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
                disabled={isGenerating || !topic.trim()}
                className="h-16 px-8 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg transform"
              >
                {isGenerating ? (
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

        {/* Generated Comic Pages - Carousel */}
        {comicPages.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Historical Comic Book</h2>
              <p className="text-gray-600">"{topic}" - 4 Page Comic Story</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-sm text-gray-500">Page {Math.min(1, comicPages.length)} of {Math.max(4, totalPages || 4)}</span>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Carousel className="w-full">
                <CarouselContent>
                  {comicPages.map((page) => (
                    <CarouselItem key={page.pageNumber}>
                      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-center gap-2 text-xl">
                            <BookOpen className="w-5 h-5 text-purple-600" />
                            Page {page.pageNumber}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Generated Content - Only show images, no text descriptions */}
                          <div className="w-full max-w-4xl mx-auto aspect-[4/3] flex items-center justify-center">
                            {page.imageUrl.startsWith('/images/') || page.imageUrl.startsWith('http') ? (
                              <img 
                                src={page.imageUrl} 
                                alt={`Comic page ${page.pageNumber}`}
                                className="w-full h-full object-contain rounded-lg shadow-lg border border-gray-200"
                                onError={(e) => {
                                  console.error('Image failed to load:', page.imageUrl);
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                                <div className="text-center space-y-3">
                                  <Palette className="w-12 h-12 text-purple-400 mx-auto" />
                                  <p className="text-purple-600 font-medium">Image generating...</p>
                                  <p className="text-sm text-gray-500 max-w-md">This page is being created and will display shortly</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Script Text */}
                          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                            <h4 className="font-semibold text-gray-800 mb-2 text-center">Page Script</h4>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-center">{page.script}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                  
                  {/* Show placeholder cards for pages not yet generated */}
                  {totalPages > 0 && comicPages.length < totalPages && 
                    Array.from({ length: totalPages - comicPages.length }, (_, index) => (
                      <CarouselItem key={`placeholder-${comicPages.length + index + 1}`}>
                        <Card className="shadow-lg border-0 bg-white/60 backdrop-blur">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-center gap-2 text-xl text-gray-400">
                              <BookOpen className="w-5 h-5" />
                              Page {comicPages.length + index + 1}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="w-full max-w-4xl mx-auto aspect-[4/3] flex items-center justify-center">
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                                <div className="text-center space-y-3">
                                  <Loader2 className="w-12 h-12 text-gray-400 mx-auto animate-spin" />
                                  <p className="text-gray-500 font-medium">Generating page...</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-4 border-l-4 border-gray-300">
                              <h4 className="font-semibold text-gray-500 mb-2 text-center">Page Script</h4>
                              <p className="text-gray-400 text-center">Waiting for generation...</p>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))
                  }
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>
          </div>
        )}

        {/* Loading State for Comic Generation */}
        {isGenerating && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
                <h3 className="text-xl font-semibold text-gray-800">Creating Your Comic Book</h3>
                <p className="text-gray-600">
                  {currentStatus || `Generating script and illustrations for "${topic}"...`}
                </p>
                {totalPages > 0 && (
                  <div className="max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{comicPages.length}/{totalPages} pages complete</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${(comicPages.length / totalPages) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
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
              <h3 className="font-semibold mb-2">Visual Stories</h3>
              <p className="text-sm text-gray-600">AI-generated visual descriptions that bring history to life</p>
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