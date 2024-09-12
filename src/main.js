import App from "./App.js"

var vm = new Vue({

    // register components
    components:{
        App,

    },
    data(){return{
        parentMessage:'Hello',
    }},
    // template:`<App />`,
    // template:template,
    render: (h)=> h(App),

});
vm.$mount('#app');
$vm = vm;