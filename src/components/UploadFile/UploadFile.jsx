/* eslint-disable @next/next/no-img-element */
import { useDropzone } from 'react-dropzone'
import { useEffect, useState } from 'react'
import UploadIcon from '../SVG/UploadIcon'
import DownloadIcon from '../SVG/DownloadIcon'

export default function UploadFile() {
  const [files, setFiles] = useState([])
  const [imgTransforms, setImgTransforms] = useState('')
  const [imgDownload, setImgDownload] = useState('')
  const { getRootProps, getInputProps, isDragAccept, acceptedFiles } =
    useDropzone({
      accept: {
        'image/jpeg': [],
        'image/png': [],
        'image/webp': []
      },
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        )
      }
    })
  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          src={file.preview}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview)
          }}
          alt={file.name}
          className='rounded-md flex flex-col justify-center items-center w-full max-w-lg'
        />
      </div>
    </div>
  ))
  const upload = () => {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`
    const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET
    const formData = new FormData()
    formData.append('file', files[0])
    formData.append('upload_preset', uploadPreset)
    formData.append('timestamp', (Date.now() / 1000) | 0)
    formData.append('api_key', process.env.NEXT_PUBLIC_API_KEY)
    fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        setImgTransforms(
          `https://res.cloudinary.com/hugok2k/image/upload/c_crop,g_face,h_400,w_400/r_max/c_scale,w_200/${data.public_id}.png`
        )
        setImgDownload(
          `https://res.cloudinary.com/hugok2k/image/upload/fl_attachment:my_avatar/c_crop,g_face,h_400,w_400/r_max/c_scale,w_200/${data.public_id}.png`
        )
      })
      .catch((err) => {
        console.log('Upload error', err)
      })
  }
  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview))
  }, [files])
  return (
    <div className='flex flex-col justify-center items-center'>
      <section className='container flex flex-col justify-center items-center h-auto w-full'>
        <div {...getRootProps()} className='mx-4'>
          <input {...getInputProps()} />
          <div
            className={`flex flex-col justify-center items-center w-full text-white border-4 rounded-md border-dashed p-8 ${
              isDragAccept || acceptedFiles.length > 0
                ? 'border-green-600'
                : 'border-red-50'
            }`}
          >
            {thumbs}
            {files.length === 0 ? (
              <>
                <span className='mb-4'>
                  Drag 'n' drop your file here, or click to select the file.
                </span>
                <span>
                  (Only *.jpeg, *.png and *.webp images will be accepted)
                </span>
              </>
            ) : (
              <span className='text-white'>{files[0].path}</span>
            )}
          </div>
        </div>
        {/* <aside>{thumbs}</aside> */}
      </section>
      <button
        onClick={upload}
        className='flex flex-row justify-center items-center gap-4 text-whit my-8 bg-pink-700 py-3 px-5 rounded-md text-white font-semibold hover:bg-pink-600'
      >
        <UploadIcon /> Upload
      </button>
      {imgTransforms ? (
        <>
          <img src={imgTransforms} alt='Image transform' />
          <button className='text-whit my-8 bg-pink-700 py-3 px-5 rounded-md text-white font-semibold hover:bg-pink-600'>
            <a
              href={imgDownload}
              download='image.png'
              className='text-white flex flex-row justify-center items-center gap-4'
            >
              <DownloadIcon />
              Download
            </a>
          </button>
        </>
      ) : null}
    </div>
  )
}
