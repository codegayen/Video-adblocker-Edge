setInterval(()=>{
 if( ! document.querySelector('.ad-showing') ) return
 
          const video=document.querySelector('video')
          if( ! video)  return
  
          const btn=document.querySelector(".ytp-ad-skip-button")
          if( btn) {
            btn.click()
          } else {
            video.currentTime = isNaN(video.duration) ? 0 : video.duration
          }
},300)




   
          






   
          

   
          
