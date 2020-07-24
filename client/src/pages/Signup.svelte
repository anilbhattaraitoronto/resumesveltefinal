<script>
  import axios from "axios";
  import { user } from "../stores/userStore.js";
  import { push } from "svelte-spa-router";
  let email;
  let password;
  let confirmPassword;
  let errorMessage;
  let successMessage;
  $: console.log("User is null?:", $user);
  async function signup() {
    if ($user === null) {
      const response = await axios.post(
        "http://localhost:3000/api/users/signup",
        {
          email,
          password,
          confirmPassword
        }
      );
      if (response.status === 200) {
        console.log(
          "Thank you for signing up. Please check your email and activate your account. "
        );
        push("/");
      }
      console.log("response status is: ", response.status);
    } else {
      console.log("A user is already in session. Please logout to signup.");
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
  }
  .button-container {
    text-align: right;
    padding-right: 8px;
  }
  a {
    color: yellow;
  }
</style>

{#if $user === null}

  <main class="sign-up-page">

    <h2 class="page-title">Signup/Login</h2>
    <form on:submit|preventDefault={signup}>
      <h3 class="form-title">Signup</h3>
      <label for="email">Email:</label>
      <input type="email" id="email" required bind:value={email} />
      <label for="password">Password:</label>
      <input type="password" id="password" required bind:value={password} />
      <label for="confirmPassword">Confirm Password:</label>
      <input
        type="password"
        id="confirmPassword"
        required
        bind:value={confirmPassword} />
      <button>Signup</button>
      <a href="#/login">Already signed up? Login</a>
    </form>

  </main>
{/if}
