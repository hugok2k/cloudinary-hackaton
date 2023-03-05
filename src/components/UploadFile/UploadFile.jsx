/* eslint-disable @next/next/no-img-element */
import { useDropzone } from 'react-dropzone'
import { useEffect, useState } from 'react'
import UploadIcon from '../SVG/UploadIcon'
import DropBoxIcon from '../SVG/DropBoxIcon'
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
          `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload/c_crop,g_face,h_400,w_400/r_max/c_scale,w_200/${data.public_id}.png`
        )
        setImgDownload(
          `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload/fl_attachment:my_avatar/c_crop,g_face,h_400,w_400/r_max/c_scale,w_200/${data.public_id}.png`
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
  console.log(imgTransforms)
  return (
    <div className='flex flex-col justify-center items-center m-8'>
      <section className='container flex flex-col justify-center items-center h-full w-full'>
        <div {...getRootProps()} className='mx-4'>
          <input {...getInputProps()} />
          <div
            className={`flex flex-col justify-center items-center w-full border-4 rounded-md border-dashed p-8 ${
              isDragAccept || acceptedFiles.length > 0
                ? 'border-green-600'
                : 'border-red-200'
            }`}
          >
            {imgTransforms ? (
              <section className='flex flex-col justify-center items-center h-full'>
                <img src={imgTransforms} alt='Image transform' />
              </section>
            ) : (
              thumbs
            )}
            {files.length === 0 ? (
              <section className='flex flex-col justify-center items-center'>
                <div
                  className={`${
                    isDragAccept
                      ? 'mt-9 mb-7 stroke-green-600'
                      : 'my-8 stroke-red-200'
                  }`}
                >
                  <DropBoxIcon />
                </div>
                <span className='mb-4'>
                  Drag 'n' drop your file here, or click to select the file.
                </span>
                <span>
                  (Only *.jpeg, *.png and *.webp images will be accepted)
                </span>
              </section>
            ) : null}
            {!imgTransforms && files.length > 0 ? (
              <span className='my-4'>
                <strong>File</strong>: {files[0].path}
              </span>
            ) : null}
          </div>
        </div>
      </section>
      <div className='flex flex-row gap-4'>
        <button
          onClick={upload}
          className='flex flex-row justify-center items-center gap-4 text-whit my-8 bg-pink-700 py-3 px-5 rounded-md  font-semibold hover:bg-pink-600'
        >
          <UploadIcon /> Upload
        </button>
        {imgTransforms ? (
          <button className='text-whit my-8 bg-pink-700 py-3 px-5 rounded-md  font-semibold hover:bg-pink-600'>
            <a
              href={imgDownload}
              download='image.png'
              className='flex flex-row justify-center items-center gap-4'
            >
              <DownloadIcon />
              Download
            </a>
          </button>
        ) : (
          <button
            className='text-whit my-8 bg-gray-600 py-3 px-5 rounded-md  font-semibold '
            disabled
          >
            <a className='flex flex-row justify-center items-center gap-4'>
              <DownloadIcon />
              Download
            </a>
          </button>
        )}{' '}
      </div>
    </div>
  )
}
