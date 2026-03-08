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
      className="relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200"
      style={{
        borderColor: isDragActive ? '#6ee7b7' : file ? '#6ee7b750' : '#1e1e2e',
        background: isDragActive ? '#6ee7b708' : file ? '#6ee7b705' : '#111118',
      }}
    >
      <input {...getInputProps()} />

      {file ? (
        <div className="space-y-2">
          <div className="text-3xl">📄</div>
          <p className="font-mono text-sm font-semibold text-accent">{file.name}</p>
          <p className="text-xs text-slate-500">
            {(file.size / 1024).toFixed(1)} KB · Click to change
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-4xl opacity-40">📋</div>
          <div>
            <p className="text-sm font-semibold text-slate-300">
              {isDragActive ? 'Drop it here...' : 'Drop your resume here'}
            </p>
            <p className="text-xs text-slate-500 mt-1">PDF or DOCX · Max 5MB</p>
          </div>
          <button
            className="mt-2 px-4 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all"
            style={{
              background: '#6ee7b720',
              color: '#6ee7b7',
              border: '1px solid #6ee7b740',
            }}
          >
            Browse Files
          </button>
        </div>
      )}
    </div>
  )
}