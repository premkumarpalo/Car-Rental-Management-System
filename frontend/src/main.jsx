import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom"
import './index.css'
import App from './App.jsx'
import Layout from "./Layout.jsx"
import Register from './components/Register/register.jsx'
import Login from './components/Login/Login.jsx'
import Dashboard from './components/Dashboard/dashboard.jsx'
import Vehicles from "./components/Vehicles/Vehicles.jsx"
import Book from './components/Vehicles/Book.jsx'
import SuccessPage from './components/Vehicles/SuccessPage.jsx'
import Rental from './components/Rentals/rental.jsx'
import ReturnVehicle from './components/Vehicles/returnVehicle.jsx'
import RentalHistory from './components/Rentals/History.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<Navigate to={"/login"}/>
  },
  {
    path:"login",
    element:<Login/>
  },
  {
    path:"register",
    element:<Register/>
  },
  {
    path: "BookNow/:vehicleId",
    element: <Book/>
  },
  {
    path:"returnVehicle/:rentalId",
    element:<ReturnVehicle/>
  },
  {
    path: "success",
    element: <SuccessPage/>
  },
  {
    path:"/",
    element:<Layout/>,
    children:[
      {
        index:true,
        path:"dashboard",
        element:<Dashboard/>
      },
      {
        path:"vehicles",
        element:<Vehicles/>
      },
      {
        path:"rental",
        element:<Rental/>
      },
      {
        path:"rentalHistory",
        element:<RentalHistory/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router}/>
  </StrictMode>,
)
