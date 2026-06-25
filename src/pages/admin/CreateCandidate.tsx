import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  FileText,
  Globe,
  Instagram,
  Twitter,
  ChevronDown,
  ChevronUp,
  Sparkles,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { positions, elections, candidates, saveCandidates, type Candidate } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function CreateCandidate() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState("");
  const [electionId, setElectionId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [bio, setBio] = useState("");
  const [campaignMessage, setCampaignMessage] = useState("");
  const [funFact, setFunFact] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  // Media states (storing URL preview strings)
  const [photoUrl, setPhotoUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<{ name: string; size: string } | null>(null);

  // Collapsible section state
  const [socialsOpen, setSocialsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get active election type for rendering styles (circle vs square previews)
  const selectedElection = elections.find((e) => e.id === electionId);
  const isAwards = selectedElection?.type === "Campus Awards";

  // Filter positions based on selected election
  const filteredPositions = positions.filter((pos) => {
    if (!electionId) return false;
    return selectedElection?.positionIds.includes(pos.id);
  });

  // Reset positionId when election changes
  useEffect(() => {
    setPositionId("");
  }, [electionId]);

  const readAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Handle profile photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG/JPG/WEBP)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }
    setPhotoUrl(await readAsDataUrl(file));
    toast.success("Profile photo uploaded!");
  };

  // Handle poster upload
  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG/JPG/WEBP)");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Poster must be less than 3MB");
      return;
    }
    setPosterUrl(await readAsDataUrl(file));
    toast.success("Campaign poster uploaded!");
  };

  // Handle PDF upload with validations
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF documents are allowed for the manifesto");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Manifesto size must be less than 5MB");
      return;
    }
    setPdfFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
    });
    toast.success("Manifesto PDF uploaded and validated!");
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!electionId) {
      toast.error("Please select an election event");
      return;
    }
    if (!positionId) {
      toast.error("Please select a position/category");
      return;
    }
    if (bio.length > 500) {
      toast.error("Biography exceeds 500 characters");
      return;
    }
    if (campaignMessage.length > 120) {
      toast.error("Campaign message exceeds 120 characters");
      return;
    }

    setIsSubmitting(true);

    // Simulate saving candidate
    setTimeout(() => {
      const newCandidate: Candidate = {
        id: `c-${positionId}-${Date.now()}`,
        name,
        positionId,
        electionId,
        bio,
        campaignMessage,
        photo:
          photoUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E3A5F&color=fff&bold=true&size=256`,
        votes: 0,
        poster: posterUrl || undefined,
        manifesto: pdfFile ? pdfFile.name : undefined,
        funFact: isAwards ? funFact : undefined,
        instagram: instagram.trim() ? instagram.trim() : undefined,
        twitter: twitter.trim() ? twitter.trim() : undefined,
        status,
      };

      candidates.push(newCandidate);
      saveCandidates();
      setIsSubmitting(false);
      toast.success("Candidate added successfully!");
      navigate("/admin/candidates");
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Add New Candidate / Nominee</h1>
        <p className="text-muted-foreground mt-1">
          Create a public profile, upload graphics, and link social media.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT PANEL: Media Uploads (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6">
            <h2 className="font-bold text-lg border-b border-border pb-3">Media & Attachments</h2>

            {/* Profile Photo Upload */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Profile Photo</Label>
              <div className="flex flex-col items-center p-4 rounded-xl border border-dashed border-border hover:border-brand/40 bg-muted/20 transition-all">
                <div className="relative mb-4">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Profile preview"
                      className={`w-28 h-28 object-cover shadow-md ${
                        isAwards
                          ? "rounded-[24px] ring-4 ring-[#F4C430]/30"
                          : "rounded-full ring-4 ring-brand/10"
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-28 h-28 bg-muted flex flex-col items-center justify-center text-muted-foreground border border-border shadow-inner ${
                        isAwards ? "rounded-[24px]" : "rounded-full"
                      }`}
                    >
                      <User className="w-8 h-8" />
                      <span className="text-[10px] mt-1">No Image</span>
                    </div>
                  )}
                  {photoUrl && (
                    <button
                      onClick={() => setPhotoUrl("")}
                      className="absolute -top-1 -right-1 bg-danger text-white rounded-full p-1 shadow-md hover:bg-danger/90"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold"
                >
                  <Upload className="w-3.5 h-3.5 mr-1" /> Select Profile Picture
                </Button>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Recommended size: 500x500px. JPG, PNG, WEBP.
                </p>
              </div>
            </div>

            {/* Campaign Poster Upload */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Campaign Poster (Landscape)</Label>
              <div className="flex flex-col items-center p-4 rounded-xl border border-dashed border-border hover:border-brand/40 bg-muted/20 transition-all">
                {posterUrl ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border mb-3 shadow-sm">
                    <img
                      src={posterUrl}
                      alt="Poster preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setPosterUrl("")}
                      className="absolute top-2 right-2 bg-danger text-white rounded-full p-1 shadow-md hover:bg-danger/90"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-muted border border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground mb-3 shadow-inner">
                    <ImageIcon className="w-8 h-8 text-muted-foreground/60" />
                    <span className="text-[11px] mt-1 font-medium">Add Landscape Poster</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={posterInputRef}
                  accept="image/*"
                  onChange={handlePosterUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => posterInputRef.current?.click()}
                  className="text-xs font-semibold"
                >
                  <Upload className="w-3.5 h-3.5 mr-1" /> Choose Poster Image
                </Button>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Recommended ratio: 16:9. JPG, PNG.
                </p>
              </div>
            </div>

            {/* PDF Manifesto Upload */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Manifesto Document (PDF)</Label>
              {pdfFile ? (
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-brand/5 shadow-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{pdfFile.name}</p>
                      <p className="text-[10px] text-muted-foreground">{pdfFile.size}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-danger hover:bg-danger/5"
                    onClick={() => setPdfFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center p-4 rounded-xl border border-dashed border-border hover:border-brand/40 bg-muted/20 transition-all">
                  <input
                    type="file"
                    ref={pdfInputRef}
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pdfInputRef.current?.click()}
                    className="text-xs font-semibold"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" /> Select Manifesto PDF
                  </Button>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Valid PDF format up to 5MB.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Form Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft space-y-5">
            <h2 className="font-bold text-lg border-b border-border pb-3">Candidate Information</h2>

            {/* Full Name */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Full Name <span className="text-danger">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samuel Adewale Boateng"
              />
            </div>

            {/* Event & Position */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Election / Event <span className="text-danger">*</span>
                </Label>
                <Select value={electionId} onValueChange={setElectionId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select election" />
                  </SelectTrigger>
                  <SelectContent>
                    {elections.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Position / Category <span className="text-danger">*</span>
                </Label>
                <Select value={positionId} onValueChange={setPositionId} disabled={!electionId}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={electionId ? "Select position" : "Choose event first"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPositions.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold">Biography</Label>
                <span
                  className={`text-[10px] ${bio.length > 500 ? "text-danger" : "text-muted-foreground"}`}
                >
                  {bio.length}/500 chars
                </span>
              </div>
              <Textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a brief background biography for the candidate..."
                maxLength={520}
              />
            </div>

            {/* Tagline / Campaign Slogan */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold">Campaign Message / Slogan</Label>
                <span
                  className={`text-[10px] ${campaignMessage.length > 120 ? "text-danger" : "text-muted-foreground"}`}
                >
                  {campaignMessage.length}/120 chars
                </span>
              </div>
              <Input
                value={campaignMessage}
                onChange={(e) => setCampaignMessage(e.target.value)}
                placeholder="e.g. Reimagining student welfare and campus safety."
                maxLength={130}
              />
            </div>

            {/* Conditional Fun Fact (only for Campus Awards) */}
            {isAwards && (
              <div className="space-y-2 p-4 rounded-xl bg-[#F4C430]/5 border border-[#F4C430]/20 animate-fade-in">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#F4C430]">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  Campus Awards Nominee Fun Fact
                </div>
                <Label className="text-xs text-muted-foreground mt-1">
                  What is an interesting fact about this nominee?
                </Label>
                <Input
                  value={funFact}
                  onChange={(e) => setFunFact(e.target.value)}
                  placeholder="e.g. Can name all world capitals in under 2 minutes."
                  className="bg-card border-border hover:border-[#F4C430]/40 focus:border-[#F4C430]"
                />
              </div>
            )}

            {/* Collapsible Social Links */}
            <div className="border border-border/80 rounded-xl overflow-hidden shadow-sm bg-card">
              <button
                type="button"
                onClick={() => setSocialsOpen(!socialsOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-bold">Social Media Profiles</span>
                </div>
                {socialsOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {socialsOpen && (
                <div className="p-4 border-t border-border bg-muted/5 grid sm:grid-cols-2 gap-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                      Instagram handle
                    </Label>
                    <Input
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@username"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold flex items-center gap-1.5">
                      <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
                      Twitter handle
                    </Label>
                    <Input
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="@username"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Status Switch */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/10">
              <div>
                <Label className="text-sm font-bold block">Profile Status</Label>
                <span className="text-xs text-muted-foreground">
                  Inactive candidates will be hidden from ballot views.
                </span>
              </div>
              <div className="flex bg-muted p-1 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setStatus("active")}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    status === "active"
                      ? "bg-success text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("inactive")}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    status === "inactive"
                      ? "bg-danger text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/85 backdrop-blur-md p-4 flex justify-end gap-3 z-40 shadow-soft">
        <div className="max-w-6xl w-full mx-auto flex justify-end gap-3 px-4">
          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={() => navigate("/admin/candidates")}
            className="border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-brand text-white hover:bg-brand/90 px-6 font-bold shadow-md"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Saving Profile...
              </span>
            ) : (
              "Save Candidate Profile"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
