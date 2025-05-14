
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface UploadJobsButtonProps {
  onFileUpload: (file: File) => void;
}

const UploadJobsButton = ({ onFileUpload }: UploadJobsButtonProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
      <Upload className="mr-2 h-4 w-4" />
      Upload Jobs
      <input
        id="file-upload"
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />
    </Button>
  );
};

export default UploadJobsButton;
