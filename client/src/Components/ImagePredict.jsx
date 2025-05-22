import Navbar from './Navbar'
import Dropzone from 'react-dropzone'
import toast, { Toaster } from 'react-hot-toast';
import React, { useState } from 'react';
import MoonLoader from "react-spinners/MoonLoader";
import axios from 'axios';
import Footer from './Footer';

export default function ImagePredict() {
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(false);
  const [gotInference, setGotInference] = useState(false);
  const [inference, setInference] = useState("");

  function onDrop(file) {
    const reader = new FileReader();    
    reader.onabort = () => console.log('file reading aborted')
    reader.onerror = () => console.log('file reading failed')
    reader.onload = async () => {
      try{
      const image = reader.result;
      setLoading(true);
      setUploaded(true);
      setImageUrl(image);
      const response=await axios.post(`${import.meta.env.VITE_AZURE_WEB_APP_URL}/plant`, {image:image});
      setLoading(false);
      // const resizedUrl=`${imageType},${Buffer.from(response.data.resizedImage,ArrayBuffer).toString('base64')}`
      setInference(response.data.result);
      setGotInference(true);
      toast.success("File uploaded successfully");
      }
      catch(error){
          toast.error("Error while getting inference")
          console.log(error)
      }
    }
    reader.readAsDataURL(file[0]);
  }
  return (
    <>
      <div className='mb-2 fixed'><Navbar /></div>
      <div className="min-h-[800px] h-screen bg-green-100 pt-16">
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 mt-4">Ayurvedic Plant Identification</h1>
          <div className="w-full max-w-3xl bg-white p-8 rounded shadow-md pb-16">
      {!uploaded && <div className='flex items-center justify-center mb-16 mt-12'>
        <h1 className='m-auto text-3xl font-semibold'>Hi! Upload a plant image to get it identified!</h1>
      </div>}
      {!uploaded&&<Dropzone onDrop={onDrop} accept={{ 'image/*': ['.jpeg', '.png', '.jpg']}} maxFiles={2}>
        {({getRootProps, getInputProps}) => (
        <section>
          <div {...getRootProps()} className='h-[300px] w-5/6 flex justify-center items-center m-auto mt-5 border-2 border-dashed border-gray-400 rounded bg-gray-100'>
            <input {...getInputProps()} />
            <p className='text-2xl text-gray-400'>Drag 'n' drop some files here, or click to select files</p>
          </div>
        </section>
      )}
      </Dropzone>}
      {uploaded&&<img className='m-auto max-h-[500px] mt-8' src={imageUrl} alt="uploaded image" />}
      {loading&&<div className='flex justify-center items-center my-10'>
        <p className='text-3xl inline px-5'>Identifying your image...</p>
        <MoonLoader loading={loading} size={30} color={'green'}/>
      </div>}
      {gotInference&&<div className='flex flex-col justify-center items-center my-10 m-auto'>
        <p className='text-3xl inline px-5'>{inference}</p>
      </div>}
      <Toaster />
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}