// vue instence
const RunApp = {
    // start data
   data(){
        return {
            title:"hello from vue js 3..",
            langs: [
                { lang_code: 'EN', lang_name: 'English' },
                { lang_code: 'FR', lang_name: 'Fransh' },
                { lang_code: 'AR', lang_name: 'Arabic' },
            ],
            count:0
        }
   }, // end data

   // start created
   computed: {
        check_lang() {
            // `this` points to the component instance
            return this.langs.length > 0 ? 'Yes' : 'No'
        }
   }, // end computed

   // start functions
   methods: {
        increment() {
        this.count++;
        },
        decrement(){
            this.count--;
        }
  },
  // end functions
}
Vue.createApp(RunApp).mount("#app");