<script>
  import axios from "axios";
  import { user } from "../stores/userStore.js";
  import { push } from "svelte-spa-router";

  async function logout() {
    if ($user !== null) {
      console.log("Proceed to logout");
      console.log("User to logout", $user);
      await axios.post("http://localhost:3000/api/users/logout");
      $user = null;
      console.log("user logged out", $user);
      push("/allposts");
    } else {
      console.log("You are not logged in. No need to log out.");
    }
  }
  $: console.log("User is: ", $user);
  $: console.log($user === null);
</script>

<style>
  .main-nav {
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 8px 0;
  }
  .main-link {
    all: unset;
    cursor: pointer;
    color: white;
    padding: 0 16px;
    text-decoration: none;
    font-size: 13px;
    letter-spacing: 1px;
  }
  .main-link:hover {
    color: yellow;
    text-decoration: underline;
  }
</style>

<nav class="main-nav">
  <a href="#/" class="main-link">Home</a>
  <div class="auth-links">
    {#if $user === null}
      <a href="#/login" class="main-link">Login</a>
    {:else if $user !== null}
      <button class="main-link" on:click={logout}>Logout</button>
      <a href="#/profile" class="main-link">Profile</a>
    {/if}
  </div>
  <div class="post-links">
    <a href="#/allposts" class="main-link">All Posts</a>
    <a href="#/projects" class="main-link">Projects</a>
    <a href="#/skills" class="main-link">Skills</a>
    <a href="#/education" class="main-link">Education</a>
    <a href="#/blogs" class="main-link">Blogs</a>
    {#if $user !== null && $user.adminStatus == 1}
      <a href="#/addpost" class="main-link">Add Post</a>
    {/if}

  </div>

</nav>
