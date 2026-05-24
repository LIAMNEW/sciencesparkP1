import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExternalLink } from "lucide-react";

/**
 * Wraps any clickable element and shows a confirmation dialog before opening an external URL.
 * Usage: <ExternalLinkConfirm url="https://..."><div>click me</div></ExternalLinkConfirm>
 */
export default function ExternalLinkConfirm({ url, children, className }) {
  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  const handleConfirm = () => {
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  // Strip protocol for display
  const displayUrl = url?.replace(/^https?:\/\//, "").split("/")[0];

  return (
    <>
      <div onClick={handleClick} className={className} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(e); }}>
        {children}
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-blue-600" />
              Leaving ScienceSpark
            </AlertDialogTitle>
            <AlertDialogDescription>
              You're about to open an external website:
              <span className="block mt-2 font-medium text-gray-800 bg-gray-100 rounded px-3 py-1.5 text-sm">
                {displayUrl}
              </span>
              <span className="block mt-2">
                This site is not part of ScienceSpark. Make sure you have permission to visit external websites.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay in App</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Open External Site
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}