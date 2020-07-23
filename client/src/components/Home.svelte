<script>
  import { fade, slide, scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import { posts } from "../stores/postStore.js";
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
                <button on:click={() => dispatch('deletePost', item.id)}>
                  Delete?
                </button>
                <button>Update</button>
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
