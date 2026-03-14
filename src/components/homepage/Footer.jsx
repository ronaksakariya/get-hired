import { Link } from "react-router-dom";
import { Briefcase, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#000814] border-t border-gray-800 text-gray-400">
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Hirrd Logo" className="h-8 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              Connecting talent with opportunity. Find your dream job or the
              perfect candidate — all in one place.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              For Job Seekers
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Browse Jobs", to: "/jobs" },
                { label: "Saved Jobs", to: "/saved-jobs" },
                { label: "My Applications", to: "/my-jobs" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              For Employers
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Post a Job", to: "/post-job" },
                { label: "Manage Listings", to: "/my-jobs" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-gray-500 shrink-0" />
                <a
                  href="mailto:support@hirrd.com"
                  className="hover:text-white transition-colors duration-200"
                >
                  support@hirrd.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Briefcase size={15} className="text-gray-500 shrink-0" />
                <span>Careers at Hirrd</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© {currentYear} Hirrd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="hover:text-gray-400 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-gray-400 transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
