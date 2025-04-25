"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Feedback = {
  id: string | number
  name: string
  email: string
  branch: string
  rating: number
  comment: string
  date: string
}

// Sample feedback data
const sampleFeedbackData = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    branch: "P. Mabolo",
    rating: 5,
    comment: "Excellent service! My car looks brand new. The staff was very professional and friendly.",
    date: "2023-04-15",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    branch: "Bacolod",
    rating: 4,
    comment: "Good service overall. Quick and efficient. Would recommend to friends.",
    date: "2023-04-14",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    branch: "Urgello",
    rating: 3,
    comment: "Average experience. The wash was good but had to wait longer than expected.",
    date: "2023-04-13",
  },
  {
    id: 4,
    name: "David Rodriguez",
    email: "david.rodriguez@example.com",
    branch: "P. Mabolo",
    rating: 5,
    comment: "Amazing service! The premium wash package was worth every penny.",
    date: "2023-04-12",
  },
  {
    id: 5,
    name: "Lisa Kim",
    email: "lisa.kim@example.com",
    branch: "Bacolod",
    rating: 2,
    comment: "Disappointed with the service. Found some spots that were missed.",
    date: "2023-04-11",
  },
  {
    id: 6,
    name: "John Smith",
    email: "john.smith@example.com",
    branch: "Urgello",
    rating: 1,
    comment:
      "Very poor service. Had to wait for over an hour despite having an appointment. The staff was rude and unprofessional.",
    date: "2023-04-10",
  },
  {
    id: 7,
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    branch: "P. Mabolo",
    rating: 5,
    comment:
      "Outstanding service! The staff went above and beyond to make sure my car was spotless. Will definitely come back!",
    date: "2023-04-09",
  },
]

export function FeedbackList() {
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([])
  const [selectedRating, setSelectedRating] = useState<string>("all")

  useEffect(() => {
    // In a real application, we would extract feedback from the database
    // For now, we'll use the sample data
    setFeedbackData(sampleFeedbackData)
  }, [])

  const filteredFeedback =
    selectedRating === "all"
      ? feedbackData
      : feedbackData.filter((feedback) => {
          if (selectedRating === "positive") return feedback.rating >= 4
          if (selectedRating === "neutral") return feedback.rating === 3
          if (selectedRating === "negative") return feedback.rating <= 2
          return true
        })

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-[#FFD000]"
    if (rating === 3) return "text-gray-500"
    return "text-black"
  }

  const getBranchColor = (branch: string) => {
    if (branch === "P. Mabolo") return "bg-gray-100 text-gray-800"
    if (branch === "Bacolod") return "bg-gray-100 text-gray-800"
    if (branch === "Urgello") return "bg-gray-100 text-gray-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={setSelectedRating} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#FFD000] data-[state=active]:text-black">
            All Feedback
          </TabsTrigger>
          <TabsTrigger value="positive" className="data-[state=active]:bg-[#FFD000] data-[state=active]:text-black">
            Positive
          </TabsTrigger>
          <TabsTrigger value="neutral" className="data-[state=active]:bg-[#FFD000] data-[state=active]:text-black">
            Neutral
          </TabsTrigger>
          <TabsTrigger value="negative" className="data-[state=active]:bg-[#FFD000] data-[state=active]:text-black">
            Negative
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredFeedback.map((feedback) => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                branchColor={getBranchColor(feedback.branch)}
                ratingColor={getRatingColor(feedback.rating)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="positive" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredFeedback.map((feedback) => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                branchColor={getBranchColor(feedback.branch)}
                ratingColor={getRatingColor(feedback.rating)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="neutral" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredFeedback.map((feedback) => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                branchColor={getBranchColor(feedback.branch)}
                ratingColor={getRatingColor(feedback.rating)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="negative" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredFeedback.map((feedback) => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                branchColor={getBranchColor(feedback.branch)}
                ratingColor={getRatingColor(feedback.rating)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FeedbackCard({
  feedback,
  branchColor,
  ratingColor,
}: { feedback: Feedback; branchColor: string; ratingColor: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="p-4 hover:shadow-md transition-shadow bg-white border-gray-200">
      <div className="flex flex-col space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>
                {feedback.name.charAt(0)}
                {feedback.name.split(" ")[1]?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{feedback.name}</p>
              <div className="flex items-center">
                <p className="text-xs text-gray-500 mr-2">{feedback.email}</p>
                <Badge variant="outline" className={branchColor}>
                  {feedback.branch}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={i < feedback.rating ? "#FFD000" : "none"}
                  stroke={i < feedback.rating ? "#FFD000" : "currentColor"}
                  className={`h-4 w-4 ${ratingColor}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-.181h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-500">{new Date(feedback.date).toLocaleDateString()}</span>
          </div>
        </div>
        <p className={`text-sm ${expanded ? "" : "line-clamp-2"}`}>{feedback.comment}</p>
        {feedback.comment.length > 100 && (
          <Button variant="ghost" size="sm" className="w-fit text-xs" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Show less" : "Read more"}
          </Button>
        )}
        <div className="flex justify-end space-x-2 mt-2">
          <Button variant="outline" size="sm" className="bg-[#FFD000] text-black hover:bg-[#FFDA44]">
            Reply
          </Button>
          <Button variant="outline" size="sm" className="text-black">
            Flag
          </Button>
        </div>
      </div>
    </Card>
  )
}
