<template>

<h1>login</h1>
<div class="Register">
<input id="SignUp-input2" v-model="Email" type="text" placeholder="Email">
<input id="SignUp-input3" v-model="Password" type="password" placeholder="Password">
<button v-on:click="Login" class="SignUp-button">Login</button>
<p>
    <RouterLink to="/Signup">Signup</RouterLink>
</p>
</div>
</template>
<script>
import axios from 'axios'
export default{
    name:'LoginPage',
    data(){
        return{
            Email:'',
            Password:'',
        }
    },
    methods:{
       async Login(){
        let result = await axios.get(
            `http://localhost:3000/Users?Email=${this.Email}&Password=${this.Password}`
        );
        if(result.status === 200 && result.data.length > 0){
            localStorage.setItem('user-info',JSON.stringify(result.data[0]));
            this.$router.push({name:"HomePage"})
        }
            console.log(result);
            alert('Login Function')

        }
    },
    mounted(){
        let User = localStorage.getItem('user-info');
        if(User){
            this.$router.push({name:'HomePage'})
        }
    }
}
</script>