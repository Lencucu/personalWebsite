'use client'

import { useState } from "react";

export default function UploadFiles() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("/cluster-api/upload", {
        method: "POST",
        body: formData,
      });


      if (!response.ok) {
        throw new Error("上传失败");
      }

      const result = await response.json();
      alert("上传成功！");
    } catch (err) {
      alert("上传失败：" + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-2xl shadow bg-white space-y-4">
      <h2 className="text-xl font-semibold">文件上传</h2>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="block w-full"
      />
      {files.length > 0 && (
        <ul className="text-sm text-gray-600">
          {files.map((file, i) => (
            <li key={i}>{file.name}</li>
          ))}
        </ul>
      )}
      <button
        onClick={uploadFiles}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "上传中..." : "开始上传"}
      </button>
    </div>
  );
}
