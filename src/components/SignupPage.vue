<template>
<div><h1>Sign Up</h1></div>
<div class="Register">
<input id="SignUp-input1" v-model="Name" type="text" placeholder="Enter Name">
<input id="SignUp-input2" v-model="Email" type="text" placeholder="Email">
<input id="SignUp-input3" v-model="Password" type="password" placeholder="Password">
<button v-on:click="SignUp()" class="SignUp-button">Sign Up</button>
<p>
    <RouterLink to="/Login">Login</RouterLink>
</p>
</div>
</template>

<script>
import axios from 'axios'
export default{
    name:'SignupPage',
    data(){
        return{
            Name:'',
            Email:'',
            Password:'',
        }
    },
    methods:{
       async SignUp(){
            let result= await axios.post("http://localhost:3000/Users",{
                Name:this.Name,
                Email:this.Email,
                Password:this.Password,
            });
            console.log(result);
            if(result.status===201){
                alert('signup successful')
                this.$router.push({ path:'/Login'})
            }
            localStorage.setItem("user-info",JSON.stringify(result.data));
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

<style >
.signup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: lightslategrey;
}

.Register {
    position: absolute;
    display: flex;
    flex-direction: column;
    text-align: center;
 
    /* vertical-align: middle; */
    left: 422px;
    top: 100px;
    right: 200;
}

#SignUp-input1,
#SignUp-input2,
#SignUp-input3 {
  margin-top: 10px;
  margin-bottom: 10px;
  height: 50px;
  width: 500px;
  padding: 10px;
  border: 1px solid rgb(231, 231, 231);
  border-radius: 5px;
}

.SignUp-button {
  margin-top: 20px;
  width: 200px;
  height: 40px;
  background-color: rgb(6, 125, 98);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  margin-left: 161px;
}

.SignUp-button:hover {
  background-color: rgb(1, 124, 182);
}
</style>