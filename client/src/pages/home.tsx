"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Volume2, Palette, Download, Play, AlertTriangle, Sparkles, ShieldCheck, FileAudio, FileImage, CheckCircle } from "lucide-react"

export default function HistorySnap() {
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationType, setGenerationType] = useState<"audio" | "sketch" | null>(null)
  const [generatedContent, setGeneratedContent] = useState<{
    type: "audio" | "sketch"
    title: string
    content: string
    downloadUrl: string
  } | null>(null)
  const [error, setError] = useState("")
  const [showDownloadDialog, setShowDownloadDialog] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)

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

  const handleGenerate = async (type: "audio" | "sketch") => {
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
    setIsGenerating(true)
    setGenerationType(type)
    setGeneratedContent(null)

    // Simulate API call
    setTimeout(() => {
      setGeneratedContent({
        type,
        title: topic,
        content:
          type === "audio"
            ? `Educational audio story about ${topic} featuring historical facts and engaging narrative suitable for young learners.`
            : `Historical illustration of ${topic} with key historical facts and colorful, engaging artwork.`,
        downloadUrl: `#download-${type}-${Date.now()}`,
      })
      setIsGenerating(false)
      setGenerationType(null)
    }, 3000)
  }

  const handleSampleTopic = (sampleTopic: string) => {
    setTopic(sampleTopic)
    setError("")
  }

  const handleDownload = async () => {
    if (!generatedContent) return
    
    setIsDownloading(true)
    setDownloadComplete(false)
    
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false)
      setDownloadComplete(true)
      
      // Reset after 2 seconds
      setTimeout(() => {
        setDownloadComplete(false)
        setShowDownloadDialog(false)
      }, 2000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              HistorySnap
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform any historical topic into engaging audio stories or beautiful sketches in minutes!
          </p>
          <Badge variant="secondary" className="text-sm">
            Ages 10+ • Short stories • Free to use
          </Badge>
        </div>

        {/* Main Input Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-center">What history topic interests you?</CardTitle>
            <CardDescription className="text-center">
              Enter any historical topic and we'll create educational content just for you
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

            {/* Generation Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleGenerate("audio")}
                disabled={isGenerating || !topic.trim()}
                className="h-16 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg transform"
              >
                {isGenerating && generationType === "audio" ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Audio...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5 mr-2" />
                    Generate Audio
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleGenerate("sketch")}
                disabled={isGenerating || !topic.trim()}
                className="h-16 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg transform"
              >
                {isGenerating && generationType === "sketch" ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Sketch...
                  </>
                ) : (
                  <>
                    <Palette className="w-5 h-5 mr-2" />
                    Generate Sketch
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Content Preview */}
        {generatedContent && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {generatedContent.type === "audio" ? (
                    <Volume2 className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Palette className="w-5 h-5 text-purple-600" />
                  )}
                  {generatedContent.title}
                </CardTitle>
                <Badge variant={generatedContent.type === "audio" ? "default" : "secondary"}>
                  {generatedContent.type === "audio" ? "Audio" : "Sketch"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview Area */}
              {generatedContent.type === "audio" ? (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Volume2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{generatedContent.title}</h4>
                      <p className="text-sm text-gray-600">Educational Audio Story • 3-5 minutes</p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                        <div className="bg-blue-500 h-1 rounded-full" style={{ width: "0%" }}></div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center">
                      <Palette className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-600 font-medium">Historical Sketch Ready</p>
                  </div>
                </div>
              )}

              {/* Content Description */}
              <p className="text-gray-700 leading-relaxed">{generatedContent.content}</p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {generatedContent.type === "sketch" ? (
                  <Button
                    className="flex-1 hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg transform"
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                ) : null}
                <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size={generatedContent.type === "sketch" ? "lg" : "lg"}
                      className={`hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg transform hover:bg-gray-50 ${generatedContent.type === "audio" ? "flex-1" : ""}`}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {generatedContent?.type === "audio" ? (
                          <FileAudio className="w-5 h-5 text-blue-600" />
                        ) : (
                          <FileImage className="w-5 h-5 text-purple-600" />
                        )}
                        Download Your {generatedContent?.type === "audio" ? "Audio Story" : "Historical Sketch"}
                      </DialogTitle>
                      <DialogDescription>
                        Your {generatedContent?.type === "audio" ? "educational audio story" : "historical illustration"} about "{generatedContent?.title}" is ready to download.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      {/* File Details */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">File type:</span>
                          <span className="font-medium">
                            {generatedContent?.type === "audio" ? "MP3 Audio" : "PNG Image"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Size:</span>
                          <span className="font-medium">
                            {generatedContent?.type === "audio" ? "~2.5 MB" : "~1.8 MB"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Duration/Dimensions:</span>
                          <span className="font-medium">
                            {generatedContent?.type === "audio" ? "3-5 minutes" : "1920 x 1080px"}
                          </span>
                        </div>
                      </div>

                      {/* Download Progress */}
                      {isDownloading && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Preparing your download...</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: "70%" }}></div>
                          </div>
                        </div>
                      )}

                      {/* Success State */}
                      {downloadComplete && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Download completed successfully!</span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={handleDownload}
                          disabled={isDownloading || downloadComplete}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          {isDownloading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Downloading...
                            </>
                          ) : downloadComplete ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Downloaded
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Start Download
                            </>
                          )}
                        </Button>
                        
                        {!isDownloading && !downloadComplete && (
                          <Button
                            variant="outline"
                            onClick={() => setShowDownloadDialog(false)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>

                      {/* Usage Instructions */}
                      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                        <p className="font-medium mb-1">Usage Tips:</p>
                        <ul className="space-y-1">
                          {generatedContent?.type === "audio" ? (
                            <>
                              <li>• Perfect for listening during car rides or quiet time</li>
                              <li>• Compatible with any audio player or device</li>
                              <li>• Great for bedtime stories or educational breaks</li>
                            </>
                          ) : (
                            <>
                              <li>• Use for school projects or presentations</li>
                              <li>• Print for classroom displays or notebooks</li>
                              <li>• Share with friends and family for learning together</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading Spinner Overlay */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="w-96 bg-white/95 backdrop-blur border-0 shadow-2xl">
              <CardContent className="p-8 text-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
                  </div>
                  <div className="absolute -inset-4">
                    <div className="w-24 h-24 border-2 border-pink-100 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {generationType === "audio" ? "Creating Your Audio" : "Drawing Your Sketch"}
                  </h3>
                  <p className="text-gray-600">
                    {generationType === "audio"
                      ? "Our AI is crafting an educational audio story with historical facts and engaging narrative..."
                      : "Our AI is creating a beautiful historical illustration with key historical details..."}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>This usually takes 2-3 minutes</span>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center p-6 bg-white/60 backdrop-blur border-0 hover:bg-white/80 hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer">
            <Volume2 className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-sm">Educational Audio</h3>
            <p className="text-xs text-gray-600">
              Engaging stories with historical facts and age-appropriate content
            </p>
          </Card>

          <Card className="text-center p-6 bg-white/60 backdrop-blur border-0 hover:bg-white/80 hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer">
            <Palette className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-sm">Historical Sketches</h3>
            <p className="text-xs text-gray-600">
              Beautiful illustrations that bring history to life with vibrant colors
            </p>
          </Card>

          <Card className="text-center p-6 bg-white/60 backdrop-blur border-0 hover:bg-white/80 hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer">
            <ShieldCheck className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-sm">Safe Content</h3>
            <p className="text-xs text-gray-600">
              All content is filtered and designed for young learners
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
