const settings = require('electron-settings');
const scan = require('./scanner.js')



	
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  document.title = 'Previously on ' + new Date().toLocaleString('en-US', {month: 'long'}) + ' ' + new Date().getDate()

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

	document.body.addEventListener('dblclick', toggleFullscreen)


  initSlider()
})

function toggleFullscreen() {
	if (document.fullscreenElement) {
        // fullscreen is activated
        document.exitFullscreen();
    } else {
        // fullscreen is cancelled
        document.body.requestFullscreen();

    }
}


function initSlider() {
	scan(settings.get('rootFolder'), new Date()).then( images => {

		const wrapper = document.createElement('div')
		const template = `<div uk-slideshow="animation: scale; autoplay: true; pause-on-hover: false" >
	      <ul class="uk-slideshow-items" uk-height-viewport>
	          ${images.map(img => {
					return `<li>
	              <div class="uk-position-cover uk-animation-kenburns uk-animation-reverse uk-transform-origin-center-left">
	                
	              <img src="${img}" alt="" uk-cover>
	              </div>
	          </li>`
				}).join('')}
	      </ul>
	    </div>`

		wrapper.innerHTML = template

    	document.body.appendChild(wrapper)

		/*images.forEach(image => {
			const img = document.createElement('img')
			img.src = image
			document.body.appendChild(img)
		})*/
	})

}