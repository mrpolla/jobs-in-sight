
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Edit } from 'lucide-react';
import { toast } from 'sonner';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CoverLetterSectionProps {
  coverLetter: string | undefined;
  onUpdate?: (updatedCoverLetter: string) => void;
}

export default function CoverLetterSection({ 
  coverLetter, 
  onUpdate 
}: CoverLetterSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCoverLetter, setEditedCoverLetter] = useState(coverLetter || '');

  if (!coverLetter) {
    return null;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(isEditing ? editedCoverLetter : coverLetter);
    toast.success('Cover letter copied to clipboard');
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedCoverLetter);
    }
    setIsEditing(false);
    toast.success('Cover letter updated');
  };

  return (
    <Card className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
            <h3 className="text-lg font-medium">Cover Letter</h3>
            <Button variant="ghost" size="sm">
              {isOpen ? "Hide" : "Show"}
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <Textarea 
                    value={editedCoverLetter}
                    onChange={(e) => setEditedCoverLetter(e.target.value)}
                    className="min-h-[300px] font-serif text-base"
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setEditedCoverLetter(coverLetter);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-muted p-6 rounded-md whitespace-pre-wrap font-serif text-base leading-relaxed">
                    {coverLetter}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={copyToClipboard} 
                      className="flex items-center gap-1"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy to Clipboard
                    </Button>
                    {onUpdate && (
                      <Button 
                        onClick={() => setIsEditing(true)} 
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
