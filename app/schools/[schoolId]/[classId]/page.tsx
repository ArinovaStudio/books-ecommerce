"use client";

import React,{ useState } from "react";
import {
  Book,
  NotepadText,
  Pencil,
  ChevronDown,
  Atom,
  Landmark,
  Paintbrush,
} from "lucide-react";
import Header from "@/components/header";

interface PageProps {
  params:Promise<{schoolId:String,classId:String}>
}

const baseSections = [
  {
    id: "textbooks",
    title: "Textbooks",
    icon: <Book className="w-5 h-5 text-blue-600" />,
    items: ["Mathematics Book", "English Literature", "Environmental Science", "General Knowledge Book"],
  },
  {
    id: "notebooks",
    title: "Notebooks",
    icon: <NotepadText className="w-5 h-5 text-green-600" />,
    items: ["Maths Notebook", "English Notebook", "Science Notebook"],
  },
  {
    id: "stationery",
    title: "Stationery",
    icon: <Pencil className="w-5 h-5 text-purple-600" />,
    items: ["Pencils Pack", "Eraser & Sharpener", "Color Box", "Scale (30cm)"],
  },
];

//  Different Textbooks for Streams
const streamTextbooks: Record<string, string[]> = {
  science: ["Physics", "Chemistry", "Biology", "Mathematics"],
  commerce: ["Accountancy", "Business Studies", "Economics", "Mathematics"],
  arts: ["History", "Political Science", "Geography", "Psychology"],
};

// For dropdown options
const streams = [
  { id: "science", label: "Science", icon: <Atom className="w-4 h-4 text-blue-600" /> },
  { id: "commerce", label: "Commerce", icon: <Landmark className="w-4 h-4 text-green-600" /> },
  { id: "arts", label: "Arts", icon: <Paintbrush className="w-4 h-4 text-red-600" /> },
];

export default function ClassPage({params }: PageProps) {
    const { schoolId, classId} = React.use(params)
    const [openSection, setOpenSection] = useState<string | null>(null);
  const [stream, setStream] = useState<string>("");

  const isSenior = Number(classId) >= 11;

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  // ✨ Final merged sections for class 11–12 based on selected stream
  const seniorSections = [
    {
      id: "textbooks",
      title: "Textbooks",
      icon: <Book className="w-5 h-5 text-blue-600" />,
      items: stream ? streamTextbooks[stream] : [],
    },
    ...baseSections.slice(1), // notebooks + stationery unchanged
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}

      <div className="max-w-3xl mx-auto px-4 py-8">
        
        <h1 className="text-3xl font-bold text-blue-950">
          {schoolId.replace(/-/g, " ").toUpperCase()} – Class {classId}
        </h1>

        <p className="text-gray-600 mt-2">
          Select category to view available items.
        </p>

        {/* ⭐ STREAM DROPDOWN (Class 11–12 Only) */}
        {isSenior && (
          <div className="mt-6">
            <label className="block mb-2 font-medium text-gray-700">Select Stream</label>

            <div className="relative">
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="">-- Choose Stream --</option>
                {streams.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* No stream selected – show message */}
        {isSenior && !stream && (
          <p className="text-gray-500 mt-6">Please select a stream to view books.</p>
        )}

        {/* Accordion */}
        <div className="mt-6 space-y-4">
          {(isSenior ? seniorSections : baseSections).map((section) => (
            <div
              key={section.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h2 className="text-lg font-semibold text-blue-900">{section.title}</h2>
                </div>

                <ChevronDown
                  className={`w-6 h-6 text-gray-700 transition-transform duration-300 ${
                    openSection === section.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Accordion Body */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openSection === section.id
                    ? "max-h-96 opacity-100 mt-4"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-2 pl-1">
                  {section.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
