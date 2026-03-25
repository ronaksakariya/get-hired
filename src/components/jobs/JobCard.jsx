import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Briefcase } from "lucide-react";
import { COMPANIES } from "@/data/const";

const companiesMap = new Map(COMPANIES.map((c) => [c.id, c]));

const JobCard = memo(({ job, user, role }) => {
  const companyData = companiesMap.get(job.company_id) || {};
  const navigate = useNavigate();

  return (
    <Card 
      onClick={() => navigate(`/job/${job.id}`)}
      className="bg-[#0d1117] border-transparent hover:border-white/15 transition-all duration-300 group cursor-pointer flex flex-col rounded-2xl overflow-hidden hover:-translate-y-1"
    >
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
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/job/${job.id}`);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 border-none text-white rounded-xl font-semibold h-12 tracking-wide"
              >
                Manage Applicants
              </Button>
            ) : (
              <Button
                disabled
                onClick={(e) => e.stopPropagation()}
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

export default JobCard;
