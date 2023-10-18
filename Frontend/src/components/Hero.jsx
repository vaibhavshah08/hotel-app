import React, { useState } from 'react';
import axios from 'axios';
import { Form,Button, Input } from 'antd';
import moment from 'moment/moment';
import Table from './Table';
const roomTypes = {
  A: ['101', '102'],
  B: ['201', '202', '203'],
  C: ['301', '302', '303', '304', '305'],
};

const Hero = () => {
  const [details, setDetails] = useState({
    email: '',
    checkin: '',
    checkout: '',
    roomType: '',
    roomno: '', // Added roomNumber to store the selected room number
  });
  const [dataToSend,setdataToSend] =useState(null);
  const [response, setResponse] = useState(null);
  const [data,setData]=useState([
    {
        "id": 1,
        "email": "vaibhav@gmail.com",
        "checkin": "2023-10-19T15:38:00.000Z",
        "checkout": "2023-10-20T15:38:00.000Z",
        "roomType": "A",
        "roomno": "101",
        "price": "2400.00",
        "isCancelled": false,
        "refundAmount": 0
    },
    {
        "id": 2,
        "email": "vaibhav@gmail.com",
        "checkin": "2023-10-20T15:45:00.000Z",
        "checkout": "2023-10-21T15:45:00.000Z",
        "roomType": "B",
        "roomno": "201",
        "price": "1920.00",
        "isCancelled": false,
        "refundAmount": 0
    }
]);
  const handleDelete = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
    axios.delete(`http://localhost:4000/booking/${index}`).then((response)=>{console.log(response.data);}).catch((error)=>console.log(error))
  };
//   const data=[
//     {
//         "id": 1,
//         "email": "vaibhav@gmail.com",
//         "checkin": "2023-10-19T15:38:00.000Z",
//         "checkout": "2023-10-20T15:38:00.000Z",
//         "roomType": "A",
//         "roomno": "101",
//         "price": "2400.00",
//         "isCancelled": false,
//         "refundAmount": 0
//     },
//     {
//         "id": 2,
//         "email": "vaibhav@gmail.com",
//         "checkin": "2023-10-20T15:45:00.000Z",
//         "checkout": "2023-10-21T15:45:00.000Z",
//         "roomType": "B",
//         "roomno": "201",
//         "price": "1920.00",
//         "isCancelled": false,
//         "refundAmount": 0
//     }
// ];

  const onChange = (e) => {

    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log("Details:",details);
    setdataToSend(details);
    console.log(details);
    
    axios.post('http://localhost:4000/bookings/checkprice',details).then((response)=>{console.log(response.data);setResponse(response.data)}).catch((error)=>console.log(error))
  };
  const handleCancel=()=>{
    setResponse(null);
    setDetails({
        email: '',
        checkin: '',
        checkout: '',
        roomType: '',
        roomno: '', // Added roomNumber to store the selected room number
      });
  }
  const [listview,setListview]=useState(false);
  const getbookinglist=()=>{
     axios.get('http://localhost:4000/bookings/all').then((response)=>setData(response.data)).catch((error)=>console.log("List Error:",error));
     return true;
  }
  const handleBooking=()=>{
    axios.post('http://localhost:4000/bookings',response).then((response)=>{
      console.log(response.data);
    if(response.data.status==='true'){
     const result = getbookinglist();
     if(result);
      setListview(true)
    }
    })
    .catch((error)=>console.log(error));
  }
  const roomno = roomTypes[details.roomType] || [];

  return (
    <>{
        !listview ? 
        <div>
          {
             !response?
            <div className="header-main px-3 flex-1 flex overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=2070"
              alt="hello"
              srcSet=""
              className="absolute z-0"
            />
            <div className="container max-w-[1200px] mx-auto flex flex-col z-10">
              <div className="flex-1 flex items-center justify-stretch flex-col text-center py-12">
                <h1 className="text-2xl xs:text-[32px] text-white font-gilda tracking-[.04em] uppercase font-normal max-w-[800px] md:text-[42px]">
                  An upcoming vacation gives us something to eagerly anticipate.
                </h1>
                <a
                  href="/"
                  className="min-w-[158px] min-h-[48px] bg-transparent uppercase text-white border-2 font-barlow tracking-widest text-base font-normal inline-flex items-center justify-center mt-9 md:mt-[60px] hover:bg-white hover:text-black transition duration-300 ease-in-out"
                >
                  know more
                </a>
    
                <form
                  onSubmit={handleSubmit}
                  className="font-barlow mt-16 bg-white w-full grid sm:grid-cols-2 lg:grid-cols-6"
                >
                  <div className="px-2 py-4 border-[1px] rounded-md">
                    <input
                      value={details.email}
                      onChange={onChange}
                      type="email"
                      className="placeholder:text-eerie-black placeholder:uppercase text-sm outline-none border-none w-full rounded-md"
                      name="email"
                      placeholder="Email"
                    />
                  </div>
    
                  <div className="flex items-center justify-between px-3 py-4 border-[1px] border-solid rounded-md">
                    <input
                      value={details.checkin}
                      onChange={onChange}
                      type="datetime-local"
                      className="placeholder:text-eerie-black placeholder:uppercase text-sm outline-none border-none w-full rounded-md"
                      name="checkin"
                      placeholder="Check In"
                    />
                  </div>
    
                  <div className="flex items-center justify-between px-3 py-4 border-[1px] rounded-md">
                    <input
                      value={details.checkout}
                      onChange={onChange}
                      type="datetime-local"
                      className="placeholder:text-eerie-black placeholder:uppercase text-sm outline-none border-none w-full rounded-md"
                      name="checkout"
                      placeholder="Check Out"
                    />
                  </div>
    
                  <div className="px-2 py-4 border-[1px] rounded-md">
                    <select
                      className="min-w-full uppercase text-eerie-black outline-none rounded-md"
                      value={details.roomType}
                      onChange={onChange}
                      name="roomType"
                    >
                      <option value="">Room Type</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>
    
                  {details.roomType && (
                    <div className="px-2 py-4 border-[1px] rounded-md">
                      <select
                        className="min-w-full uppercase text-eerie-black outline-none rounded-md"
                        value={details.roomno}
                        onChange={onChange}
                        name="roomno"
                      >
                        <option value="" disabled placeholder="">Select Room Number</option>
                        {roomno.map((number) => (
                          <option key={number} value={number}>
                            {number}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
    
                  <button
                    type="submit"
                    onSubmit={()=>handleSubmit}
                    className="bg-lion font-barlow h-full min-h-[52px] flex items-center justify-center uppercase text-black transition duration-300 ease-in-out rounded-md"
                  >
                    Check Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        :
            <div style={{display:'flex',justifyContent:'center',maxWidth:'500px'}}>
              <Form>
                <Form.Item>
                    <Input type='text'  value={response.email}></Input>
                </Form.Item>
                <Form.Item>
                    <Input type='text' value={response.checkin}></Input>
                </Form.Item>
                <Form.Item>
                    <Input type='text' value={response.checkout}></Input>
                </Form.Item>
                <Form.Item>
                    <Input type='text' value={response.roomno}></Input>
                </Form.Item>
                <Form.Item>
                    <Input type='text' value={response.roomType}></Input>
                </Form.Item>
                <Form.Item>
                    <Input type='text' value={response.price}></Input>
                </Form.Item>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button  onClick={handleBooking}>Book Room</Button>
              </Form>
            
            </div>
        }
        </div>:
        <div>
           <h1>Room Bookings</h1>
           <Table data={data}  onDelete={handleDelete}/> 

        </div>
       
        
    
    }
    </>
  );
};

export default Hero;
