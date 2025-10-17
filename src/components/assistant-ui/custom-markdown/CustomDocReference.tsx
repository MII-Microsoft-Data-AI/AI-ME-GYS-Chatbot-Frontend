"use client";

/**
 * Component that handles markdown format
 * [doc-(....)]
 */

import { Download, FileTextIcon } from "lucide-react";
import { type FC, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChunkData, getDocChunkData } from "@/lib/integration/client/chunk";
import { useAssistantState } from "@assistant-ui/react";

// Props for the doc placeholder component
interface CustomDocReferenceProps {
  id: string;
  type: 'doc' | 'docsum';
  className?: string;
  onClick?: (id: string) => void;
}

const DownloadFileEnabled = false;

export const CustomDocReference: FC<CustomDocReferenceProps> = ({
  id,
  className,
  type,
  onClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ChunkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isRunning = useAssistantState(({ thread }) => thread.isRunning); // boolean

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data: undefined | ChunkData = undefined;
        data = await getDocChunkData(id)

        if (data) {
          setData(data);
        } else {
          setError('No data found');
        }
      } catch (err) {
        console.error('Error fetching chunk data:', err);
        setError('Failed to load document info');
      } finally {
        setLoading(false);
      }
    };

    if (!isRunning) fetchData();
  }, [id, type, isRunning]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick(id);
      return;
    }
    setIsOpen(true);
  };

  const handleDownload = () => {
    if (data && data.fileurl) {
      const link = document.createElement('a');
      link.href = data.fileurl;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const buttonText = loading ? 'Loading...' :
  data ? `${(data as ChunkData).filename}` :  
  `Doc: ${id}` 
    

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className={cn(
          "aui-link-placeholder inline-flex items-center gap-1 rounded-md bg-primary/5 px-2 py-1 text-sm font-medium text-primary/80 hover:bg-primary/10 hover:text-primary transition-colors border border-primary/15 hover:border-primary/25 mx-2", 
          loading && 'cursor-not-allowed opacity-60',
          className
        )}
        title={`Open document: ${id}`}
      >
        <FileTextIcon className="h-3 w-3" />
        <span>{buttonText}</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="md:max-w-3xl max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : data ? (
              <>
                <div className="mb-2">
                  <strong>File Name:</strong> {data.filename} <br />
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded-lg max-h-64 overflow-scroll">{data.content}</pre>
                {DownloadFileEnabled && data.fileurl && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 rounded-md bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors border border-primary/20 hover:border-primary/30"
                    >
                      <Download className="h-4 w-4" />
                      Download Full File
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

