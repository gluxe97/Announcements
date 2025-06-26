"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"


// Mock data for announcements
const initialAnnouncements = [
  {
    id: 1,
    title: "Safety Notice",
    text: "Do not be mean to sparrow or it can retaliate and attempt to hit you",
    image: null,
    totalEmployees: 4,
    acknowledgedEmployees: 0,
    acknowledgedBy: [],
  },
  {
    id: 2,
    title: "Policy Update",
    text: "New remote work policy effective immediately. Please review the updated guidelines in your employee handbook.",
    image: null,
    totalEmployees: 8,
    acknowledgedEmployees: 8,
    acknowledgedBy: [
      "John Smith",
      "Sarah Johnson",
      "Mike Davis",
      "Emily Brown",
      "David Wilson",
      "Lisa Garcia",
      "Tom Anderson",
      "Maria Rodriguez",
    ],
  },
  {
    id: 3,
    title: "Team Building Event",
    text: "Join us for our quarterly team building event next Friday at 3 PM in the main conference room.",
    image: null,
    totalEmployees: 8,
    acknowledgedEmployees: 8,
    acknowledgedBy: [
      "John Smith",
      "Sarah Johnson",
      "Mike Davis",
      "Emily Brown",
      "David Wilson",
      "Lisa Garcia",
      "Tom Anderson",
      "Maria Rodriguez",
    ],
  },
]

// Mock employee list
const employees = [
  "Gabriel Navar",
  "Waylon Cargile",
  "Marvin Trujillo",
  "Matheu Shepherd"
]

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [selectedEmployees, setSelectedEmployees] = useState({})
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)

  // Separate current and previous announcements
  const currentAnnouncements = announcements.filter((ann) => ann.acknowledgedEmployees < ann.totalEmployees)
  const previousAnnouncements = announcements.filter((ann) => ann.acknowledgedEmployees >= ann.totalEmployees)

  const handleAcknowledge = (announcementId) => {
    const selectedEmployee = selectedEmployees[announcementId]
    if (!selectedEmployee) return

    setAnnouncements((prev) =>
      prev.map((ann) => {
        if (ann.id === announcementId && !ann.acknowledgedBy.includes(selectedEmployee)) {
          return {
            ...ann,
            acknowledgedEmployees: ann.acknowledgedEmployees + 1,
            acknowledgedBy: [...ann.acknowledgedBy, selectedEmployee],
          }
        }
        return ann
      }),
    )
  }

  const handleEmployeeSelect = (announcementId, employee) => {
    setSelectedEmployees((prev) => ({
      ...prev,
      [announcementId]: employee,
    }))
  }

  const nextSlide = () => {
    setCurrentCarouselIndex((prev) => (prev === previousAnnouncements.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentCarouselIndex((prev) => (prev === 0 ? previousAnnouncements.length - 1 : prev - 1))
  }

  const AnnouncementCard = ({ announcement, isPrevious = false }) => {
    const progressPercentage = (announcement.acknowledgedEmployees / announcement.totalEmployees) * 100
    const isFullyAcknowledged = announcement.acknowledgedEmployees >= announcement.totalEmployees
    const selectedEmployee = selectedEmployees[announcement.id]
    const hasEmployeeAcknowledged = selectedEmployee && announcement.acknowledgedBy.includes(selectedEmployee)

    const cardClasses = `border-4 rounded-3xl shadow-lg transition-all duration-300 ${
      isFullyAcknowledged
        ? "border-blue-400 shadow-blue-400/50 shadow-2xl"
        : "border-orange-400 shadow-orange-400/50 shadow-2xl"
    }`

    return (
      <Card className={cardClasses}>
        <CardContent className="p-8">
          {/* Progress bar - only show for current announcements */}
          {!isPrevious && (
            <div className="mb-6">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-sm text-gray-600 mt-2 text-center">
                {announcement.acknowledgedEmployees} of {announcement.totalEmployees} employees have acknowledged
              </p>
            </div>
          )}

          {/* Announcement content */}
          <div className="text-center mb-8">
            {/* Conditional image display */}
            {announcement.image && (
              <div className="mb-6 flex justify-center">
                <div className="border-4 border-black rounded-lg p-2 bg-yellow-100">
                  <Image
                    src={announcement.image || "/placeholder.svg"}
                    alt="Announcement illustration"
                    width={300}
                    height={300}
                    className="rounded"
                  />
                </div>
              </div>
            )}

            {/* Announcement text */}
            <p className="text-xl font-medium text-gray-800 leading-relaxed">{announcement.text}</p>
          </div>

          {/* Bottom section - only show for current announcements */}
          {!isPrevious && (
            <>
              <div className="flex items-center gap-4 bg-black rounded-full p-2">
                {/* Employee selector */}
                <div className="flex-1">
                  <Select
                    value={selectedEmployee || ""}
                    onValueChange={(value) => handleEmployeeSelect(announcement.id, value)}
                    disabled={hasEmployeeAcknowledged}
                  >
                    <SelectTrigger className="bg-white border-0 rounded-full text-lg font-medium h-12">
                      <SelectValue placeholder="Name/username" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees
                        .filter((emp) => !announcement.acknowledgedBy.includes(emp))
                        .map((employee) => (
                          <SelectItem key={employee} value={employee}>
                            {employee}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Acknowledge button */}
                <Button
                  onClick={() => handleAcknowledge(announcement.id)}
                  disabled={!selectedEmployee || hasEmployeeAcknowledged}
                  className="bg-gray-300 hover:bg-gray-200 text-black rounded-full px-8 h-12 text-lg font-medium border-0"
                >
                  {hasEmployeeAcknowledged ? "Acknowledged" : "Acknowledge"}
                </Button>
              </div>

              {hasEmployeeAcknowledged && (
                <p className="text-center text-green-600 font-medium mt-4">
                  Thank you for acknowledging this announcement!
                </p>
              )}
            </>
          )}

          {/* Previous announcement indicator */}
          {isPrevious && (
            <div className="text-center">
              <p className="text-blue-600 font-medium">✓ Fully Acknowledged</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Page Title */}
        <h1 className='text-7xl text-center font-bold mb-8 text-black '>Announcements</h1>

        {/* Current Announcements */}
        <div className="space-y-8 mb-12">
          {currentAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>

        {/* Previous Announcements Section */}
        {previousAnnouncements.length > 0 && (
          <div className="mt-16">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-700">Previous Announcements</h2>

            <div className="relative">
              {/* Carousel Container */}
              <div className="overflow-hidden rounded-3xl">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentCarouselIndex * 100}%)` }}
                >
                  {previousAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="w-full flex-shrink-0 px-4">
                      <AnnouncementCard announcement={announcement} isPrevious={true} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Navigation */}
              {previousAnnouncements.length > 1 && (
                <>
                  <Button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-lg"
                    size="icon"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>

                  <Button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-lg"
                    size="icon"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Carousel Indicators */}
              {previousAnnouncements.length > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {previousAnnouncements.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCarouselIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentCarouselIndex ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
