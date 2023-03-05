import UploadFile from '@/components/UploadFile/UploadFile'
import Head from 'next/head'

export default function Home() {
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
      <main className='flex flex-col justify-center items-center h-screen w-full bg-slate-900 text-white '>
        <h1 className='text-4xl font-bold my-8 h-auto'>
          ✨Custom<span className='text-[#ff006a]'>Avatar</span>
        </h1>
        <UploadFile />
      </main>
    </>
  )
}
