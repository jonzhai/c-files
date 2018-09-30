import Vue from 'vue';

// 使用 Event Bus
const bus = new Vue();

export default bus;


document.body.onscroll = function(){
	let top = document.body.scrollTop;
	let height = document.documentElement.clientHeight;
	if(top+height == document.body.clientHeight){
		console.log(1)
	}
}