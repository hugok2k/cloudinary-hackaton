/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import UploadIcon from '../SVG/UploadIcon'
import DropBoxIcon from '../SVG/DropBoxIcon'
import DownloadIcon from '../SVG/DownloadIcon'
import { PulseLoader } from 'react-spinners'

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
  setImgDownload
}) {
  const [loading, setLoading] = useState(false)
  const thumbs = files.map((file) => (
    <div key={file.name}>
      {loading === false ? (
        <div className='flex flex-col justify-center items-center'>
          <img
            src={file.preview}
            // Revoke data uri after image is loaded
            onLoad={() => {
              URL.revokeObjectURL(file.preview)
            }}
            alt={file.name}
            className='rounded-md flex flex-col justify-center items-center w-full max-w-lg'
          />
          <span className='my-4'>
            <strong>File</strong>: {files[0].path}
          </span>
        </div>
      ) : null}
    </div>
  ))
  const upload = () => {
    setLoading(true)
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
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview))
  }, [files])
  useEffect(() => {
    if (imgTransforms) {
      setLoading(false)
    }
  }, [imgTransforms])
  return (
    <main className='flex flex-col justify-center items-center m-8'>
      <section className='container flex flex-col justify-center items-center h-full w-full'>
        <div {...getRootProps()} className='mx-4'>
          <input {...getInputProps()} />
          <div
            className={`flex flex-col justify-center items-center w-full min-h-[268px] rounded-md border-dashed p-8 ${
              isDragAccept || acceptedFiles.length > 0
                ? 'border-green-600'
                : 'border-red-200'
            } ${isDragReject && 'border-red-600'} ${
              imgTransforms || loading ? 'border-0' : 'border-4'
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
                <span className='mb-4 text-lg font-semibold'>
                  Drag 'n' drop one file or click.
                </span>
                <span className='font-semibold text-green-500'>
                  JPG, PNG or WEBP
                </span>
              </section>
            ) : null}
            <PulseLoader color='#ff006a' loading={loading} size={15} />
          </div>
        </div>
      </section>
      {imgTransforms ? (
        <section className='flex flex-row gap-4'>
          <button
            disabled
            className='flex flex-row justify-center items-center gap-4 text-whit my-8 bg-gray-600 py-3 px-5 rounded-md  font-semibold'
          >
            <UploadIcon /> Convert
          </button>
          <button className='text-whit my-8 bg-pink-700 py-3 px-5 rounded-md  font-semibold hover:bg-pink-600 active:scale-95'>
            <a
              href={imgDownload}
              download='image.png'
              className='flex flex-row justify-center items-center gap-3'
            >
              <DownloadIcon />
              Download
            </a>
          </button>
        </section>
      ) : (
        <section className='flex flex-row gap-3'>
          {files.length > 0 ? (
            <button
              onClick={upload}
              className='flex flex-row justify-center items-center gap-3 text-whit my-8 bg-pink-700 py-3 px-5 rounded-md  font-semibold hover:bg-pink-600 active:scale-95'
            >
              <UploadIcon /> Convert
            </button>
          ) : (
            <button
              disabled
              className='flex flex-row justify-center items-center gap-3 text-whit my-8 bg-gray-600 py-3 px-5 rounded-md  font-semibold'
            >
              <UploadIcon /> Convert
            </button>
          )}
          <button
            className='text-whit my-8 bg-gray-600 py-3 px-5 rounded-md  font-semibold'
            disabled
          >
            <a className='flex flex-row justify-center items-center gap-3'>
              <DownloadIcon />
              Download
            </a>
          </button>
        </section>
      )}
    </main>
  )
}
