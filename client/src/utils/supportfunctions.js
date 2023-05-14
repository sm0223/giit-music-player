import { deleteObject, ref } from "firebase/storage";
import { storage } from "../config/firebase.config";

export const filters = [
  { id: 1, name: "Regional", value: "regional" },
  { id: 2, name: "Pop", value: "Pop" },
  { id: 3, name: "Folk", value: "folk" },
  { id: 4, name: "Hip hop", value: "hip_hop" },
  { id: 5, name: "Instrumental", value: "instrumental" },
];

export const filterByLanguage = [
  { id: 1, name: "Bangla", value: "bangla" },
  { id: 2, name: "Punjabi", value: "punjabi" },
  { id: 3, name: "English", value: "english" },
  { id: 4, name: "Hindi", value: "Hindi" },
  { id: 5, name: "Kannada", value: "kannada" },
  { id: 6, name: "Japanese", value: "japanese" },
];

export const deleteAnObject = (referenceUrl) => {
  const deleteRef = ref(storage, referenceUrl);
  deleteObject(deleteRef)
      .then(() => {
        return true;
      })
      .catch((error) => {
        return false;
      });
};
