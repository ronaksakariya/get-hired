import { useState } from "react";
import { supabase } from "@/utils/supabase";
import useAuth from "@/context/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ApplyJobDialog = ({ isOpen, onOpenChange, jobId, jobTitle, companyName, onApplied }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ experience: "", skills: "", education: "" });
  const [resumeFile, setResumeFile] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState(null);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return;
    setApplyError(null);
    setApplyLoading(true);

    try {
      let resume_url = null;
      if (resumeFile) {
        const fileExt = resumeFile.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("resumes")
          .upload(fileName, resumeFile);

        if (uploadError) throw new Error("Resume upload failed: " + uploadError.message);
        resume_url = uploadData.path;
      }

      const { error: insertError } = await supabase.from("applications").insert([
        {
          job_id: jobId,
          candidate_id: user.id,
          experience: Number(formData.experience) || 0,
          skills: formData.skills,
          education: formData.education,
          resume_url,
          status: "applied",
        },
      ]);

      if (insertError) {
        if (insertError.code === "23505") throw new Error("You have already applied for this job!");
        throw new Error(insertError.message);
      }

      setApplySuccess(true);
      if (onApplied) onApplied();
      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      setApplyError(err.message || "Something went wrong.");
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-zinc-800 bg-[#000814] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Apply for {jobTitle}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Submit your application to {companyName}. Make sure your resume is up to date.
          </DialogDescription>
        </DialogHeader>

        {applySuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CircleCheck className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Application Submitted!</h3>
            <p className="text-zinc-400">The recruiter will review your profile shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-5 mt-4">
            {applyError && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                {applyError}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Years of Experience</label>
              <Input
                type="number"
                required
                min="0"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g. 3"
                className="bg-[#161b22] border-transparent focus-visible:border-blue-500 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Key Skills</label>
              <Input
                required
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g. React, Node.js, Postgres"
                className="bg-[#161b22] border-transparent focus-visible:border-blue-500 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Education</label>
              <Input
                required
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="e.g. BS Computer Science"
                className="bg-[#161b22] border-transparent focus-visible:border-blue-500 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Resume (PDF)</label>
              <Input
                type="file"
                accept=".pdf"
                required
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="bg-[#161b22] border-transparent focus-visible:border-blue-500 text-zinc-400 file:text-white file:bg-zinc-800 file:border-0 file:rounded-md file:px-4 file:py-1 hover:file:bg-zinc-700 cursor-pointer"
              />
            </div>
            <Button
              type="submit"
              disabled={applyLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl mt-6"
            >
              {applyLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplyJobDialog;
