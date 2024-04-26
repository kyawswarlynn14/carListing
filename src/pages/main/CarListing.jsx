import React, { useEffect, useState } from 'react'
import { CreateCarListing, CarListingDetails } from '../../components/carListings'
import { useScreenWidth } from '../../hooks';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { Box, Pagination } from '@mui/material';
import { useDeleteCarListingMutation, useGetAllCarListingMutation } from '../../store/carListing/carListingApi';
import toast from 'react-hot-toast';
import { ItemDeleteDialog } from '../../components/layouts';
import { useDispatch } from 'react-redux';
import { userLoggedOut } from '../../store/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const CarListing = () => {
  const limit = 10;
  const screenWidth = useScreenWidth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [productList, setProductList] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const [ getAllCarListing, { isLoading, isSuccess, error, data: carListingData}] = useGetAllCarListingMutation()
  const [ deleteCarListing, { isLoading: deleteLoading, isSuccess: deleteSuccess, error: deleteError }] = useDeleteCarListingMutation();

  useEffect(() => {
    getAllCarListing({ page, limit })
  }, [page])

  useEffect(() => {
    if(isSuccess && carListingData?.status === 1) {
      setProductList(carListingData?.data?.carListings)
      setTotalCount(carListingData?.data?.totalCount)
    }
    if(error){
      let errorMessage = error?.data?.message ?? error?.error;
      toast.error(errorMessage ?? 'Something went wrong!');
      console.log('getAllCarListing err -->', error)
    }
  }, [isSuccess, error])

  useEffect(() => {
    if(deleteSuccess) {
      getAllCarListing({ page: 1, limit});
      toast.success("Deleted successfully!");
    }
    if(deleteError){
      let errorMessage = deleteError?.data?.message ?? deleteError?.error;
      toast.error(errorMessage ?? 'Something went wrong!')
      if(deleteError?.status === 401) {
        dispatch(userLoggedOut())
        navigate('/auth/login')
      }
      console.log('delete carlisting err -->', deleteError)
    }
  }, [deleteSuccess, deleteError])

  const handleDeleteItem = async (id) => {
    await deleteCarListing(id);
  }
  
  const handleDetailDialogOpen = () => {
    setDetailDialogOpen(true);
  };
  
  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
  };

  const handleRowClick = (params) => {
    if (params.field === 'edit' || params.field === 'delete') {
      return;
    }
    setSelectedRowId(params.row.id);
    handleDetailDialogOpen();
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "no", headerName: "No", flex: 0.1 },
    { field: "make", headerName: "Make", flex: 0.3 },
    { field: "model", headerName: "Model", flex: 0.3 },
    { field: "year", headerName: "Year", flex: 0.3 },
    { field: "price", headerName: "Price", flex: 0.3 },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params) => {
        return (
          <CreateCarListing 
            refetchFunc={getAllCarListing}
            isUpdate={true} 
            itemToUpdate={productList.find(i => i._id === params?.row.id)}
          />
        )
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params) => {
        return (
          <ItemDeleteDialog 
            message={"Are you sure you want to delete this item?"}
            deleteHandler={() => handleDeleteItem(params?.row?.id)} 
            isLoading={deleteLoading}
          />
        )
      },
    },
  ];

  const rows = [];
  const startingIndex = (page - 1) * limit + 1;
  {
    productList?.length > 0 &&
      productList.forEach((item, index) => {
        rows.push({
          id: item?._id,
          no: startingIndex + index,
          make: item?.make,
          model: item?.model,
          year: item?.year,
          price: item?.price && item?.price.toLocaleString(),
        });
      });
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const CustomToolbarContainer = () => {
    return (
      <GridToolbarContainer
        sx={{
          color: "#000",
          backgroundColor: "#fff",
          borderTop: "none",
          borderBottomRightRadius: '8px',
          borderBottomLeftRadius: '8px',
          paddingY: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
        }}
      >
        <Pagination
          style={{color: '#fff'}}
          color="primary"
          count={+(totalCount/limit).toFixed(0)}
          page={page}
          onChange={handlePageChange}
        />
      </GridToolbarContainer>
    );
  };

  return (
    <div className='w-full h-full p-2 md:py-4 md:px-6 '>
      <div className='flex justify-between items-center'>
        <div className='flex items-end gap-1'>
          <h1 className='font-semibold text-4xl tracking-wider'>Products</h1>
          <span className='py-1 px-3 text-sm text-gray-500 border border-gray-400 rounded-full'>{productList?.length ?? '0'}</span>
        </div>
        
        <CreateCarListing refetchFunc={getAllCarListing} isUpdate={false} />
      </div>

      <div className='mt-4 pb-4'>
        <Box
          m="0"
          height={screenWidth < 640 ? "65vh" : '75vh'}
          width={screenWidth < 640 ? '600px' : "full"}
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              outline: "none",
            },
            "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
              color: "#fff",
            },
            "& .MuiDataGrid-row": {
              color: "#000",
              borderBottom: "1px solid #ccc",
              cursor: "pointer",
              height: "fit",
            },
            "& .MuiTablePagination-root": {
              color: "#fff",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-colunm--cell": {
              color: "#fff",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text, & .MuiDataGrid-toolbarContainer .MuiInputBase-input":
              {
                color: "#000 !important",
              },
            "& .MuiDataGrid-columnHeader:hover, & .MuiDataGrid-columnHeader:hover .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon, & .MuiDataGrid-columnHeader:hover .MuiDataGrid-colCellTitle, & .MuiDataGrid-columnHeader:hover .MuiDataGrid-menuIcon":
              {
                visibility: "hidden",
                display: "none",
              },
            "& .MuiDataGrid-columnHeader .MuiDataGrid-menuIcon": {
              display: "none",
            },
            "& .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader": {
              pointerEvents: "none",
              userSelect: "none",
              backgroundColor: "#fff",
              color: "#000",
              border: "none",
              fontWeight: "semi-bold",
            },
            "& .MuiDataGrid-footerContainer .MuiSvgIcon-root": {
              color: "#fff",
            },
            "& .MuiCheckbox-root": {
              color: "#000 !important",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "#F5F7FA",
            },
          }}
        >
          <DataGrid 
            slots={{footer: CustomToolbarContainer}}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
            }}
            rows={rows}
            columns={columns}
            onCellClick={handleRowClick}
            localeText={{ noRowsLabel: isLoading ? 'loading...' : 'No Data' }}
            pagination
            pageSize={limit}
            page={page}
            onPageChange={handlePageChange}
            disableColumnSelector
            disableDensitySelector
          />

          <CarListingDetails 
            open={detailDialogOpen}
            onClose={handleDetailDialogClose}
            rowData={productList?.length ? productList.find(i => i?._id === selectedRowId) : null}
          />
        </Box>
      </div>
    </div>
  )
}

export default CarListing