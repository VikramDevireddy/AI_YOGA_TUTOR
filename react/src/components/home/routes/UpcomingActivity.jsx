import React from 'react'

const UpcomingActivity = () => {
  const data=[
    {
      id:1,
      title:"Breathing Session",
      imag:"https://imgs.search.brave.com/laHg7dOw2wL8ZCmLk3EptI4KzHniGRz9IlG_x6tt3Hc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTE3/NDQ3MjI3NC9waG90/by9jb25uZWN0aW9u/LXdpdGgtbmF0dXJl/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz0zcnMyTzUzNTl2/aWZJelFXbEZ3WEh5/RVdRU3Q3WHpQVkJX/VWlVS3V3Vl9vPQ",
      url : "https://www.youtube.com/live/9ix6tlaGqRQ?si=LE_r4ERpu3OTpmWL"
    },
    {
      id:2,
      title:"Shakthi Mudra",
      imag:"https://imgs.search.brave.com/URHyXe4ZfsQPp8kQcKkAfVQTkOyvF0bgUt4zOq3Y_xw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vY2hha3Jh/cHJhY3RpY2UuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIz/LzA0L1NhY3JhbC1D/aGFrcmEtTXVkcmFz/LTE5LjQuMjMuanBn/P3Jlc2l6ZT03Mjgs/NDEwJnNzbD0x",
      url : "https://youtu.be/2JVZ-v2nzEE?si=koRaBXLm2yUt03F4"
    },
    {
      id:3,
      title:"Streching",
      imag : "https://imgs.search.brave.com/hIaDlIDX1nPzCUfDvG74heMG_SMR8hturPfq5ATBYYo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMwMS5ueXQuY29t/L2ltYWdlcy8yMDE2/LzEyLzAyL3dlbGwv/bW92ZS95b2dhX2Jv/ZHlfaW1hZ2VzLXNs/aWRlLU5ZNFIveW9n/YV9ib2R5X2ltYWdl/cy1zbGlkZS1OWTRS/LXN1cGVySnVtYm8u/anBn",
      url:"https://youtu.be/mMKolS5X7nA?si=QPmy825odemxVqLS"
    },
    {
      id:4,
      title:"Improve Blood Flow",
      imag:"https://imgs.search.brave.com/PJ_DVKMNbTDDXfKTfTRV8QOi4pSNJCLc1zehWm9TxrU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9oaXBz/LmhlYXJzdGFwcHMu/Y29tL2htZy1wcm9k/L2ltYWdlcy9yZWQt/Ymxvb2QtY2VsbHMt/Zmxvd2luZy1pbi1h/LXZlaW4tb3ItYXJ0/ZXJ5LTNkLXJveWFs/dHktZnJlZS1pbWFn/ZS0xNjE5NzA4NjQy/Lj9jcm9wPTAuNTYz/eHc6MS4wMHhoOzAu/Mjc2eHcsMCZyZXNp/emU9NjQwOio",
      url : "https://youtu.be/jGGoiXT7YoY?si=Er-S9I4Rdvy7jh3n"
    },
    {
      id:5,
      title:"something",
      imag:"https://imgs.search.brave.com/6lXRE6MX1jdmoCxmpFpwxxgoHjf00xLIjwkjk2IBWhc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvMTM5/MDU4LmpwZw",
      url : ""
    }
  ]
  return (
<div className='grid grid-cols-1 w-full gap-8 md:grid-cols-3'>
  {data.map((w)=>
  // eslint-disable-next-line react/jsx-key
  <div className='w-full bg-white rounded-md'>
  <div className=''>
    <img src={w.imag} alt="" className='w-full h-44 rounded-lg'/>
    <div className='flex flex-row items-center gap-16 w-full'>
      <div className='flex flex-col items-center'>
      <h2><b>{w.title}</b></h2>
      <h1>days left</h1>
      </div>
    <div>
      <a href = {w.url} target = "_blank" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          join
        </a>
    </div>
    </div>
  </div>
</div>)}
</div>

  )
}

export default UpcomingActivity