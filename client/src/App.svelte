<script>
  import Router from "svelte-spa-router";

  import axios from "axios";
  import { onMount } from "svelte";
  import { user } from "./stores/userStore.js";
  import Header from "./components/Header.svelte";
  import Navbar from "./components/Navbar.svelte";
  import Home from "./pages/Home.svelte";

  import Signup from "./pages/Signup.svelte";
  import Login from "./pages/Login.svelte";

  import AllPosts from "./pages/posts/AllPosts.svelte";

  import Projects from "./pages/posts/Projects.svelte";
  import Skills from "./pages/posts/Skills.svelte";
  import Education from "./pages/posts/Education.svelte";
  import Blogs from "./pages/posts/Blogs.svelte";
  import AddPostForm from "./pages/posts/AddPostForm.svelte";
  import Footer from "./components/Footer.svelte";

  //import stores data
  import {
    posts,
    blogs,
    skills,
    projects,
    education
  } from "./stores/postStore.js";

  $: console.log("useris ", $user);
  //generate tabs for header

  //get posts from backend
  //initialize post values to bind with form

  let title = "";
  let category = "";
  let tags = "";
  let content = "";

  //initialize array of different posts including the all posts

  //make api call to get all posts

  onMount(async () => {
    const { data } = await axios.get("https://abresume.playingpets.com/api/posts");
    if (data) {
      $posts = data;
      $projects = $posts.filter(post => post.category === "Projects");
      $skills = $posts.filter(post => post.category === "Skills");
      $education = $posts.filter(post => post.category === "Education");
      $blogs = $posts.filter(post => post.category === "Blogs");
    } else {
      console.log("There is no posts yet.");
    }
  });

  //routes
  const routes = {
    "/": Home,
    "/signup": Signup,
    "/login": Login,
    "/allposts": AllPosts,
    "/projects": Projects,
    "/skills": Skills,
    "/education": Education,
    "/blogs": Blogs,
    "/addpost": AddPostForm
  };
</script>

<style>
  .app-wrapper {
    background: white;
    max-width: 1200px;
    margin: auto;
  }
  main {
    /* background: white; */
    width: 100%;
    max-width: 1000px;
    margin: 8px auto;
    box-shadow: 1px 2px 3px #aaa;
    padding: 40px;
  }
</style>

<Navbar />
<main>

  <Router {routes} />
</main>

<!-- <section class="app-wrapper">
  <Header {pageTabs} {activeTab} on:tabChange={tabChange} />
  <main>
    {#if activeTab === 'Home'}
      <AllPosts {$posts} on:deletePost={deletePost} />
    {:else if activeTab === 'Projects'}
      <Projects {$projects} />
    {:else if activeTab === 'Skills'}
      <Skills {$skills} />
    {:else if activeTab === 'Education'}
      <Education {$education} />
    {:else if activeTab === 'Blogs'}
      <Blogs {$blogs} />
    {:else}
      <p>No Active Tabs</p>
    {/if}
  </main>

  <Footer />
</section> -->
