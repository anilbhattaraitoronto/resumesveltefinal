<script>
  import axios from "axios";
  import { user } from "../stores/userStore.js";
  import { push } from "svelte-spa-router";
  let email;
  let password;
  let errorMessage;

  $: console.log("Signup user: ", $user);
  async function login() {
    if ($user === null) {
      const response = await axios.post(
        "https://abresume.playingpets.com/api/users/login",
        { email, password }
      );
      if (response.status === 200) {
        console.log(response.data);
        $user = response.data.loggedInUser;
        console.log($user);
        if ($user.adminStatus == 1) {
          push("/addpost");
        } else {
          push("/");
        }
      }
    } else {
      errorMessage = "You are already logged in.";
      console.log(errorMessage);
    }
  }
</script>

<style>
  form {
    width: 100%;
    max-width: 800px;
    margin: auto;
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 1px 2px 3px #aaa;
    padding: 16px;
  }
  input,
  label {
    display: block;
    width: 98%;
    padding: 2px;
  }
  label {
    color: white;
    margin: 4px 0;
  }
  a {
    color: yellow;
  }
</style>

<form on:submit|preventDefault={login}>
  <label for="email">Email:</label>
  <input type="email" required bind:value={email} />
  <label for="password">Password:</label>
  <input type="password" required bind:value={password} />
  <button>Login</button>
  <a href="#/signup" class="main-link">No Account? Signup now.</a>

</form>
