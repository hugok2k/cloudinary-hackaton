"use client"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import Footer from "@/components/Footer"
import { BackIcon } from "@/components/SVG"
import UploadFile from "@/components/UploadFile"

type PreviewFile = File & { preview: string }

export default function Home() {
  const [files, setFiles] = useState<PreviewFile[]>([])
  const [imgTransforms, setImgTransforms] = useState("")
  const [imgDownload, setImgDownload] = useState("")

  const { getRootProps, getInputProps, isDragAccept, isDragReject, acceptedFiles } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      )
    },
  })

  return (
    <main className="flex flex-col justify-center items-center h-screen w-full bg-slate-900 text-white">
      <h1 className="text-4xl font-bold my-8 h-auto">
        ✨Custom<span className="text-[#ff006a]">Avatar</span>
      </h1>
      <section className="flex flex-row justify-center items-start w-full">
        <UploadFile
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragAccept={isDragAccept}
          isDragReject={isDragReject}
          acceptedFiles={acceptedFiles.slice()}
          files={files}
          imgTransforms={imgTransforms}
          imgDownload={imgDownload}
          setImgTransforms={setImgTransforms}
          setImgDownload={setImgDownload}
        />
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="bg-pink-700 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-md mt-8 active:scale-95"
            onClick={() => {
              setImgTransforms("")
              setImgDownload("")
              setFiles([])
              // acceptedFiles is read-only and managed by react-dropzone
            }}
          >
            <BackIcon />
          </button>
        </div>
      </section>
      <Footer />
    </main>
  )
}
