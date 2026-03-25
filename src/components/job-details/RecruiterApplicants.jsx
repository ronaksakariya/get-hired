import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const RecruiterApplicants = ({ jobId }) => {
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isApplicantOpen, setIsApplicantOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchApplicants = async () => {
      setApplicantsLoading(true);
      const { data: appsData, error: appsError } = await supabase
        .from("applications")
        .select("*")
        .eq("job_id", jobId);

      if (appsError) {
        console.error("Error fetching applications:", appsError);
      } else if (appsData && appsData.length > 0) {
        const candidateIds = appsData.map((app) => app.candidate_id);
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", candidateIds);

        const profilesMap = new Map((profilesData || []).map((p) => [p.id, p]));
        const mergedApps = appsData.map((app) => ({
          ...app,
          profiles: profilesMap.get(app.candidate_id) || { full_name: "Unknown Candidate" },
        }));

        if (isMounted) setApplicants(mergedApps);
      } else {
        if (isMounted) setApplicants([]);
      }
      if (isMounted) setApplicantsLoading(false);
    };

    fetchApplicants();

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  return (
    <>
      <div id="applicants-section" className="max-w-4xl mx-auto mt-8 bg-[#0d1117] rounded-3xl p-6 md:p-10 border border-white/5">
        <h2 className="text-2xl font-bold mb-6">Applicants ({applicants.length})</h2>
        {applicantsLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : applicants.length === 0 ? (
          <p className="text-zinc-500 text-center py-8">No applications received yet.</p>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => (
              <div
                key={app.id}
                className="bg-[#161b22] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-transparent hover:border-white/10 transition-colors"
              >
                <div>
                  <p className="font-semibold text-lg">{app.profiles?.full_name || "Unknown Candidate"}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="bg-[#000814] text-zinc-400 border-none">
                      {app.experience} yrs exp
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`capitalize border-none ${
                        app.status === "rejected"
                          ? "bg-red-600/20 text-red-500"
                          : app.status === "hired"
                            ? "bg-emerald-600/20 text-emerald-500"
                            : app.status === "interviewing"
                              ? "bg-amber-600/20 text-amber-500"
                              : "bg-blue-600/20 text-blue-500"
                      }`}
                    >
                      {app.status}
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setSelectedApplicant(app);
                    setIsApplicantOpen(true);
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg px-6 h-10 border-none shrink-0"
                >
                  Review Candidate
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isApplicantOpen} onOpenChange={setIsApplicantOpen}>
        <DialogContent className="sm:max-w-[600px] border-zinc-800 bg-[#000814] text-white overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Applicant Profile</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Review candidate details and update their status.
            </DialogDescription>
          </DialogHeader>

          {selectedApplicant && (
            <div className="space-y-6 mt-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                  <h3 className="text-xl font-bold">{selectedApplicant.profiles?.full_name || "Unknown"}</h3>
                  <p className="text-zinc-400 mt-1">{selectedApplicant.experience} Years of Experience</p>
                </div>
                <Select
                  value={selectedApplicant.status}
                  onValueChange={async (newStatus) => {
                    const previousApps = [...applicants];
                    setApplicants(
                      applicants.map((a) => (a.id === selectedApplicant.id ? { ...a, status: newStatus } : a))
                    );
                    setSelectedApplicant({ ...selectedApplicant, status: newStatus });

                    const { error } = await supabase
                      .from("applications")
                      .update({ status: newStatus })
                      .eq("id", selectedApplicant.id);

                    if (error) {
                      console.error("Failed to update status", error);
                      setApplicants(previousApps);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px] h-10 bg-[#161b22] border-none text-white rounded-lg focus:ring-blue-500/50 capitalize">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#161b22] border-none text-zinc-200">
                    <SelectGroup>
                      <SelectItem value="applied" className="focus:bg-white/10 focus:text-white cursor-pointer">Applied</SelectItem>
                      <SelectItem value="interviewing" className="focus:bg-white/10 focus:text-white cursor-pointer text-amber-400">Interviewing</SelectItem>
                      <SelectItem value="hired" className="focus:bg-white/10 focus:text-white cursor-pointer text-emerald-400">Hired</SelectItem>
                      <SelectItem value="rejected" className="focus:bg-white/10 focus:text-white cursor-pointer text-red-400">Rejected</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Education</h4>
                <p className="bg-[#161b22] p-4 rounded-xl text-zinc-200">{selectedApplicant.education}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Skills</h4>
                <p className="bg-[#161b22] p-4 rounded-xl text-zinc-200 leading-relaxed">{selectedApplicant.skills}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Resume Document</h4>
                {selectedApplicant.resume_url ? (
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const { data, error } = await supabase.storage
                        .from("resumes")
                        .createSignedUrl(selectedApplicant.resume_url, 60);
                      if (data) window.open(data.signedUrl, "_blank");
                      else console.error("Error generating signed url", error);
                    }}
                    className="w-full h-12 border-blue-500/30 text-white hover:bg-blue-700 hover:text-blue-300 bg-blue-600"
                  >
                    Open Resume PDF
                  </Button>
                ) : (
                  <p className="text-zinc-500 italic p-4 bg-[#161b22] rounded-xl text-center border border-white/5">
                    No resume uploaded.
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecruiterApplicants;
