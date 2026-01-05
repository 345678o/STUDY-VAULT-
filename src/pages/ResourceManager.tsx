import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, FileText, Link as LinkIcon, Trash2, Download, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  resource_type: string;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  tags: string[] | null;
  created_at: string;
}

const ResourceManager = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [resourceType, setResourceType] = useState("document");
  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from("academic_resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let fileUrl = linkUrl;
      let fileName = null;
      let fileSize = null;

      // Upload file if provided
      if (file && resourceType === "document") {
        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("study-materials")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("study-materials")
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
        fileName = file.name;
        fileSize = file.size;
      }

      // Insert resource
      const { error: insertError } = await supabase
        .from("academic_resources")
        .insert({
          user_id: user.id,
          title,
          description,
          subject,
          resource_type: resourceType,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: "Resource added successfully",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setSubject("");
      setResourceType("document");
      setFile(null);
      setLinkUrl("");
      setIsDialogOpen(false);
      fetchResources();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, fileUrl: string | null) => {
    try {
      // Delete file from storage if exists
      if (fileUrl && fileUrl.includes("study-materials")) {
        const filePath = fileUrl.split("/study-materials/")[1];
        await supabase.storage.from("study-materials").remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from("academic_resources")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });

      fetchResources();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Resources</h1>
            <p className="text-foreground/70">Manage your study materials and academic resources</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Resource</DialogTitle>
                  <DialogDescription>
                    Upload a document or add a link to your study materials
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g., Chemistry Notes Chapter 5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Chemistry, Mathematics"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of the resource"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Resource Type *</Label>
                    <Select value={resourceType} onValueChange={setResourceType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document/PDF</SelectItem>
                        <SelectItem value="link">Web Link</SelectItem>
                        <SelectItem value="note">Note</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {resourceType === "document" && (
                    <div>
                      <Label htmlFor="file">Upload File</Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Accepted formats: PDF, DOC, DOCX, TXT, PPT, PPTX
                      </p>
                    </div>
                  )}

                  {(resourceType === "link" || resourceType === "video") && (
                    <div>
                      <Label htmlFor="link">URL *</Label>
                      <Input
                        id="link"
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://example.com/resource"
                        required
                      />
                    </div>
                  )}

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={uploading}>
                      {uploading ? "Adding..." : "Add Resource"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : resources.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No resources yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your study library by adding your first resource
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Add Your First Resource
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                      {resource.subject && (
                        <CardDescription className="mt-1">{resource.subject}</CardDescription>
                      )}
                    </div>
                    {resource.resource_type === "link" ? (
                      <LinkIcon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {resource.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                  )}
                  {resource.file_size && (
                    <p className="text-xs text-muted-foreground mb-4">
                      Size: {formatFileSize(resource.file_size)}
                    </p>
                  )}
                  <div className="flex gap-2">
                    {resource.file_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.open(resource.file_url!, "_blank")}
                      >
                        <Download className="mr-2 h-3 w-3" />
                        {resource.resource_type === "link" ? "Visit" : "Download"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(resource.id, resource.file_url)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceManager;
