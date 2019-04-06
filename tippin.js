var scripter = document.createElement('script');
scripter.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js';
scripter.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(scripter);
window.onload = function () {
    var h = false;

    $(document).ready(function () {
        var b = '		<style>		/*Button*/			.button-filled				{				width: 120px;				min-width: 30px;				height: 40px;				line-height: 2.5;				text-align: center;				cursor: pointer;				/* Rectangle 2: */				background: #fc7e7e;				box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20);				border-radius: 4px;				/* Sign up: */				font-family: Futura, Helvetica;				font-size: 16px;				color: #FFFFFF;			}			.button-filled:hover			{				background:#606060;				box-shadow: 0 0px 0px 0 rgba(0,0,0,0,0);				/*Move it down a little bit*/				position: relative;				top: 2px;			}			.button-filled:active			{				background: #fc7e7e;				/*Move it down a little bit*/				position: relative;				top: 2px;				/*RemoveShadow*/				box-shadow: 0 0px 0px 0 rgba(0,0,0,0,0);			}			.modal-tippin-container {			    position: fixed;			    z-index: 1000;			    text-align: left;			    left: 0;			    top: 0;			    width: 100%;			    height: 100%;			    background-color: rgba(0, 0, 0, 0.5);			    opacity: 0;			    visibility: hidden;			    transform: scale(1.1);			    transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;			}			.modal-tippin-content {			    position: absolute;			    top: 50%;			    left: 50%;			    transform: translate(-50%, -50%);			    background-color: white;			    width: 400px;			    height: 590px;			    border-radius: 0.5rem;			    /*Rounded shadowed borders*/				box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.15);				border-radius: 5px;			}			.close-button {			    float: right;			    width: 1.5rem;			    line-height: 1.5rem;			    text-align: center;			    cursor: pointer;			    margin-right:20px;			    margin-top:10px;			    border-radius: 0.25rem;			    background-color: lightgray;			}			.close-button:hover {			    background-color: darkgray;			}			.show-modal-tippin {			    opacity: 1;			    visibility: visible;			    transform: scale(1.0);			    transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;			}			/* Mobile */			@media screen and (min-device-width: 160px) and ( max-width: 1077px ) /*No tendria ni por que poner un min-device, porq abarca todo lo humano...*/			{			}		</style>';
        $('head').append(b); 
        var c = document.getElementById('tippin-button'); 
        var d = c.dataset;
        c.innerHTML = "âš¡ï¸ tippin.me"; c.className += ' button-filled';
        var e = document.createElement('div'); 
        e.className += ' modal-tippin-container'; 
        e.innerHTML = '			<div class="modal-tippin-content">            	<span class="close-button">&times;</span>			</div>		';
        document.getElementsByTagName('body')[0].appendChild(e);
        var f = document.getElementsByClassName('modal-tippin-content').item(0);
        var g = document.getElementsByClassName('close-button').item(0);
        function toggleModal() { e.classList.toggle("show-modal-tippin") }
        function windowOnClick(a) { if (a.target === e) { toggleModal() } }
        g.addEventListener("click", toggleModal);
        window.addEventListener("click", windowOnClick);
        c.addEventListener("click", function () {
            if (h == false) {
                var a = createIframeElement(d);
                f.appendChild(a);
                h = true
            } toggleModal()
        })
    });
    function createIframeElement(attributes = {}) {
        const iframe = document.createElement('iframe');
        iframe.style.border = 'none'; iframe.style.width = '350px';
        iframe.style.height = '530px'; iframe.style.marginLeft = '25px';
        iframe.scrolling = 'no';
        const query = { to: attributes.dest, amt: attributes.amount, ccy: attributes.currency, lbl: attributes.label, opd: attributes.opReturn };
        iframe.src = 'https://tippin.me/buttons/send-lite.php?u=' + attributes.dest;
        return iframe
    }
}