import type { ChangeEvent } from 'react';

type FileUploadProps = {
  fileName: string;
  error: string;
  onFileLoaded: (fileName: string, content: string) => void;
  onClear: () => void;
  onError: (message: string) => void;
};

function FileUpload({ fileName, error, onFileLoaded, onClear, onError }: FileUploadProps) {
  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith('.txt')) {
      onError('Only .txt files are supported in this phase.');
      return;
    }

    const content = await file.text();
    onFileLoaded(file.name, content);
  }

  return (
    <div className="border-t border-black bg-yellow-50 px-8 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center rounded-md border border-black bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-yellow-100">
          Upload .txt
          <input className="sr-only" type="file" accept=".txt,text/plain" onChange={handleFileChange} />
        </label>

        {fileName && (
          <>
            <span className="max-w-80 truncate text-sm text-zinc-700">{fileName}</span>
            <button
              className="rounded-md border border-black bg-white px-2 py-1 text-sm font-medium text-black hover:bg-yellow-100"
              type="button"
              onClick={onClear}
            >
              Clear
            </button>
          </>
        )}

        {!fileName && <span className="text-sm text-zinc-700">Attach a text file to summarize.</span>}
      </div>

      {error && <p className="mt-2 text-sm font-medium text-black">{error}</p>}
    </div>
  );
}

export default FileUpload;
