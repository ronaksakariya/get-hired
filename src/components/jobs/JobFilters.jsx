import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { JOB_TYPES, LOCATIONS } from "@/data/const";

const JobFilters = ({
  searchQuery,
  setSearchQuery,
  locationFilter,
  setLocationFilter,
  jobTypeFilter,
  setJobTypeFilter,
  clearFilters,
}) => {
  return (
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
  );
};

export default JobFilters;
