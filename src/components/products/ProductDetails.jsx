import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';

const ProductDetails = ({ open, onClose, rowData }) => {
    const photos = rowData?.photos ?? [];
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [showFullImg, setShowFullImg] = useState(false);

    useEffect(() => {
        if(photos?.length && !selectedPhoto) {
            setSelectedPhoto(photos[0]?.desktopUrl)
        }
        if(!open) {
            setSelectedPhoto(null);
        }
    }, [photos, open])

    const listData = [
        {
            first: {
                label: "Seller email",
                value: rowData?.sellerEmail,
            },
            second: {
                label: "Seller phone",
                value: rowData?.sellerPhone,
            },
        },
        {
            first: {
                label: "Transmission",
                value: rowData?.transmission,
            },
            second: {
                label: "Seller phone",
                value: rowData?.sellerPhone,
            },
        },
        {
            first: {
                label: "Vin",
                value: rowData?.vin,
            },
            second: {
                label: "Engin size",
                value: rowData?.engine_size,
            },
        },
        {
            first: {
                label: "Fuel type",
                value: rowData?.fuel_type,
            },
            second: {
                label: "Location",
                value: rowData?.location,
            },
        },
        {
            first: {
                label: "Make",
                value: rowData?.make,
            },
            second: {
                label: "Model",
                value: rowData?.model,
            },
        },
        {
            first: {
                label: "Year",
                value: rowData?.year,
            },
            second: {
                label: "Mileage",
                value: rowData?.mileage,
            }
        },
    ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle textAlign={"center"}>Details</DialogTitle>
      {(selectedPhoto && showFullImg) ? (
          <DialogContent>
            <img
              onClick={() => setShowFullImg(false)}
              src={selectedPhoto}
              alt="payment image"
              className="w-full h-auto rounded cursor-zoom-out"
            />
          </DialogContent>
        ) : (
            <DialogContent sx={{minWidth: 600}}>
                {photos && photos.length > 0 && (
                    <div className='w-full flex flex-col items-center'>
                        {selectedPhoto && (
                            <img 
                                onClick={() => setShowFullImg(true)}
                                src={selectedPhoto} 
                                alt="main photo" 
                                className='w-full md:h-[200px] md:w-auto rounded cursor-zoom-in'
                            />
                        )}

                        <div className='flex items-center gap-2 mt-2 w-full max-w-[580px] flex-wrap border border-gray-600 p-2 rounded'>
                            {photos.map(i => (
                                <div 
                                    key={i?.filename} 
                                    onClick={() => setSelectedPhoto(i?.desktopUrl)}
                                    className={`border-2 cursor-pointer rounded ${selectedPhoto === i?.desktopUrl && 'border-blue-400'}`}
                                >
                                    <img src={i?.desktopUrl} alt="child photo" className='h-12 w-auto' />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className='flex flex-col gap-2'>
                    <div className='mt-2'>
                        <label className='font-medium'>Description</label>
                        <p className=''>{rowData?.description ?? '-'}</p>
                    </div>

                    <div>
                        <label className='font-medium'>Price</label>
                        <p className=''>{rowData?.price ? rowData?.price.toLocaleString() : '-'}</p>
                    </div>

                    {listData.map((i, index) => (
                        <div key={index} className='flex gap-4'>
                            <div className='w-1/2'>
                                <label className='font-medium'>{i.first.label}</label>
                                <p className=''>{i.first.value ?? '-'}</p>
                            </div>

                            <div className='w-1/2'>
                                <label className='font-medium'>{i.second.label}</label>
                                <p className=''>{i.second.value ?? '-'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        )}
      <DialogActions>
        <Button variant='outlined' onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetails;
