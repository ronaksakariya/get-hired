import { useState, useMemo, useEffect, useCallback, memo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Briefcase, Search } from "lucide-react";
import { JOB_TYPES, LOCATIONS, COMPANIES } from "@/data/const";
import { supabase } from "@/utils/supabase";
import useAuth from "@/context/useAuth";

// Create a map for O(1) lookups outside the component
const companiesMap = new Map(COMPANIES.map((c) => [c.id, c]));

// Extract JobCard to its own memoized component to prevent unnecessary re-renders
const JobCard = memo(({ job, user, role }) => {
  const companyData = companiesMap.get(job.company_id) || {};

  return (
    <Card className="bg-[#0d1117] border-transparent hover:border-white/15 transition-all duration-300 group cursor-pointer flex flex-col rounded-2xl overflow-hidden hover:-translate-y-1">
      <CardHeader className="pb-4 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-gray-900 p-2.5 rounded-xl h-14 w-14 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
            <img
              src={companyData.logo || "/companies/amazon.svg"}
              alt={`${companyData.name || job.company_id} logo`}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-white transition-colors tracking-tight leading-tight">
          {job.title}
        </CardTitle>
        <p className="text-zinc-400 font-medium mt-1.5 text-sm">
          {companyData.name || job.company_id}
        </p>
      </CardHeader>

      <CardContent className="pb-6 grow">
        <div className="flex flex-wrap gap-2.5 mb-5">
          <Badge
            variant="secondary"
            className="bg-[#161b22] text-blue-400 hover:bg-white/10 border-none font-medium px-2.5 py-1 rounded-lg"
          >
            <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-80" />
            {job.location}
          </Badge>
          <Badge
            variant="secondary"
            className="bg-[#161b22] text-emerald-400 hover:bg-white/10 border-none font-medium px-2.5 py-1 rounded-lg"
          >
            <Briefcase className="w-3.5 h-3.5 mr-1.5 opacity-80" />
            {job.type}
          </Badge>
        </div>
        <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </CardContent>

      <CardFooter className="pt-0 pb-6 px-6 bg-transparent border-t-0">
        {user ? (
          role === "recruiter" ? (
            user.id === job.recruiter_id ? (
              <div className="flex gap-3 w-full">
                <Button
                  variant="secondary"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 border-white/20 text-white rounded-xl font-semibold h-12 tracking-wide"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 text-white hover:text-white rounded-xl font-semibold h-12 hover:bg-red-700 tracking-wide"
                >
                  Delete
                </Button>
              </div>
            ) : (
              <Button
                disabled
                className="w-full bg-zinc-800 text-zinc-400 border-none rounded-xl font-semibold h-12 cursor-not-allowed tracking-wide"
              >
                Recruiter View
              </Button>
            )
          ) : (
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl font-semibold transition-all h-12 cursor-pointer tracking-wide">
              Apply Now
            </Button>
          )
        ) : (
          <Button
            disabled
            className="w-full bg-zinc-800 text-zinc-400 border-none rounded-xl font-semibold transition-all h-12 cursor-not-allowed tracking-wide"
          >
            Login to Apply
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});
JobCard.displayName = "JobCard";

const Jobs = () => {
  const { user, role, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all-locations");
  const [jobTypeFilter, setJobTypeFilter] = useState("all-types");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    // Use isMounted to prevent setting state on unmounted component
    let isMounted = true;

    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        let query = supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (role === "recruiter" && user) {
          query = query.eq("recruiter_id", user.id);
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) throw supabaseError;
        if (isMounted) setJobs(data || []);
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching jobs:", err);
          setError("Failed to load jobs. Please try again later.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [user, role, authLoading]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setLocationFilter("all-locations");
    setJobTypeFilter("all-types");
  }, []);

  const filteredJobs = useMemo(() => {
    const lowerSearchQuery = searchQuery.toLowerCase();

    return jobs.filter((job) => {
      // Short-circuit evaluations:
      // Start with string matching which is fast and boolean comparisons
      const matchesLocation =
        locationFilter === "all-locations" || job.location === locationFilter;
      if (!matchesLocation) return false;

      const matchesType =
        jobTypeFilter === "all-types" || job.type === jobTypeFilter;
      if (!matchesType) return false;

      // Only perform string finding if the first two match, and if search query exists
      if (!lowerSearchQuery) return true;

      const companyData = companiesMap.get(job.company_id);
      const companyName = companyData ? companyData.name : job.company_id;

      return (
        job.title?.toLowerCase().includes(lowerSearchQuery) ||
        companyName?.toLowerCase().includes(lowerSearchQuery)
      );
    });
  }, [jobs, searchQuery, locationFilter, jobTypeFilter]);

  return (
    <div className="w-full bg-[#000814] text-white pt-6 pb-20">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
          Explore Jobs
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl">
          Find your next career opportunity from top companies. Search and
          filter to find the perfect match.
        </p>
      </div>

      {/* Filters Section */}
      {role !== "recruiter" && (
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10 bg-[#0d1117] p-4 md:p-5 rounded-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 " />
            <Input
              placeholder="Search by title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-[#161b22] border border-transparent focus-visible:border-blue-500 focus-visible:ring-0 text-white placeholder:text-zinc-500 rounded-xl text-base"
            />
          </div>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full md:w-[200px] h-12 bg-[#161b22] border-none text-white rounded-xl focus:ring-blue-500/50">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent className="bg-[#161b22] border-none text-zinc-200">
              <SelectGroup>
                <SelectItem value="all-locations">All Locations</SelectItem>
                {LOCATIONS.map((loc) => (
                  <SelectItem
                    key={loc}
                    value={loc}
                    className="focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    {loc}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
            <SelectTrigger className="w-full md:w-[200px] h-12 bg-[#161b22] border-none text-white rounded-xl focus:ring-blue-500/50">
              <SelectValue placeholder="All Job Types" />
            </SelectTrigger>
            <SelectContent className="bg-[#161b22] border-none text-zinc-200">
              <SelectGroup>
                <SelectItem value="all-types">All Job Types</SelectItem>
                {JOB_TYPES.map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            onClick={clearFilters}
            variant="ghost"
            className="h-12 px-6 border-none hover:bg-red-800 hover:text-white bg-transparent text-white rounded-xl cursor-pointer w-full md:w-auto font-medium transition-colors"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-[#0d1117] rounded-3xl flex flex-col items-center justify-center">
          <p className="text-red-400 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            Try Again
          </Button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-[#0d1117] rounded-3xl flex flex-col items-center justify-center">
          <Search className="h-12 w-12 text-zinc-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-white">
            No jobs found
          </h2>
          <p className="text-zinc-400">
            Try adjusting your search or clearing your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} user={user} role={role} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
