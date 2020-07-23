<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import Header from "./components/Header.svelte";
  import Home from "./components/Home.svelte";
  import Projects from "./components/posts/Projects.svelte";
  import Skills from "./components/posts/Skills.svelte";
  import Education from "./components/posts/Education.svelte";
  import Blogs from "./components/posts/Blogs.svelte";
  import Footer from "./components/Footer.svelte";

  //import stores data
  import {
    posts,
    blogs,
    skills,
    projects,
    education
  } from "./stores/postStore.js";

  //generate tabs for header

  let pageTabs = ["Home", "Projects", "Skills", "Education", "Blogs"];
  let activeTab = "Home";

  const tabChange = e => {
    activeTab = e.detail;
  };
  //get posts from backend
  //initialize post values to bind with form

  let title = "";
  let category = "";
  let tags = "";
  let content = "";

  //initialize array of different posts including the all posts

  //make api call to get all posts

  onMount(async () => {
    const { data } = await axios.get("http://localhost:3000/api/posts");
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
  //add post
  async function addNewPost() {
    const post = {
      title: title,
      category: category,
      tags: tags,
      content: content
    };
    const response = await axios.post(
      "http://localhost:3000/api/posts/createpost",
      post
    );

    if (response.status === 200) {
      $posts = [response.data, ...$posts];
      $projects = $posts.filter(post => post.category === "Projects");
      $skills = $posts.filter(post => post.category === "Skills");
      $education = $posts.filter(post => post.category === "Education");
      $blogs = $posts.filter(post => post.category === "Blogs");
      console.log("Posts after adding new post", $posts);
    } else {
      let errorMessage = "Something went wrong in adding post.";
    }

    activeTab = post.category;

    //reset the values
    title = "";
    category = "";
    tags = "";
    content = "";
  }
  //delete post

  const deletePost = async e => {
    const postId = e.detail;
    const response = await axios.post(
      `http://localhost:3000/api/posts/delete/${postId}`
    );
    if (response.status === 200) {
      console.log("After delete response", response);
      $posts = $posts.filter(post => post.id !== postId);
      $projects = $posts.filter(post => post.category === "Projects");
      $skills = $posts.filter(post => post.category === "Skills");
      $education = $posts.filter(post => post.category === "Education");
      $blogs = $posts.filter(post => post.category === "Blogs");
    }
  };
</script>

<style>
  .app-wrapper {
    background: white;
    max-width: 1200px;
    margin: auto;
  }
  main {
    background: white;
    width: 100%;
    padding: 8px;
    margin: 1px auto;
  }
  form {
    width: 100%;
    max-width: 800px;
    margin: auto;
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 1px 2px 3px #aaa;
    padding: 16px;
  }
  input,
  label,
  textarea {
    display: block;
    width: 98%;
    padding: 2px;
  }
  .button-container {
    text-align: right;
    padding-right: 8px;
  }
  .add-post-button {
    transition: 250ms all ease-in-out;
  }
  .add-post-button:hover {
    border: 1px solid rgb(0, 100, 200);
  }
</style>

<section class="app-wrapper">
  <Header {pageTabs} {activeTab} on:tabChange={tabChange} />
  <main>
    {#if activeTab === 'Home'}
      <Home {$posts} on:deletePost={deletePost} />
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
  <div class="form-container">
    <form on:submit|preventDefault={addNewPost}>
      <h3 class="section-title">Add New Post</h3>
      <label for="title">Title:</label>
      <input type="text" id="title" bind:value={title} required />
      <label for="category">Category</label>
      <select id="category" bind:value={category} autofocus required>
        <option value="" />
        <option value="Projects" selected>Projects</option>
        <option value="Skills">Skills</option>
        <option value="Education">Education</option>
        <option value="Blogs">Blogs</option>
      </select>
      <label for="tags">Tags</label>
      <input type="text" bind:value={tags} required />
      <label for="content">Content</label>
      <textarea
        name=""
        id="content"
        cols="30"
        rows="10"
        bind:value={content}
        required />
      <div class="button-container">
        <button class="add-post-button">Add Post</button>
      </div>

    </form>
  </div>
  <Footer />
</section>
