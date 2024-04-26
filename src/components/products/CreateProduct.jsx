import { Dialog } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { FiPlus } from "react-icons/fi";
import { useCreateCarListingMutation, useUpdateCarListingMutation } from "../../store/carListing/carListingApi";

const validationSchema = Yup.object().shape({
  sellerEmail: Yup.string().email("Invalid Email").required("Please enter seller email!"),
  sellerPhone: Yup.string().required("Please enter seller phone!"),
  make: Yup.string().required("Please enter make!"),
  model: Yup.string().required("Please enter model!"),
  year: Yup.string().required("Please enter year!"),
  mileage: Yup.string().required("Please enter mileage!"),
  vin: Yup.string().required("Please enter vin!"),
  engineSize: Yup.string().required("Please enter engineSize!"),
  transmission: Yup.string().required("Please enter transmission!"),
  fuelType: Yup.string().required("Please enter fuelType!"),
  price: Yup.string().required("Please enter price!"),
  description: Yup.string().required("Please enter product description!"),
  location: Yup.string().required("Please enter location!"),
});

const initialValues = {
    sellerEmail: "",
    sellerPhone: "",
    make: "",
    model: "",
    year: "",
    mileage: "",
    vin: "",
    engineSize: "",
    transmission: "",
    fuelType: "",
    price: "",
    description: "",
    location: "",
};

