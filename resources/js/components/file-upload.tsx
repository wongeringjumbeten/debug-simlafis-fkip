import { Camera, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    id: string;
    label: string;
    file: File | null;
    error?: string;
    onChange: (file: File | null) => void;
    accept?: string;
    maxSizeMB?: number;
    icon?: React.FC<{ className?: string }>;
    /** Name attribute for form serialization (needed inside Inertia <Form>). */
    name?: string;
}

export function FileUpload({
    id,
    label,
    file,
    error,
    onChange,
    accept = '.jpg,.jpeg,.png',
    maxSizeMB = 2,
    icon: Icon = Camera,
    name,
}: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    // Generate preview URL and clean up
    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreview(null);
        }
    }, [file]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const f = e.target.files?.[0] ?? null;
            setLocalError(null);

            if (f) {
                const ext = f.name.split('.').pop()?.toLowerCase();
                const validExt = ['jpg', 'jpeg', 'png'];

                if (!ext || !validExt.includes(ext)) {
                    setLocalError('Format file harus JPG/PNG.');
                    onChange(null);
                    return;
                }

                if (f.size > maxSizeMB * 1024 * 1024) {
                    setLocalError(`Ukuran file maksimal ${maxSizeMB} MB.`);
                    onChange(null);
                    return;
                }
            }

            onChange(f);
        },
        [maxSizeMB, onChange],
    );

    const handleRemove = useCallback(() => {
        setLocalError(null);
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, [onChange]);

    const displayError = localError ?? error;
    const fileSizeKB = file ? Math.round(file.size / 1024) : null;
    const fileSizeMB = file ? (file.size / 1024 / 1024).toFixed(1) : null;
    const isLarge = fileSizeKB !== null && fileSizeKB > 300;

    return (
        <div className="grid gap-2">
            <label className="text-foreground text-sm font-medium">
                {label}
            </label>

            <input
                ref={inputRef}
                id={id}
                name={name}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
            />

            {!preview ? (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    aria-label={`Unggah ${label.toLowerCase()}`}
                    className={cn(
                        'focus-visible:ring-ring/50 group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
                        displayError
                            ? 'border-destructive/50 bg-destructive/5'
                            : 'border-muted-foreground/30 hover:border-muted-foreground/60 hover:bg-accent/30',
                    )}
                >
                    <Icon
                        className={cn(
                            'h-10 w-10 transition-colors',
                            displayError
                                ? 'text-destructive/60'
                                : 'text-muted-foreground/50 group-hover:text-muted-foreground/80',
                        )}
                    />
                    <div className="space-y-0.5 text-center">
                        <p className="text-foreground/80 font-medium">
                            Klik untuk unggah
                        </p>
                        <p className="text-muted-foreground text-xs">
                            JPG/PNG, maks {maxSizeMB} MB
                        </p>
                    </div>
                </button>
            ) : (
                <div
                    className={cn(
                        'flex flex-wrap items-center gap-4 rounded-lg border p-3',
                        displayError ? 'border-destructive/50' : '',
                    )}
                >
                    <div className="bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-md border">
                        <img
                            src={preview}
                            alt={`Pratinjau ${label.toLowerCase()}`}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="truncate text-sm font-medium">
                            {file?.name}
                        </p>
                        <p
                            className={cn(
                                'text-xs',
                                isLarge
                                    ? 'text-warning'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {fileSizeMB} MB
                            {isLarge &&
                                ` — mendekati batas ${maxSizeMB} MB, disarankan kompres`}
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Hapus ${label.toLowerCase()}`}
                        onClick={handleRemove}
                        className="shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {displayError && (
                <p className="text-destructive text-sm" role="alert">
                    {displayError}
                </p>
            )}
        </div>
    );
}
