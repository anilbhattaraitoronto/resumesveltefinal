<script>
  import { skills } from "../../stores/postStore.js";
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
  <h2 class="page-title">Skills</h2>
  <div class="posts">
    {#if $skills.length > 0}
      {#each $skills as item}
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
      <p>No skills yet, but they are coming soon.</p>
    {/if}
  </div>
</main>
