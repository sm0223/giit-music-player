import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../../config/firebase.config";
import {BiCloudUpload} from "react-icons/bi";
import React from "react";

export const ImageUploader = ({
                                setImageUrl,
                                setAlert,
                                alertMsg,
                                isLoading,
                                isImage,
                                setProgress,
                              }) => {
  const uploadImage = (e) => {
    isLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(
        storage,
        `${isImage ? "Images" : "Audio"}/${Date.now()}-${imageFile.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },

        (error) => {
          console.log(error)
          setAlert("error");
          alertMsg("File upload failed.");
          setTimeout(() => {
            setAlert("false ");
          }, 4000);
          isLoading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUrl(downloadUrl);
            setProgress(0);
            isLoading(false);
            setAlert("success");
            alertMsg("File uploaded successfully");
            setTimeout(() => {
              setAlert("false");
            }, 4000);
          });
        }
    );
  };

  return (
      <label>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <p className="font-bold text-2xl text-textColor">
              <BiCloudUpload />
            </p>
            <p className="text-lg text-textColor">
              click to upload {isImage ? "image" : "audio"}
            </p>
          </div>
        </div>
        <input
            type="file"
            name="upload-image"
            accept={`${isImage ? "image/*" : "audio/*"}`}
            onChange={uploadImage}
            className="w-0 h-0"
        />
      </label>
  );
};