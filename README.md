# CustomAvatar

This is a simple project to demonstrate how to use Cloudinary to upload images to the cloud and convert them to different formats, sizes, and effects.

This application allows you to create avatars from an image. It uses smart cropping to detect the face in the image, performs a circular crop, and lets you download the avatar in PNG format.

## Features
- **Automatic face detection**: The app identifies the face in the image to center the crop.
- **Circular crop**: The generated avatar is circular, ideal for profile pictures.
- **Download as PNG**: You can download the generated avatar as a PNG with a transparent background.

## How to use the application?
1. **Upload an image**: Select an image from your device and click the `convert` button.
2. **Automatic processing**: The application will detect the face and generate the circular crop automatically.
3. **Download your avatar**: Click the `download` button to save your avatar as a PNG file.

## Local installation and usage

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cloudinary-hackaton
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Environment variables

Before running the application, you need to set up the following environment variables. You can use the `.env.example` file as a template:

```env
NEXT_PUBLIC_UPLOAD_PRESET=   # Set your Cloudinary upload preset here
NEXT_PUBLIC_CLOUD_NAME=      # Set your Cloudinary cloud name here
NEXT_PUBLIC_API_KEY=         # Set your Cloudinary API key here (not secret)
```

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your Cloudinary credentials in the `.env` file.

3. Start the application:
   ```bash
   pnpm dev
   ```
4. Open your browser at `http://localhost:3000`

