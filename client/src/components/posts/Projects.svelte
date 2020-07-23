<script>
  import { projects } from "../../stores/postStore.js";
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
  <h2 class="page-title">Projects</h2>
  <div class="posts">
    {#if $projects.length > 0}
      {#each $projects as project}
        <div class="post">
          <p>{project.category}</p>
          <h3 class="post-title">{project.title}</h3>
          <div class="post-content">
            {@html project.content}
          </div>
          <p>Tags: {project.tags}</p>
          <p>Posted on: {project.posted_date}</p>
          <p />
        </div>
      {/each}
    {:else}
      <p>No project yet, but they will come.</p>
    {/if}
  </div>
</main>