const CreateProduct = ({ isUpdate = false, itemToUpdate = null, refetchFunc }) => {
  const [values, setValues] = useState(initialValues);
  const [open, setOpen] = useState(false);
  const userFromCookies = Cookies.get('user');
  const user = userFromCookies ? JSON.parse(userFromCookies) : null;
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [removePhotos, setRemovePhotos] = useState([]);

  const [ createCarListing, {data, isLoading, isSuccess, error }] = useCreateCarListingMutation();
  const [ updateCarListing, {data: updateData, isLoading: updateLoading, isSuccess: updateSuccess, error: updateError }] = useUpdateCarListingMutation();

  useEffect(() => {
    if(isUpdate && itemToUpdate){
      setValues({
        sellerEmail: itemToUpdate?.sellerEmail,
        sellerPhone: itemToUpdate?.sellerPhone,
        make: itemToUpdate?.make,
        model: itemToUpdate?.model,
        year: itemToUpdate?.year,
        mileage: itemToUpdate?.mileage,
        vin: itemToUpdate?.vin,
        engineSize: itemToUpdate?.engine_size,
        transmission: itemToUpdate?.transmission,
        fuelType: itemToUpdate?.fuel_type,
        price: itemToUpdate?.price,
        description: itemToUpdate?.description,
        location: itemToUpdate?.location,
      });
      setPhotos(itemToUpdate?.photos)
    }
  }, [isUpdate])

  useEffect(() => {
    if(isSuccess) {
      toast.success(data?.message ?? 'Created successfully!');
      refetchFunc({ page: 1, limit});
      setFiles(null);
      handleClose();
    }
    if(error){
      let errorMessage = error?.data?.message ?? error?.error;
      toast.error(errorMessage ?? 'Something went wrong!')
      console.log('create carlisting err -->', error)
    }
  }, [isSuccess, error])

  useEffect(() => {
    if(updateSuccess) {
      toast.success(updateData?.message ?? 'Updated successfully!');
      refetchFunc({ page: 1, limit});
      setFiles(null);
      handleClose();
    }
    if(updateError){
      let errorMessage = updateError?.data?.message ?? updateError?.error;
      toast.error(errorMessage ?? 'Something went wrong!')
      console.log('update carlisting err -->', updateError)
    }
  }, [updateSuccess, updateError])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = async (e) => {
    const newFiles = e.target.files;
    if (newFiles) {
      setFiles(prevFiles => prevFiles ? [...prevFiles, ...newFiles] : [...newFiles]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  }

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  }

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const newFiles = e.target.files;
    if (newFiles) {
      setFiles(prevFiles => prevFiles ? [...prevFiles, ...newFiles] : [...newFiles]);
    }
  }


  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    if(isUpdate) {
      let id = itemToUpdate?._id;
      let valuesData = {
        ...values,
        createdBy: user?._id,
        removePhotos: removePhotos ? JSON.stringify(removePhotos) : JSON.stringify([]),
      }
      
      await updateCarListing({valuesData, files, id});
    } else {
      let valuesData = {
        ...values,
        createdBy: user?._id,
      }

      Object.keys(valuesData).forEach((key) => {
          formData.append(key, valuesData[key]);
      });
  
      if (files) {
          Array.from(files).forEach((file) => {
              formData.append("photos", file);
          });
      }
      
      await createCarListing(formData);
    }
    resetForm();
  }

  const handleCancel = (resetForm) => {
    resetForm();
    setFiles(null)
    handleClose();
  }

  return (
    <React.Fragment>
      {isUpdate ? (
        <button
          type="button"
          onClick={handleClickOpen}
          className="p-2 rounded-full hover:bg-blue-300"
        >
          <FaEdit size={20} />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClickOpen}
          className="py-2 px-8 rounded border border-blue-500 text-blue-500 hover:underline underline-offset-2 hover:bg-blue-50 transition-all duration-300 font-medium text-sm flex items-center gap-2"
        >
            <FiPlus size={20} />
            Create new
        </button>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <div className="py-3 bg-blue-800 text-white text-[18px] font-semibold flex items-center justify-center">
            <p>{isUpdate ? "Update" : "Create"} Product</p>
        </div>

        <Formik
          initialValues={values}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps) => (
            <Form className="w-full h-fit bg-white p-2 sm:px-4 flex flex-col gap-1">
                <div className="w-full flex items-start gap-2">
                    <div className="w-full md:w-1/2">
                        <label htmlFor="sellerEmail" className="font-medium text-sm">Seller email</label>
                        <Field
                            type="email"
                            id="sellerEmail"
                            name="sellerEmail"
                            placeholder="Seller email"
                            className="LInput"
                        />
                        <ErrorMessage
                            name="sellerEmail"
                            component="small"
                            className="text-red-500 block"
                        />
                    </div>

                    <div className="w-full md:w-1/2">
                        <label htmlFor="sellerPhone" className="font-medium text-sm">Seller phone</label>
                        <Field
                        type="text"
                        id="sellerPhone"
                        name="sellerPhone"
                        placeholder="Seller phone"
                        className="LInput"
                        />
                        <ErrorMessage
                        name="sellerPhone"
                        component="small"
                        className="text-red-500 block"
                        />
                    </div>
                </div>

                <div className="w-full flex items-start gap-2">
                    <div className="w-full md:w-1/2">
                        <label htmlFor="make" className="font-medium text-sm">Make</label>
                        <Field
                        type="text"
                        id="make"
                        name="make"
                        placeholder="Make"
                        className="LInput"
                        />
                        <ErrorMessage
                        name="make"
                        component="small"
                        className="text-red-500 block"
                        />
                    </div>

                    <div className="w-full md:w-1/2">
                        <label htmlFor="model" className="font-medium text-sm">Model</label>
                        <Field
                        type="text"
                        id="model"
                        name="model"
                        placeholder="Model"
                        className="LInput"
                        />
                        <ErrorMessage
                        name="model"
                        component="small"
                        className="text-red-500 block"
                        />
                    </div>
                </div>

                <div className="w-full flex items-start gap-2">
                    <div className="w-full md:w-1/2">
                    <label htmlFor="year" className="font-medium text-sm">Year</label>
                    <Field
                    type="text"
                    id="year"
                    name="year"
                    placeholder="Year"
                    className="LInput"
                    />
                    <ErrorMessage
                    name="year"
                    component="small"
                    className="text-red-500 block"
                    />
                    </div>

                    <div className="w-full md:w-1/2">
                        <label htmlFor="mileage" className="font-medium text-sm">Mile age</label>
                        <Field
                        type="text"
                        id="mileage"
                        name="mileage"
                        placeholder="Mile age"
                        className="LInput"
                        />
                        <ErrorMessage
                        name="mileage"
                        component="small"
                        className="text-red-500 block"
                        />
                    </div>
                </div>

                <div className="w-full flex items-start gap-2">
                    <div className="w-full md:w-1/2">
                        <label htmlFor="vin" className="font-medium text-sm">Vin</label>
                        <Field
                        type="text"
                        id="vin"
                        name="vin"
                        placeholder="Vin"
                        className="LInput"
                        />
                        <ErrorMessage
                        name="vin"
                        component="small"
                        className="text-red-500 block"
                        />
                    </div>

                    <div className="w-full md:w-1/2">
                        <label htmlFor="engineSize" className="font-medium text-sm">Engine size</label>
                        <Field
                        type="text"
                        id="engineSize"
                        name="engineSize"
                        placeholder="Engine size"
                        className="LInput"
                        />
                        <ErrorMessage
                        name="engineSize"
                        component="small"
                        className="text-red-500 block"
                        />
                    </div>
                </div>

                <div className="w-full flex items-start gap-2">
                    <div className="w-full md:w-1/2">
                        <label htmlFor="transmission" className="font-medium text-sm">Transmission</label>
                        <Field
                        type="text"
                        id="transmission"
                        name="transmission"
                        placeholder="Transmission"
                        className="LInput"
                        />
                        <ErrorMessage
                        name="transmission"
                        component="small"
                        className="text-red-500 block"
                        />
                    </div>

                    <div className="w-full md:w-1/2">
                        <label htmlFor="fuelType" className="font-medium text-sm">Fuel type</label>
                        <Field
                        type="text"
                        id="fuelType"
                        name="fuelType"
                        placeholder="Fuel type"
                        className="LInput"
                        />
                        <ErrorMessage
                        name="fuelType"
                        component="small"
                        className="text-red-500 block"
                        />
                    </div>
                </div>

                <div className="w-full flex items-start gap-2">
                    <div className="w-full md:w-1/2">
                        <label htmlFor="price" className="font-medium text-sm">Price</label>
                        <Field
                        type="text"
                        id="price"
                        name="price"
                        placeholder="Price"
                        className="LInput"
                        />
                        <ErrorMessage
                        name="price"
                        component="small"
                        className="text-red-500 block"
                        />
                    </div>

                    <div className="w-full md:w-1/2">
                        <label htmlFor="location" className="font-medium text-sm">Location</label>
                        <Field
                            type="text"
                            id="location"
                            name="location"
                            placeholder="Location"
                            className="LInput"
                        />
                        <ErrorMessage
                            name="location"
                            component="small"
                            className="text-red-500 block"
                        />
                    </div>
                </div>

                <div className="w-full">
                    <label htmlFor="description" className="font-medium text-sm">Description</label>
                    <Field
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Description"
                        className="LInput"
                    />
                    <ErrorMessage
                        name="description"
                        component="small"
                        className="text-red-500 block"
                    />
                </div>

                <div className="w-full ">
                    <input type='file' accept='image/*' id='file' multiple className='hidden' onChange={handleFileChange} />

                    <label 
                        className={`w-full my-2 cursor-pointer rounded min-h-[10vh] p-3 border border-blue-400 border-dotted flex items-center justify-center ${dragging ? "bg-blue-700 text-white" : "bg-transparent"}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        htmlFor="file"
                    >
                            
                      <span>
                          Drag and drop your thumbnail here or click to browser
                      </span>
                    </label>

                    <div>
                      {files && files.length > 0 && (
                          <div className="w-full flex gap-2">
                              {Array.from(files).map((i, index) => (
                                <div key={i?.name ?? index} className="relative">
                                  <button
                                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                      onClick={() => {
                                        const updatedFiles = [...files];
                                        updatedFiles.splice(index, 1);
                                        setFiles(updatedFiles);
                                      }}
                                  >
                                      X
                                  </button>

                                  <img src={URL.createObjectURL(i)} alt={i?.name} className="w-auto h-24" />
                                </div>
                              ))}
                          </div>
                      )}
                      {photos && photos.length > 0 && (
                          <div className="w-full flex gap-2">
                              {photos.map((i, index) => (
                                <div key={i?.filename ?? index} className="relative">
                                  <button
                                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                      onClick={() => {
                                        const updatedPhotos = photos.filter(photo => photo.filename !== i.filename);
                                        setPhotos(updatedPhotos);
                                        setRemovePhotos(prev => [...prev, i.filename]);
                                      }}
                                  >
                                      X
                                  </button>

                                  <img src={i?.desktopUrl} alt={i?.filename} className="w-auto h-24" />
                                </div>
                              ))}
                          </div>
                      )}
                    </div>
                </div>

              <div className="flex justify-between gap-2 my-2">
                <button
                  type="button"
                  className="w-1/2 bg-slate-100 py-2 px-6 hover:bg-slate-200 rounded-lg border border-gray duration-300 font-semibold"
                  onClick={() => handleCancel(formikProps.resetForm)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`w-1/2 bg-blue-800 py-2 px-6 hover:bg-opacity-80 rounded-lg border border-gray duration-300 font-semibold text-white  disabled:cursor-not-allowed`}
                  disabled={updateLoading || isLoading}
                >
                  {(isLoading || updateLoading) ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
    </React.Fragment>
  );
};

export default CreateProduct;
