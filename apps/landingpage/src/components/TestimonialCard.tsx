"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  img: string;
  illustration: string;
  onNext: () => void;
  onPrev: () => void;
  activeIdx: number;
  total: number;
}

export default function TestimonialCard({
  quote,
  author,
  role,
  img,
  illustration,
  onNext,
  onPrev,
  activeIdx,
  total
}: TestimonialCardProps) {
  return (
    <div className="bg-white border border-[#E7E7E7] rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[180px]">
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left quote text column */}
        <div className="md:col-span-8 space-y-4">
          <div className="text-[#E98BAE] font-serif text-5xl leading-none font-bold select-none h-6 text-left">
            “
          </div>
          <p className="text-[#4A4A4A] italic font-semibold leading-relaxed text-[11px] text-left">
            {quote}
          </p>
          {/* Author profile */}
          <div className="flex items-center gap-3">
            <img 
              src={img} 
              alt={author} 
              className="w-8 h-8 rounded-full object-cover border border-[#E7E7E7]" 
            />
            <div className="text-left">
              <h4 className="font-bold text-[10px] text-[#4A4A4A]">{author}</h4>
              <p className="text-[9px] text-zinc-400 font-bold leading-none">{role}</p>
            </div>
          </div>
        </div>

        {/* Right illustration column */}
        <div className="md:col-span-4 flex justify-center shrink-0">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-zinc-50">
            <img 
              src={illustration} 
              alt="Acolhimento Clinico" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>

      {/* Bottom control bar inside card */}
      <div className="flex justify-between items-center border-t border-[#E7E7E7] pt-4 mt-6">
        {/* Pagination Dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, dot) => (
            <span
              key={dot}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                activeIdx === dot ? "bg-[#8E7BBE]" : "bg-zinc-200"
              )}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-1">
          <button
            onClick={onPrev}
            className="w-7 h-7 rounded-full border bg-white flex items-center justify-center hover:bg-zinc-50 text-[#8E7BBE] border-[#E7E7E7] cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNext}
            className="w-7 h-7 rounded-full border bg-white flex items-center justify-center hover:bg-zinc-50 text-[#8E7BBE] border-[#E7E7E7] cursor-pointer transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
