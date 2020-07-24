<script>
  import axios from "axios";
  import { user } from "../../stores/userStore.js";
  import { fade, slide, scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import {
    posts,
    projects,
    skills,
    education,
    blogs
  } from "../../stores/postStore.js";

  //delete post

  const deletePost = async id => {
    if ($user && $user.adminStatus === 1) {
      const response = await axios.post(
        `https://localhost:3000/api/posts/delete/${id}`
      );
      if (response.status === 200) {
        console.log("After delete response", response);
        $posts = $posts.filter(post => post.id !== id);
        $projects = $posts.filter(post => post.category === "Projects");
        $skills = $posts.filter(post => post.category === "Skills");
        $education = $posts.filter(post => post.category === "Education");
        $blogs = $posts.filter(post => post.category === "Blogs");
      }
    } else {
      console.log("You are not authorized to delete post");
    }
  };
</script>

<style>
  .home-page {
    height: 100%;
    overflow: auto;
    padding: 8px;
    margin: auto;
    width: 98%;
  }
  .home-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 8px;
  }
  @media (max-width: 650px) {
    .home-content {
      grid-template-columns: 1fr;
    }
  }
</style>

<main class="home-page">
  <h2 class="page-title">Welcome</h2>
  <div class="home-content">
    <article class="static-content">
      <h3 class="section-title">Static Content</h3>
    </article>
    <article class="latest-posts">
      <h2 class="section-title">Latest Posts</h2>
      {#if $posts.length > 0}
        <div class="home-posts">
          {#each $posts as item (item.id)}
            <div
              class="post"
              in:fade
              out:scale|local
              animate:flip={{ duration: 500 }}>
              <p>{item.category}</p>
              <h3 class="post-title">{item.title}</h3>
              <div class="post-content">
                {@html item.content}
              </div>
              <p>Tags: {item.tags}</p>
              <p>Posted on: {item.posted_date}</p>
              <p>
                {#if $user && $user.adminStatus === 1}
                  <button on:click={() => deletePost(item.id)}>Delete?</button>
                  <button>Update</button>
                {/if}
              </p>
            </div>
          {/each}
        </div>
      {:else}
        <p>No posts yet. They are coming</p>
      {/if}

    </article>

  </div>
</main>
