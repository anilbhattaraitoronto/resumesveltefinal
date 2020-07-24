<script>
  import axios from "axios";
  import {
    posts,
    projects,
    skills,
    education,
    blogs
  } from "../../stores/postStore.js";
  import { push } from "svelte-spa-router";
  import { user } from "../../stores/userStore.js";
  export let title = "";
  export let category = "";
  export let tags = "";
  export let content = "";

  //add post
  async function addNewPost() {
    if ($user && $user.adminStatus === 1) {
      const post = {
        title: title,
        category: category,
        tags: tags,
        content: content
      };
      const response = await axios.post(
        "https://abresume.playingpets.com/api/posts/createpost",
        post
      );

      if (response.status === 200) {
        $posts = [response.data, ...$posts];
        $projects = $posts.filter(post => post.category === "Projects");
        $skills = $posts.filter(post => post.category === "Skills");
        $education = $posts.filter(post => post.category === "Education");
        $blogs = $posts.filter(post => post.category === "Blogs");
      } else {
        let errorMessage = "Something went wrong in adding post.";
      }

      //reset the values
      title = "";
      category = "";
      tags = "";
      content = "";
      push("/allposts");
    } else {
      console.log("You are not authorized to add post.");
      title = "";
      category = "";
      tags = "";
      content = "";
      push("/allposts");
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

{#if $user && $user.adminStatus === 1}
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
{:else}
  <p>You need to be staff to add post</p>
{/if}
