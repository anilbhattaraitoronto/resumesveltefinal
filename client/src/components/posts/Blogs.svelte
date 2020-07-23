<script>
  import { blogs } from "../../stores/postStore.js";
</script>

<style>
  .post-container {
    height: 100%;
    overflow: auto;
    padding: 8px;
    margin: auto;
    width: 98%;
  }
</style>

<main class="post-container">
  <h2 class="page-title">Blogs</h2>
  <div class="posts">
    {#if $blogs.length > 0}
      {#each $blogs as item}
        <div class="post">
          <p>{item.category}</p>
          <h3 class="post-title">{item.title}</h3>
          <div class="post-content">
            {@html item.content}
          </div>
          <p>Tags: {item.tags}</p>
          <p>Posted on: {item.posted_date}</p>
          <p />
        </div>
      {/each}
    {:else}
      <p>There is no blog yet.</p>
    {/if}
  </div>
</main>
