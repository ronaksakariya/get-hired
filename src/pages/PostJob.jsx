import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_TYPES, LOCATIONS, COMPANIES } from "@/data/const";
import { supabase } from "@/utils/supabase";
import useAuth from "@/context/useAuth";
import {
  Briefcase,
  Building,
  MapPin,
  Image as ImageIcon,
  Type,
  FileText,
} from "lucide-react";

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    company_id: "",
    location: "",
    type: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setError("You must be logged in to post a job");

    // Basic required check
    if (Object.values(formData).some((v) => !v.trim())) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: supabaseError } = await supabase
        .from("jobs")
        .insert([
          {
            ...formData,
            recruiter_id: user.id,
          },
        ])
        .select();

      if (supabaseError) throw supabaseError;

      // Upon success, redirect to the jobs list
      navigate("/jobs");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#000814] text-white pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-0">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
            Post a Job
          </h1>
          <p className="text-zinc-400 text-lg">
            Create a new job listing for candidates to discover.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-[#0d1117] p-6 md:p-8 rounded-2xl flex flex-col gap-6"
        >
          {/* Job Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Type className="w-4 h-4 text-zinc-500" />
              Job Title
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Frontend Engineer"
              className="h-12 bg-[#161b22] border-transparent focus-visible:border-blue-500 focus-visible:ring-0 text-white rounded-xl placeholder:text-zinc-500 px-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Building className="w-4 h-4 text-zinc-500" />
              Company
            </label>
            <Select
              value={formData.company_id}
              onValueChange={(val) => handleSelectChange("company_id", val)}
            >
              <SelectTrigger className="w-full h-12 bg-[#161b22] border-none text-white rounded-xl focus:ring-blue-500/50">
                <SelectValue placeholder="Select your company..." />
              </SelectTrigger>
              <SelectContent className="bg-[#161b22] border-none text-zinc-200">
                <SelectGroup>
                  {COMPANIES.map((company) => (
                    <SelectItem
                      key={company.id}
                      value={company.id}
                      className="focus:bg-white/10 focus:text-white cursor-pointer"
                    >
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-500" />
                Location
              </label>
              <Select
                value={formData.location}
                onValueChange={(val) => handleSelectChange("location", val)}
              >
                <SelectTrigger className="w-full h-12 bg-[#161b22] border-none text-white rounded-xl focus:ring-blue-500/50">
                  <SelectValue placeholder="Select location..." />
                </SelectTrigger>
                <SelectContent className="bg-[#161b22] border-none text-zinc-200">
                  <SelectGroup>
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
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-zinc-500" />
                Job Type
              </label>
              <Select
                value={formData.type}
                onValueChange={(val) => handleSelectChange("type", val)}
              >
                <SelectTrigger className="w-full h-12 bg-[#161b22] border-none text-white rounded-xl focus:ring-blue-500/50">
                  <SelectValue placeholder="Select job type..." />
                </SelectTrigger>
                <SelectContent className="bg-[#161b22] border-none text-zinc-200">
                  <SelectGroup>
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
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-500" />
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="w-full min-w-0 rounded-xl bg-[#161b22] border border-transparent px-4 py-3 text-white transition-colors outline-none placeholder:text-zinc-500 focus-visible:border-blue-500 resize-y"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto self-end mt-4 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl font-semibold transition-all h-12 px-8 cursor-pointer tracking-wide"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Posting...
              </div>
            ) : (
              "Post Job"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
