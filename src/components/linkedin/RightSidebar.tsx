"use client"

import { Card } from "@/components/ui/card"
import { Info } from "lucide-react"

const newsItems = [
  { title: "Tech layoffs continue in 2024", readers: "2,145 readers" },
  { title: "AI adoption in enterprises", readers: "3,892 readers" },
  { title: "Remote work trends shift", readers: "1,567 readers" },
  { title: "Startup funding rebounds", readers: "2,934 readers" },
  { title: "Green tech investments rise", readers: "1,823 readers" },
]

export const RightSidebar = () => {
  return (
    <div className="space-y-4">
      {/* LinkedIn News */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">LinkedIn News</h2>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="space-y-3">
          {newsItems.map((item, index) => (
            <div key={index} className="cursor-pointer hover:bg-accent/50 -mx-2 px-2 py-1.5 rounded">
              <h3 className="text-sm font-semibold mb-0.5">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.readers}</p>
            </div>
          ))}
        </div>

        <button className="text-sm text-muted-foreground mt-3 hover:text-primary">
          Show more →
        </button>
      </Card>

      {/* Footer Links */}
      <div className="px-4">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <a href="#" className="hover:text-primary hover:underline">About</a>
          <a href="#" className="hover:text-primary hover:underline">Accessibility</a>
          <a href="#" className="hover:text-primary hover:underline">Help Center</a>
          <a href="#" className="hover:text-primary hover:underline">Privacy & Terms</a>
          <a href="#" className="hover:text-primary hover:underline">Ad Choices</a>
          <a href="#" className="hover:text-primary hover:underline">Advertising</a>
          <a href="#" className="hover:text-primary hover:underline">Business Services</a>
          <a href="#" className="hover:text-primary hover:underline">Get the LinkedIn app</a>
          <a href="#" className="hover:text-primary hover:underline">More</a>
        </div>
        
        <div className="mt-3 flex items-center gap-1">
          <div className="flex h-4 w-4 items-center justify-center rounded bg-primary text-primary-foreground text-[10px] font-bold">
            in
          </div>
          <span className="text-xs text-muted-foreground">LinkedIn Corporation © 2024</span>
        </div>
      </div>
    </div>
  )
}
