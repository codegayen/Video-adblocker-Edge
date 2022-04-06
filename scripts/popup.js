domReady(() => {
  translateHTML()
  linkButton()
  hoverButton()
})

function domReady (callback) {
  if (document.readyState === 'complete') {
    callback()
  } else {
    window.addEventListener('load', callback, false);
  }
}

function translateHTML (dataKey = 'message') {
  for (const $element of document.getElementsByTagName('*')) {
    if ($element.dataset && $element.dataset[dataKey]) {
      $element.innerHTML = chrome.i18n.getMessage($element.dataset[dataKey])
    }
  }
}


function linkButton() {
  document.querySelector('.teaser').href = `https://microsoftedge.microsoft.com/addons/detail/video-ads-blocker-for-you/panjahiklijbfpnfhopdgkpacpdnjnan`;
  document.querySelector('.youtube').href = `https://youtube.com/c/HemantaGayen`;
  document.querySelector('.facebook').href = `https://www.facebook.com/codehemu/`;
  document.querySelector('.website').href = `https://www.codehemu.com/2022/03/block-youtube-ads-and-video-ads-in.html`;
}

function hoverButton(){
  document.querySelector(".div_myadblock").addEventListener("mouseover" , mouseOver);
  document.querySelector(".div_myadblock").addEventListener("mouseout" , mouseOut);
  document.querySelector(".cta-description").addEventListener("click", linkopen);
  document.querySelector(".cta-close").addEventListener("click", messageclose);
  document.querySelector("#header-icons").addEventListener("click", headericons);
  if (localStorage.block=="block") {
    document.querySelector(".div_myadblock").style.display="none";
  }

}  
function mouseOver() {
  if (localStorage.message=="nyancat") {
    document.querySelector(".cta-message").innerText="Install YouTube Nyan Cat";
    document.querySelector(".div_myadblock").style.background="#a900ff";
  }else{
    document.querySelector(".cta-message").innerText="Install MyTube for YouTube™";
    document.querySelector(".div_myadblock").style.background="#0047ff";
  }
    
    document.querySelector(".cta-close").style.display="block";
} 

function mouseOut() {
    document.querySelector(".cta-message").innerText="Upgrade your YouTube";
    document.querySelector(".cta-close").style.display="none";
    document.querySelector(".div_myadblock").style.background="#fff";
}

function linkopen(){
  if (localStorage.message=="nyancat") {
    window.open("https://microsoftedge.microsoft.com/addons/detail/youtube-nyan-cat-meow-m/fjffbpgdaepmegimjbndhlpobadbebof",'_blank');
  }else{
    window.open("https://microsoftedge.microsoft.com/addons/detail/mytube-for-youtube%E2%84%A2/jfbcahnffhbepgccnkchdacpcabbalde",'_blank');
  }

}
function messageclose(){
  if (localStorage.message=="nyancat") {
    localStorage.setItem("block", "block");
  }
  document.querySelector(".div_myadblock").style.display="none";
  localStorage.setItem("message", "nyancat");
}
function headericons(){
    window.open("https://www.codehemu.com/2022/03/block-youtube-ads-and-video-ads-in.html",'_blank');
}


