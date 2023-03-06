import Footer from '@/components/Footer/Footer'
import BackIcon from '@/components/SVG/BackIcon'
// import CatIcon from '@/components/SVG/CatIcon'
// import DogIcon from '@/components/SVG/DogIcon'
import UploadFile from '@/components/UploadFile/UploadFile'
import Head from 'next/head'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function Home() {
  const [files, setFiles] = useState([])
  const [imgTransforms, setImgTransforms] = useState('')
  const [imgDownload, setImgDownload] = useState('')

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    acceptedFiles
  } = useDropzone({
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
  return (
    <>
      <Head>
        <title>CustomAvatar</title>
        <meta name='description' content='CustomAvatar - Cloudinary Hackaton' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link
          rel='shortcut icon'
          href='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Ctext%20y%3D%22.9em%22%20font-size%3D%2290%22%3E%E2%9C%A8%3C%2Ftext%3E%3C%2Fsvg%3E'
          type='image/svg+xml'
        />
      </Head>
      <div className='flex flex-col justify-center items-center h-screen w-full bg-slate-900 text-white '>
        <h1 className='text-4xl font-bold my-8 h-auto'>
          ✨Custom<span className='text-[#ff006a]'>Avatar</span>
        </h1>
        <section className='flex flex-row justify-center items-start w-full'>
          <UploadFile
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragAccept={isDragAccept}
            isDragReject={isDragReject}
            acceptedFiles={acceptedFiles}
            files={files}
            imgTransforms={imgTransforms}
            imgDownload={imgDownload}
            setImgTransforms={setImgTransforms}
            setImgDownload={setImgDownload}
          />
          <div className='flex flex-col gap-2'>
            <button
              className='bg-pink-700 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-md mt-8 active:scale-95'
              onClick={() => {
                setImgTransforms('')
                setImgDownload('')
                setFiles([])
                acceptedFiles.length = 0
              }}
            >
              <BackIcon />
            </button>
            {/* <button
              className='bg-pink-700 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-md active:scale-95 stroke-white'
              onClick={() => {
                setImgTransforms('')
                setImgDownload('')
                setFiles([])
                acceptedFiles.length = 0
              }}
            >
              <DogIcon />
            </button>
            <button
              className='bg-pink-700 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-md active:scale-95 stroke-white'
              onClick={() => {
                setImgTransforms('')
                setImgDownload('')
                setFiles([])
                acceptedFiles.length = 0
              }}
            >
              <CatIcon />
            </button> */}
          </div>
        </section>
        <Footer />
      </div>
    </>
  )
}
