import {
  useState,
} from 'react';


import Cropper from 'react-easy-crop';


export default function ImageCropper({
  image,
  onCancel,
  onCrop,
}){


const [crop,setCrop] = useState({
  x:0,
  y:0,
});


const [zoom,setZoom] = useState(1);


const [cropPixels,setCropPixels] = useState(null);



function onCropComplete(
  croppedArea,
  croppedAreaPixels
){

  setCropPixels(
    croppedAreaPixels
  );

}



function createCrop(){

  if(!cropPixels){
    return;
  }


  onCrop(
    cropPixels
  );

}



return (

<div className="image-cropper">


<div className="image-cropper-area">


<Cropper

image={image}

crop={crop}

zoom={zoom}

aspect={9 / 16}

onCropChange={setCrop}

onZoomChange={setZoom}

onCropComplete={onCropComplete}

/>


</div>



<input

type="range"

min="1"

max="3"

step="0.1"

value={zoom}

onChange={
 e=>setZoom(
   Number(e.target.value)
 )
}

/>



<div className="image-cropper-actions">


<button
type="button"
onClick={onCancel}
>
Отмена
</button>


<button
type="button"
onClick={createCrop}
>
Обрезать
</button>


</div>


</div>

);

}
