// src/components/UploadZone.jsx
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function UploadZone({ file, onFile }) {
  const onDrop = useCallback((accepted) => {
    if (accepted[0]) onFile(accepted[0])
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className="relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 group"
      style={{
        borderColor: isDragActive ? '#6ee7b7' : file ? 'rgba(110,231,183,0.4)' : 'rgba(255,255,255,0.1)',
        background:  isDragActive ? 'rgba(110,231,183,0.05)' : file ? 'rgba(110,231,183,0.04)' : 'rgba(255,255,255,0.015)',
      }}
    >
      <input {...getInputProps()} />

      {file ? (
        <div className="space-y-3">
          <div
            className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-2xl"
            style={{ background: 'rgba(110,231,183,0.1)', border: '1px solid rgba(110,231,183,0.25)' }}
          >
            ðŸ“„
          </div>
          <div>
            <p className="font-semibold text-sm text-emerald-400 truncate max-w-xs mx-auto">{file.name}</p>
            <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB Â· Click to replace</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div
            className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-2xl transition-transform duration-200 group-hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {isDragActive ? 'â¬‡ï¸' : 'ðŸ“‹'}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">
              {isDragActive ? 'Release to upload' : 'Drop your resume here'}
            </p>
            <p className="text-xs text-slate-500 mt-1">PDF or DOCX Â· Max 5 MB</p>
          </div>
          <span
            className="inline-block mt-1 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: 'rgba(110,231,183,0.08)',
              color: '#6ee7b7',
              border: '1px solid rgba(110,231,183,0.25)',
            }}
          >
            Browse Files
          </span>
        </div>
      )}
    </div>
  )
}
