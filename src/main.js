import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'

import App from './App.vue'

Vue.use(VueCompositionApi);

const node = document.createElement('div');
document.body.append(node);

new Vue({
    render: h => h(App)
}).$mount(node);
