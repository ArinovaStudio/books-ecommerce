"use client";

import { Card } from "@/components/ui/card";
import { MapPin, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
// import { schools } from "@/data/demodata";
import Image from "next/image";
import SchoolSearch from "@/components/schoolSearch";
type School = {
  id: string;
  name: string;
  address: string;
  image: string;
  board?: string;
  status: string;
};
export default function SchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/schools");
        const data = await response.json();

        if (data.success) {
          const filtered_schools = data.schools.filter(
            (school: School) => school.status === "ACTIVE"
          );
          setSchools(filtered_schools);
          // console.log(filtered_schools);
          setCities([...new Set(filtered_schools.map((s: School) => s.address))] as any)
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);
  // const cities = [...new Set(schools.map((s) => s.city))];

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  /* Debounce search */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  /* Filter logic */
  const filteredSchools = schools.filter((s: School) => {
    const q = debouncedQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q);
  });

  return (
    <section className="min-h-screen bg-[#f7f4f2]">
      <div className="bg-[linear-gradient(135deg,#141f38_0%,#22345e_50%,#1f5c7a_100%)] w-full text-white max-md:px-5 md:px-30 py-15">
        {/* Title */}
        <h1 className="text-4xl md:text-4xl font-bold">Find Your School</h1>
        <p className="mt-3 text-md text-gray-200">
          Search for your child's school to browse available book bundles and
          stationery kits.
        </p>

        {/* Search Bar (REUSED COMPONENT) */}
        <SchoolSearch
          value={query}
          onChange={setQuery}
          results={filteredSchools}
          placeholder="Search by school name, city, or pincode..."
          className="mt-10 w-full md:max-w-3xl text-black"
        />
      </div>
      {/* MAIN CONTENT */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-10 space-y-12">
          {filteredSchools.length === 0 && (
            <p className="text-center text-gray-500 mt-20 text-lg">
              No schools found
            </p>
          )}
          {cities.map((address) => {
            const citySchools = filteredSchools.filter(
              (s: School) => s.address === address
            );

            if (citySchools.length === 0) return null;

            return (
              <div key={address} className="space-y-5">
                {/* CITY HEADER */}
                <div className="flex items-center gap-2 max-md:mx-4">
                  <MapPin size={18} className="text-blue-900" />
                  <h2 className="text-xl font-semibold text-blue-950">
                    {address}
                  </h2>
                  <span className="text-gray-500 text-sm font-medium">
                    ({citySchools.length} Schools)
                  </span>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-md:mx-4">
                  {citySchools.map((school: School) => (
                    <Link key={school.id} href={`/schools/${school.id}`}>
                      <Card className="flex flex-row justify-between p-6 rounded-2xl bg-white shadow-sm border hover:shadow-md transition cursor-pointer hover:-translate-y-1 group">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden group-hover:bg-gray-200">
                            <Image
                              src={school.image || "/school.jpg"}
                              alt={school.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-blue-950">
                              {school.name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                              <MapPin size={14} />
                              {school.address}
                            </div>
                          </div>
                        </div>

                        <ChevronRight
                          size={22}
                          className="text-gray-500 group-hover:translate-x-1 transition"
                        />
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
