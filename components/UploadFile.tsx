"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { PulseLoader } from "react-spinners"
import { DownloadIcon, DropBoxIcon, UploadIcon } from "./SVG"

type UploadFileProps = {
  getRootProps: () => Record<string, unknown>
  getInputProps: () => Record<string, unknown>
  files: Array<File & { preview?: string }>
  isDragAccept: boolean
  isDragReject: boolean
  acceptedFiles: Array<File>
  imgTransforms: string
  imgDownload: string
  setImgTransforms: (url: string) => void
  setImgDownload: (url: string) => void
}

export default function UploadFile({
  getRootProps,
  getInputProps,
  files,
  isDragAccept,
  isDragReject,
  acceptedFiles,
  imgTransforms,
  imgDownload,
  setImgTransforms,
  setImgDownload,
}: UploadFileProps) {
  const [loading, setLoading] = useState(false)
  const thumbs = files.map((file) => {
    // Ensure preview URL exists
    const preview = file.preview || URL.createObjectURL(file)
    const name = file.name || "Unknown"
    return (
      <div key={name}>
        {loading === false ? (
          <div className="flex flex-col justify-center items-center">
            <Image
              src={preview}
              // Revoke data uri after image is loaded
              onLoadingComplete={() => {
                URL.revokeObjectURL(preview)
              }}
              alt={name}
              width={200}
              height={200}
              className="rounded-md flex flex-col justify-center items-center w-full max-w-lg"
            />
            <span className="my-4">
              <strong>File</strong>: {name}
            </span>
          </div>
        ) : null}
      </div>
    )
  })
  const upload = () => {
    setLoading(true)
    const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`
    const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET
    if (!uploadPreset) {
      throw new Error("Upload preset is not defined in environment variables.")
    }
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("upload_preset", uploadPreset)
    formData.append("timestamp", String((Date.now() / 1000) | 0))
    formData.append("api_key", process.env.NEXT_PUBLIC_API_KEY || "")
    fetch(uploadUrl, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        setImgTransforms(
          `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload/c_thumb,g_face,h_400,w_400/r_max/c_scale,w_200/${data.public_id}.png`,
        )
        setImgDownload(
          `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload/fl_attachment:my_avatar/c_thumb,g_face,h_400,w_400/r_max/c_scale,w_200/${data.public_id}.png`,
        )
      })
      .catch((err) => {
        console.log("Upload error", err)
      })
  }
  useEffect(() => {
    return () =>
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
  }, [files])
  useEffect(() => {
    if (imgTransforms) {
      setLoading(false)
    }
  }, [imgTransforms])
  return (
    <main className="flex flex-col justify-center items-center m-8">
      <section className="container flex flex-col justify-center items-center h-full w-full">
        <div {...getRootProps()} className="mx-4">
          <input {...getInputProps()} />
          <div
            className={`flex flex-col justify-center items-center w-full min-h-[268px] rounded-md border-dashed p-8 ${
              isDragAccept || acceptedFiles.length > 0 ? "border-green-600" : "border-red-200"
            } ${isDragReject && "border-red-600"} ${imgTransforms || loading ? "border-0" : "border-4"}`}
          >
            {imgTransforms ? (
              <section className="flex flex-col justify-center items-center h-full">
                <Image src={imgTransforms} alt="Transformed avatar" width={200} height={200} />
              </section>
            ) : (
              thumbs
            )}
            {files.length === 0 ? (
              <section className="flex flex-col justify-center items-center">
                <div className={`${isDragAccept ? "mt-9 mb-7 stroke-green-600" : "my-8 stroke-red-200"}`}>
                  <DropBoxIcon />
                </div>
                <span className="mb-4 text-lg font-semibold">Drag 'n' drop one file or click.</span>
                <span className="font-semibold text-green-500">JPG, PNG or WEBP</span>
              </section>
            ) : null}
            <PulseLoader color="#ff006a" loading={loading} size={15} />
          </div>
        </div>
      </section>
      {imgTransforms ? (
        <section className="flex flex-row gap-4">
          <button
            type="button"
            disabled
            className="flex flex-row justify-center items-center gap-4 text-white my-8 bg-gray-600 py-3 px-5 rounded-md  font-semibold"
          >
            <UploadIcon /> Convert
          </button>
          <a
            href={imgDownload}
            download="image.png"
            className="text-white my-8 bg-pink-700 py-3 px-5 rounded-md  font-semibold hover:bg-pink-600 active:scale-95 flex flex-row justify-center items-center gap-3"
          >
            <DownloadIcon />
            Download
          </a>
        </section>
      ) : (
        <section className="flex flex-row gap-3">
          {files.length > 0 ? (
            <button
              type="button"
              onClick={upload}
              className="flex flex-row justify-center items-center gap-3 text-white my-8 bg-pink-700 py-3 px-5 rounded-md  font-semibold hover:bg-pink-600 active:scale-95"
            >
              <UploadIcon /> Convert
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="flex flex-row justify-center items-center gap-3 text-white my-8 bg-gray-600 py-3 px-5 rounded-md  font-semibold"
            >
              <UploadIcon /> Convert
            </button>
          )}
          <button type="button" className="text-white my-8 bg-gray-600 py-3 px-5 rounded-md  font-semibold" disabled>
            <div className="flex flex-row justify-center items-center gap-3">
              <DownloadIcon />
              Download
            </div>
          </button>
        </section>
      )}
    </main>
  )
}
